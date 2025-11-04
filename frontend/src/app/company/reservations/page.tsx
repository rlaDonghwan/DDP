"use client";

import { useState } from "react";
import {
  useCompanyReservations,
  useApproveReservation,
  useRejectReservation,
  useCompleteReservation,
} from "@/features/company/hooks/use-company";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  MapPin,
  Phone,
  User,
  CheckCircle,
  XCircle,
  Building,
} from "lucide-react";
import { formatKoreanDate } from "@/lib/date-utils";
import type { ReservationStatus } from "@/features/reservation/types/reservation";

/**
 * 업체 예약 관리 페이지
 */
export default function CompanyReservationsPage() {
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "ALL">(
    "ALL"
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedReservationId, setSelectedReservationId] = useState<
    string | null
  >(null);

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
      REJECTED: { variant: "destructive" as const, text: "거절됨" },
    };
    const config = styles[status];

    // 예외 처리: 정의되지 않은 상태인 경우
    if (!config) {
      return <Badge variant="secondary">{status}</Badge>;
    }

    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  /**
   * 서비스 타입 텍스트
   */
  const getServiceTypeText = (type: string) => {
    const typeMap = {
      INSTALL: "설치",
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
        <p className="text-sm text-gray-600 mt-1">
          고객 예약을 확인하고 승인/거절/완료 처리합니다
        </p>
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
                  <SelectItem value="PENDING">대기 중</SelectItem>
                  <SelectItem value="CONFIRMED">승인됨</SelectItem>
                  <SelectItem value="COMPLETED">완료</SelectItem>
                  <SelectItem value="CANCELLED">취소됨</SelectItem>
                  <SelectItem value="REJECTED">거절됨</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-600">
              총{" "}
              <span className="font-semibold text-gray-900">
                {reservations?.length || 0}
              </span>
              건
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 예약 목록 */}
      {!reservations || reservations.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-20 text-center">
            <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2">예약이 없습니다</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => (
            <Card
              key={reservation.reservationId}
              className="border-0 shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="pt-6">
                {/* 헤더 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-blue-600" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {reservation.userName}
                      </h3>
                    </div>
                    {getStatusBadge(reservation.status)}
                  </div>
                  <Badge variant="outline" className="font-normal">
                    {getServiceTypeText(reservation.serviceType)}
                  </Badge>
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
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <span>{reservation.userPhone || "전화번호 정보 없음"}</span>
                  </div>
                  <div className="flex items-start gap-3 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>{reservation.userAddress || "주소 정보 없음"}</span>
                  </div>
                </div>

                {/* 추가 정보 */}
                {reservation.notes && (
                  <div className="py-3 px-4 bg-gray-50 rounded-lg mb-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">
                      요청 사항
                    </p>
                    <p className="text-sm text-gray-600">{reservation.notes}</p>
                  </div>
                )}

                {reservation.status === "CANCELLED" &&
                  reservation.cancelledReason && (
                    <div className="py-3 px-4 bg-red-50 rounded-lg border border-red-100 mb-3">
                      <p className="text-xs font-medium text-red-800 mb-1">
                        취소 사유
                      </p>
                      <p className="text-sm text-red-700">
                        {reservation.cancelledReason}
                      </p>
                    </div>
                  )}

                {reservation.status === "REJECTED" &&
                  reservation.rejectedReason && (
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
                  <div className="pt-3 border-t flex gap-2 justify-end">
                    {reservation.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() =>
                            handleApprove(reservation.reservationId)
                          }
                          disabled={approveMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          승인
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                              onClick={() =>
                                setSelectedReservationId(
                                  reservation.reservationId
                                )
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
                                예약을 거절하시겠습니까? 거절 사유를
                                입력해주세요.
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
                                className="bg-red-600 hover:bg-red-700"
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
                        onClick={() =>
                          handleComplete(reservation.reservationId)
                        }
                        disabled={completeMutation.isPending}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        완료 처리
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
