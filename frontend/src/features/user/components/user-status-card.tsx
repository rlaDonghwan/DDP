"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserStatus, UserProfile } from "../types/user";
import type { DeviceResponse } from "@/features/device/api/device-api";
import type { AdminAction } from "@/features/admin/types/action";
import type { DdayResponse } from "@/features/admin/types/schedule";
import { ACTION_TYPE_LABELS } from "@/features/admin/types/action";
import {
  calculateDday,
  formatKoreanDate,
  getDdayVariant,
} from "@/lib/date-utils";

interface UserStatusCardProps {
  profile: UserProfile | undefined;
  status: UserStatus | undefined;
  device: DeviceResponse | null | undefined;
  ddayData?: DdayResponse | null;
  adminActions?: AdminAction[];
  isLoading: boolean;
  onMarkAsRead?: (actionId: string) => void;
}

/**
 * 사용자 현황 정보 카드 컴포넌트
 */
export function UserStatusCard({
  profile,
  status,
  device,
  ddayData,
  adminActions,
  isLoading,
  onMarkAsRead,
}: UserStatusCardProps) {
  // 로딩 상태
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  // 현황 정보가 없으면 기본값 사용
  const displayStatus: UserStatus = status || {
    deviceInstalled: false,
    deviceStatus: "normal",
    deviceModel: undefined,
    deviceSerialNumber: undefined,
    vehicleInfo: undefined,
    nextInspectionDate: undefined,
    nextLogSubmitDate: undefined,
    lastLogSubmitDate: undefined,
    totalLogSubmits: 0,
    pendingNotifications: 0,
  };

  /**
   * 면허 상태 뱃지 반환
   */
  const getLicenseStatusBadge = () => {
    if (!profile?.licenseStatus) {
      return <Badge variant="secondary">정보 없음</Badge>;
    }

    return profile.licenseStatus === "정상" ? (
      <Badge variant="default">정상</Badge>
    ) : (
      <Badge variant="destructive">조건부</Badge>
    );
  };

  /**
   * 장치 상태 뱃지 반환 (device-service 데이터 우선 사용)
   */
  const getDeviceStatusBadge = () => {
    if (!device) {
      return <Badge variant="secondary">미설치</Badge>;
    }

    switch (device.status) {
      case "INSTALLED":
        return <Badge variant="default">정상 설치됨</Badge>;
      case "AVAILABLE":
        return <Badge variant="secondary">사용 가능</Badge>;
      case "UNDER_MAINTENANCE":
        return <Badge variant="outline">점검 중</Badge>;
      case "DEACTIVATED":
        return <Badge variant="destructive">비활성화</Badge>;
      default:
        return <Badge variant="secondary">알 수 없음</Badge>;
    }
  };

  /**
   * D-day 배지 스타일 반환
   */
  const getDdayBadgeVariant = (
    variant: "urgent" | "warning" | "normal" | "expired"
  ) => {
    switch (variant) {
      case "urgent":
        return "destructive";
      case "warning":
        return "secondary";
      case "expired":
        return "outline";
      default:
        return "default";
    }
  };

  /**
   * D-day 색상 반환
   */
  const getDdayColor = (dday: number | null | undefined): string => {
    if (dday === null || dday === undefined) return "text-gray-600";
    if (dday < 0) return "text-red-600"; // 초과
    if (dday <= 2) return "text-orange-600"; // D-0 ~ D-2
    if (dday <= 6) return "text-yellow-600"; // D-3 ~ D-6
    return "text-green-600"; // D-7 이상
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl">
              {profile?.name || "사용자"}님의 현황
            </CardTitle>
            <CardDescription>
              음주운전 방지장치 설치 및 운행 현황을 확인하세요
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">면허 상태:</span>
            {getLicenseStatusBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 장치 정보 섹션 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            장치 정보
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* 장치 상태 */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
              <p className="text-sm font-medium text-gray-600 mb-2">
                장치 상태
              </p>
              <div className="flex items-center gap-2">
                {getDeviceStatusBadge()}
              </div>
            </div>

            {/* 장치 모델명 */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">모델명</p>
              <p className="text-base font-semibold text-gray-900">
                {device?.modelName || displayStatus.deviceModel || "정보 없음"}
              </p>
            </div>

            {/* 장치 시리얼 번호 */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">S/N</p>
              <p className="text-base font-semibold text-gray-900">
                {device?.serialNumber ||
                  displayStatus.deviceSerialNumber ||
                  "정보 없음"}
              </p>
            </div>

            {/* 설치일 */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-600 mb-2">설치일</p>
              <p className="text-base font-semibold text-gray-900">
                {device?.installDate
                  ? formatKoreanDate(device.installDate)
                  : "정보 없음"}
              </p>
            </div>
          </div>
        </div>

        {/* 일정 정보 섹션 */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            예정 일정
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 다음 로그 제출 예정일 (D-day 표시) */}
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-100">
              <p className="text-sm font-medium text-gray-600 mb-2">
                다음 로그 제출 예정일
              </p>
              {ddayData ? (
                <div className="space-y-2">
                  <div className={`text-3xl font-bold ${getDdayColor(ddayData.dday)}`}>
                    {ddayData.dday !== null && ddayData.dday < 0
                      ? `D+${Math.abs(ddayData.dday)}`
                      : ddayData.dday !== null
                      ? `D-${ddayData.dday}`
                      : "일정 없음"}
                  </div>
                  <p className="text-sm text-gray-600">{ddayData.message}</p>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge
                    variant={getDdayBadgeVariant(
                      getDdayVariant(displayStatus.nextLogSubmitDate)
                    )}
                    className="text-base"
                  >
                    {calculateDday(displayStatus.nextLogSubmitDate)}
                  </Badge>
                  <p className="text-base font-semibold text-gray-900">
                    {formatKoreanDate(displayStatus.nextLogSubmitDate)}
                  </p>
                </div>
              )}
            </div>

            {/* 정기 검·교정 예정일 */}
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-100">
              <p className="text-sm font-medium text-gray-600 mb-2">
                정기 검·교정 예정일
              </p>
              <div className="flex items-center gap-2">
                <Badge
                  variant={getDdayBadgeVariant(
                    getDdayVariant(
                      device?.nextInspectionDate ||
                        displayStatus.nextInspectionDate
                    )
                  )}
                  className="text-base"
                >
                  {calculateDday(
                    device?.nextInspectionDate ||
                      displayStatus.nextInspectionDate
                  )}
                </Badge>
                <p className="text-base font-semibold text-gray-900">
                  {formatKoreanDate(
                    device?.nextInspectionDate ||
                      displayStatus.nextInspectionDate
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 관리자 조치 내역 섹션 */}
        {adminActions && adminActions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              관리자 조치 내역
            </h3>
            <div className="space-y-2">
              {adminActions.slice(0, 3).map((action) => (
                <div
                  key={action.actionId}
                  className={`p-4 border rounded-lg transition-colors cursor-pointer ${
                    !action.isRead
                      ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
                      : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                  }`}
                  onClick={() => {
                    if (!action.isRead && onMarkAsRead) {
                      onMarkAsRead(action.actionId);
                    }
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900">
                          {ACTION_TYPE_LABELS[action.actionType]}
                        </p>
                        {!action.isRead && (
                          <Badge variant="destructive" className="text-xs">
                            NEW
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {action.actionDetail}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatKoreanDate(action.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {adminActions.length > 3 && (
                <p className="text-sm text-gray-500 text-center pt-2">
                  외 {adminActions.length - 3}건의 조치가 더 있습니다
                </p>
              )}
            </div>
          </div>
        )}

        {/* 미확인 알림 */}
        {displayStatus.pendingNotifications > 0 && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-medium text-yellow-800">
              확인하지 않은 알림이 {displayStatus.pendingNotifications}건
              있습니다
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
