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
import type { UserStatus } from "../types/user";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface UserStatusCardProps {
  status: UserStatus | undefined;
  isLoading: boolean;
}

/**
 * 사용자 현황 정보 카드 컴포넌트
 */
export function UserStatusCard({ status, isLoading }: UserStatusCardProps) {
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

  // 현황 정보 없음
  if (!status) {
    return (
      <Card>
        <CardContent className="py-10">
          <p className="text-center text-red-600">
            현황 정보를 불러올 수 없습니다
          </p>
        </CardContent>
      </Card>
    );
  }

  /**
   * 장치 상태 뱃지 반환
   */
  const getDeviceStatusBadge = () => {
    if (!status.deviceInstalled) {
      return <Badge variant="secondary">미설치</Badge>;
    }

    switch (status.deviceStatus) {
      case "normal":
        return <Badge variant="default">정상</Badge>;
      case "maintenance":
        return <Badge variant="secondary">점검 필요</Badge>;
      case "warning":
        return <Badge variant="destructive">경고</Badge>;
      default:
        return <Badge variant="secondary">알 수 없음</Badge>;
    }
  };

  /**
   * 날짜 포맷팅
   */
  const formatDate = (dateString?: string) => {
    if (!dateString) return "정보 없음";
    try {
      return format(new Date(dateString), "yyyy년 MM월 dd일", { locale: ko });
    } catch {
      return "정보 없음";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>나의 현황</CardTitle>
        <CardDescription>
          음주운전 방지장치 설치 및 운행 현황을 확인하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 장치 설치 여부 */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-500 mb-2">
              장치 설치 여부
            </p>
            <div className="flex items-center gap-2">
              {getDeviceStatusBadge()}
            </div>
          </div>

          {/* 다음 검교정 예정일 */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-500 mb-2">
              다음 검교정 예정일
            </p>
            <p className="text-base font-semibold text-gray-900">
              {formatDate(status.nextInspectionDate)}
            </p>
          </div>

          {/* 최근 로그 제출일 */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-500 mb-2">
              최근 로그 제출일
            </p>
            <p className="text-base font-semibold text-gray-900">
              {formatDate(status.lastLogSubmitDate)}
            </p>
          </div>

          {/* 총 로그 제출 횟수 */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-500 mb-2">
              총 로그 제출 횟수
            </p>
            <p className="text-2xl font-bold text-indigo-600">
              {status.totalLogSubmits}
              <span className="text-sm font-normal text-gray-500 ml-1">회</span>
            </p>
          </div>
        </div>

        {/* 미확인 알림 */}
        {status.pendingNotifications > 0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-medium text-yellow-800">
              확인하지 않은 알림이 {status.pendingNotifications}건 있습니다
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
