"use client";

import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/user-api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Wrench,
  Calendar,
  Building2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { formatKoreanDate } from "@/lib/date-utils";

/**
 * 사용자 장치 정보 카드 컴포넌트
 * 할당된 장치의 상세 정보를 표시합니다
 */
export function DeviceInfoCard() {
  const {
    data: device,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", "device"],
    queryFn: userApi.getAssignedDevice,
  });

  // 로딩 상태
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-900 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            오류 발생
          </CardTitle>
          <CardDescription className="text-red-700">
            장치 정보를 불러오는 중 오류가 발생했습니다
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // 장치가 할당되지 않은 경우
  if (!device) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            장치 미할당
          </CardTitle>
          <CardDescription className="text-blue-700">
            아직 장치가 할당되지 않았습니다. 업체 검색 페이지에서 예약을
            신청하세요.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  /**
   * 장치 상태 뱃지 렌더링
   */
  const renderStatusBadge = () => {
    const status = device.status.toLowerCase();

    if (status === "installed") {
      return (
        <Badge variant="default" className="gap-1">
          <CheckCircle className="h-3 w-3" />
          설치됨
        </Badge>
      );
    } else if (status === "maintenance") {
      return (
        <Badge variant="outline" className="gap-1">
          <Wrench className="h-3 w-3" />
          점검 중
        </Badge>
      );
    } else {
      return <Badge>{device.status}</Badge>;
    }
  };

  return (
    <Card className="border-l-4 border-l-green-500">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              할당된 장치 정보
            </CardTitle>
            <CardDescription className="mt-2">
              현재 설치된 음주운전 방지장치의 상세 정보입니다
            </CardDescription>
          </div>
          {renderStatusBadge()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 장치 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">모델명</p>
              <p className="text-base font-semibold text-gray-900">
                {device.model}
              </p>
            </div>
          </div>

          {/* 시리얼 번호 */}
          <div>
            <p className="text-sm font-medium text-gray-500">시리얼 번호</p>
            <p className="text-base font-mono font-semibold text-gray-900">
              {device.serialNumber}
            </p>
          </div>

          {/* 설치 정보 */}
          <div className="pt-4 border-t">
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              설치 정보
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  설치일
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {formatKoreanDate(device.installationDate)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                  <Building2 className="h-4 w-4" />
                  설치 업체
                </p>
                <p className="text-base font-semibold text-gray-900">
                  {device.installedBy}
                </p>
              </div>
            </div>
          </div>

          {/* 점검 정보 (있는 경우에만 표시) */}
          {(device.lastInspectionDate || device.nextInspectionDate) && (
            <div className="pt-4 border-t">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                점검 정보
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {device.lastInspectionDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      최종 점검일
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {formatKoreanDate(device.lastInspectionDate)}
                    </p>
                  </div>
                )}
                {device.nextInspectionDate && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      다음 점검일
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {formatKoreanDate(device.nextInspectionDate)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 안내 메시지 */}
          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600">
              장치 관련 문의 사항이 있으시면 설치 업체({device.installedBy})로
              연락해주세요.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
