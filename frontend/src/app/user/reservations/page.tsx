"use client";

import { useState } from "react";
import { useSession } from "@/features/auth/hooks/use-session";
import {
  useMyReservations,
  useCancelReservation,
} from "@/features/reservation/hooks/use-reservations";
import type { ReservationStatus } from "@/features/reservation/types/reservation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { formatKoreanDate } from "@/lib/date-utils";
import { Calendar, MapPin, Phone, Plus } from "lucide-react";

/**
 * 예약 내역 페이지
 * 사용자의 예약 목록을 조회하고 취소할 수 있습니다
 */
export default function ReservationsPage() {
  const router = useRouter();
  const { user } = useSession();
  const [statusFilter, setStatusFilter] = useState<
    ReservationStatus | "ALL"
  >("ALL");

  const { data: reservations, isLoading } = useMyReservations(user?.id);
  const cancelReservationMutation = useCancelReservation();

  /**
   * 상태별 배지 색상
   */
  const getStatusBadge = (status: ReservationStatus) => {
    switch (status) {
      case "PENDING":
        return <Badge variant="secondary">신청</Badge>;
      case "CONFIRMED":
        return <Badge variant="default">확정</Badge>;
      case "REJECTED":
        return <Badge variant="destructive">거절</Badge>;
      case "CANCELLED":
        return <Badge variant="outline">취소</Badge>;
      case "COMPLETED":
        return <Badge>완료</Badge>;
    }
  };

  /**
   * 서비스 타입 한글 변환
   */
  const getServiceTypeLabel = (type: string): string => {
    switch (type) {
      case "INSTALL":
        return "설치";
      case "REPAIR":
        return "수리";
      case "INSPECTION":
        return "검교정";
      default:
        return type;
    }
  };

  /**
   * 예약 취소 핸들러
   */
  const handleCancelReservation = async (id: string) => {
    try {
      await cancelReservationMutation.mutateAsync({ id });
    } catch (error) {
      // 에러는 훅에서 처리됨
    }
  };

  /**
   * 필터링된 예약 목록
   */
  const filteredReservations =
    reservations?.filter((reservation) =>
      statusFilter === "ALL" ? true : reservation.status === statusFilter
    ) || [];

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            나의 예약 내역
          </h1>
          <p className="text-gray-600 mt-2">
            예약 현황을 확인하고 관리할 수 있습니다
          </p>
        </div>
        <Button onClick={() => router.push("/user/operators/search")}>
          <Plus className="w-4 h-4 mr-2" />
          새 예약
        </Button>
      </div>

      {/* 필터 */}
      <Card>
        <CardHeader>
          <CardTitle>필터</CardTitle>
          <CardDescription>예약 상태로 필터링하세요</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">예약 상태:</label>
            <Select
              value={statusFilter}
              onValueChange={(value) =>
                setStatusFilter(value as ReservationStatus | "ALL")
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">전체</SelectItem>
                <SelectItem value="PENDING">신청</SelectItem>
                <SelectItem value="CONFIRMED">확정</SelectItem>
                <SelectItem value="REJECTED">거절</SelectItem>
                <SelectItem value="CANCELLED">취소</SelectItem>
                <SelectItem value="COMPLETED">완료</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 예약 목록 */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredReservations.length > 0 ? (
        <div className="space-y-4">
          {filteredReservations
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((reservation) => (
              <Card key={reservation.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-3">
                      {reservation.operatorName}
                      {getStatusBadge(reservation.status)}
                    </CardTitle>
                    <Badge variant="outline">
                      {getServiceTypeLabel(reservation.serviceType)}
                    </Badge>
                  </div>
                  <CardDescription>
                    신청일: {formatKoreanDate(reservation.createdAt)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">예약 일시:</span>
                    <span>
                      {formatKoreanDate(
                        reservation.reservationDate,
                        "yyyy년 MM월 dd일 HH:mm"
                      )}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{reservation.operatorAddress}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    <span>{reservation.operatorPhone}</span>
                  </div>
                  {reservation.notes && (
                    <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        요청사항
                      </p>
                      <p className="text-sm text-gray-600">
                        {reservation.notes}
                      </p>
                    </div>
                  )}
                  {reservation.rejectionReason && (
                    <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
                      <p className="text-sm font-medium text-red-700 mb-1">
                        거절 사유
                      </p>
                      <p className="text-sm text-red-600">
                        {reservation.rejectionReason}
                      </p>
                    </div>
                  )}
                  {(reservation.status === "PENDING" ||
                    reservation.status === "CONFIRMED") && (
                    <div className="pt-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={cancelReservationMutation.isPending}
                          >
                            예약 취소
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              예약을 취소하시겠습니까?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              취소된 예약은 복구할 수 없습니다. 다시 예약하려면
                              새로 신청해야 합니다.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>돌아가기</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleCancelReservation(reservation.id)
                              }
                            >
                              취소 확인
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-20 text-center">
            <p className="text-gray-500 mb-4">
              {statusFilter === "ALL"
                ? "예약 내역이 없습니다"
                : `${statusFilter} 상태의 예약이 없습니다`}
            </p>
            <Button onClick={() => router.push("/user/operators/search")}>
              <Plus className="w-4 h-4 mr-2" />
              예약 신청하기
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
