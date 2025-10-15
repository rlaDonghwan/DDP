"use client";

import { useState } from "react";
import {
  useCompanyReservations,
  useApproveReservation,
  useRejectReservation,
  useCompleteReservation,
} from "@/features/company/hooks/use-company";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, MapPin, Phone, User, CheckCircle, XCircle } from "lucide-react";
import { formatKoreanDate } from "@/lib/date-utils";
import type { ReservationStatus } from "@/features/reservation/types/reservation";

/**
 * 업체 예약 관리 페이지
 */
export default function CompanyReservationsPage() {
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "ALL">("ALL");
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedReservationId, setSelectedReservationId] = useState<string | null>(null);

  const { data: reservations, isLoading } = useCompanyReservations(
    statusFilter === "ALL" ? undefined : statusFilter
  );
  const approveMutation = useApproveReservation();
  const rejectMutation = useRejectReservation();
  const completeMutation = useCompleteReservation();

  /**
   * 예약 승인 처리
   */
  const handleApprove = async (reservationId: string) => {
    await approveMutation.mutateAsync(reservationId);
  };

  /**
   * 예약 거절 처리
   */
  const handleReject = async () => {
    if (!selectedReservationId || !rejectionReason.trim()) return;
    await rejectMutation.mutateAsync({
      id: selectedReservationId,
      reason: rejectionReason,
    });
    setRejectionReason("");
    setSelectedReservationId(null);
  };

  /**
   * 예약 완료 처리
   */
  const handleComplete = async (reservationId: string) => {
    await completeMutation.mutateAsync(reservationId);
  };

  /**
   * 상태 뱃지 스타일
   */
  const getStatusBadge = (status: ReservationStatus) => {
    const styles = {
      PENDING: { variant: "secondary" as const, text: "대기 중" },
      CONFIRMED: { variant: "default" as const, text: "승인됨" },
      COMPLETED: { variant: "outline" as const, text: "완료" },
      CANCELLED: { variant: "destructive" as const, text: "취소됨" },
    };
    const config = styles[status];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  /**
   * 서비스 타입 텍스트
   */
  const getServiceTypeText = (type: string) => {
    const typeMap = {
      INSTALLATION: "설치",
      REPAIR: "수리",
      INSPECTION: "점검",
      ALL: "전체",
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          예약 관리
        </h1>
        <p className="text-gray-600 mt-2">
          고객 예약을 확인하고 승인/거절/완료 처리합니다
        </p>
      </div>

      {/* 필터 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>예약 목록</CardTitle>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                총 <span className="font-semibold">{reservations?.length || 0}</span>건
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as ReservationStatus | "ALL")
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">전체</SelectItem>
                  <SelectItem value="PENDING">대기 중</SelectItem>
                  <SelectItem value="CONFIRMED">승인됨</SelectItem>
                  <SelectItem value="COMPLETED">완료</SelectItem>
                  <SelectItem value="CANCELLED">취소됨</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!reservations || reservations.length === 0 ? (
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2">예약이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <Card
                  key={reservation.id}
                  className="border-l-4 border-l-blue-500"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="h-5 w-5" />
                          {reservation.userName}
                          {getStatusBadge(reservation.status)}
                        </CardTitle>
                        <CardDescription className="mt-2 flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {reservation.userPhone}
                          </span>
                        </CardDescription>
                      </div>
                      <Badge variant="outline">
                        {getServiceTypeText(reservation.serviceType)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          희망 날짜 및 시간
                        </p>
                        <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatKoreanDate(reservation.preferredDate)} •{" "}
                          {reservation.preferredTime}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">주소</p>
                        <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {reservation.address}
                        </p>
                      </div>
                    </div>

                    {reservation.notes && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          요청 사항
                        </p>
                        <p className="text-sm text-gray-600">{reservation.notes}</p>
                      </div>
                    )}

                    {reservation.status === "CANCELLED" &&
                      reservation.cancellationReason && (
                        <div className="mb-4 p-3 bg-red-50 rounded-lg">
                          <p className="text-sm font-medium text-red-800 mb-1">
                            취소 사유
                          </p>
                          <p className="text-sm text-red-700">
                            {reservation.cancellationReason}
                          </p>
                        </div>
                      )}

                    {/* 액션 버튼 */}
                    <div className="flex gap-2 justify-end">
                      {reservation.status === "PENDING" && (
                        <>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(reservation.id)}
                            disabled={approveMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            승인
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  setSelectedReservationId(reservation.id)
                                }
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                거절
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>예약 거절</AlertDialogTitle>
                                <AlertDialogDescription>
                                  예약을 거절하시겠습니까? 거절 사유를 입력해주세요.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="reason">거절 사유</Label>
                                  <Textarea
                                    id="reason"
                                    value={rejectionReason}
                                    onChange={(e) =>
                                      setRejectionReason(e.target.value)
                                    }
                                    placeholder="거절 사유를 입력하세요"
                                    className="min-h-[100px]"
                                  />
                                </div>
                              </div>
                              <AlertDialogFooter>
                                <AlertDialogCancel
                                  onClick={() => {
                                    setRejectionReason("");
                                    setSelectedReservationId(null);
                                  }}
                                >
                                  취소
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleReject}
                                  disabled={
                                    !rejectionReason.trim() ||
                                    rejectMutation.isPending
                                  }
                                >
                                  거절 확인
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                      {reservation.status === "CONFIRMED" && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleComplete(reservation.id)}
                          disabled={completeMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          완료 처리
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
