"use client";

import { useState } from "react";
import { useSession } from "@/features/auth/hooks/use-session";
import {
  useMyReservations,
  useCancelReservation,
} from "@/features/reservation/hooks/use-reservations";
import type { ReservationStatus } from "@/features/reservation/types/reservation";
import { Card, CardContent } from "@/components/ui/card";
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
import { Calendar, MapPin, Phone, Plus, Building } from "lucide-react";

/**
 * 예약 내역 페이지
 * 사용자의 예약 목록을 조회하고 취소할 수 있습니다
 */
export default function ReservationsPage() {
  const router = useRouter();
  const { user } = useSession();
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "ALL">(
    "ALL"
  );

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
      case "MAINTENANCE":
        return "유지보수";
      case "INSTALLATION":
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            나의 예약 내역
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            예약 현황을 확인하고 관리할 수 있습니다
          </p>
        </div>
        <Button
          onClick={() => router.push("/user/operators/search")}
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />새 예약
        </Button>
      </div>

      {/* 필터 */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">
                상태 필터
              </span>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as ReservationStatus | "ALL")
                }
              >
                <SelectTrigger className="w-[140px]">
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
            <div className="text-sm text-gray-600">
              총{" "}
              <span className="font-semibold text-gray-900">
                {filteredReservations.length}
              </span>
              건
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 예약 목록 */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="pt-6">
                <Skeleton className="h-6 w-48 mb-4" />
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
              <Card
                key={reservation.reservationId}
                className="border-0 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="pt-6">
                  {/* 헤더 */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b">
                    <div className="flex items-center gap-3">
                      <Building className="h-5 w-5 text-blue-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {reservation.companyName || "업체 정보 없음"}
                      </h3>
                      {getStatusBadge(reservation.status)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Badge variant="outline" className="font-normal">
                        {getServiceTypeLabel(reservation.serviceType)}
                      </Badge>
                      <span>·</span>
                      <span>
                        {formatKoreanDate(reservation.createdAt, "MM/dd")}
                      </span>
                    </div>
                  </div>

                  {/* 본문 */}
                  <div className="py-4 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <Calendar className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span className="font-medium text-gray-900">
                        예약 날짜:{" "}
                        {formatKoreanDate(
                          reservation.requestedDate,
                          "yyyy년 MM월 dd일 HH:mm"
                        )}
                      </span>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>
                        {reservation.companyAddress || "주소 정보 없음"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <span>
                        {reservation.companyPhone || "전화번호 정보 없음"}
                      </span>
                    </div>
                  </div>

                  {/* 추가 정보 */}
                  {reservation.vehicleInfo && (
                    <div className="py-3 px-4 bg-blue-50 rounded-lg mb-3">
                      <p className="text-xs font-medium text-blue-900 mb-1">
                        차량 정보
                      </p>
                      <p className="text-sm text-blue-800">
                        {reservation.vehicleInfo}
                      </p>
                    </div>
                  )}

                  {reservation.notes && (
                    <div className="py-3 px-4 bg-gray-50 rounded-lg mb-3">
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        요청사항
                      </p>
                      <p className="text-sm text-gray-600">
                        {reservation.notes}
                      </p>
                    </div>
                  )}

                  {reservation.rejectedReason && (
                    <div className="py-3 px-4 bg-red-50 rounded-lg border border-red-100 mb-3">
                      <p className="text-xs font-medium text-red-800 mb-1">
                        거절 사유
                      </p>
                      <p className="text-sm text-red-700">
                        {reservation.rejectedReason}
                      </p>
                    </div>
                  )}

                  {/* 액션 버튼 */}
                  {(reservation.status === "PENDING" ||
                    reservation.status === "CONFIRMED") && (
                    <div className="pt-3 border-t">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
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
                                handleCancelReservation(
                                  reservation.reservationId
                                )
                              }
                              className="bg-red-600 hover:bg-red-700"
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
        <Card className="border-0 shadow-sm">
          <CardContent className="py-20 text-center">
            <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
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
