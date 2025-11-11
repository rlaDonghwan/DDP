"use client";

import { useState } from "react";
import { useSession } from "@/features/auth/hooks/use-session";
import { useCompanyDevices } from "@/features/device/hooks/use-device";
import type { DeviceResponse } from "@/features/device/api/device-api";
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
import { Wrench, Calendar, User, Building } from "lucide-react";
import { formatKoreanDate } from "@/lib/date-utils";
import type { DeviceStatus } from "@/features/company/types/company";

/**
 * 업체 장치 관리 페이지
 */
export default function CompanyDevicesPage() {
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | "ALL">("ALL");
  const { user } = useSession();

  // 업체 ID 가져오기
  const companyId = user?.companyId;

  // 장치 목록 조회
  const { data: devices, isLoading } = useCompanyDevices(companyId || 0);

  // 상태별 필터링
  const filteredDevices =
    statusFilter === "ALL"
      ? devices
      : devices?.filter((device) => device.status === statusFilter);

  /**
   * 상태 뱃지 스타일 (백엔드 DeviceStatus 열거형 기준)
   */
  const getStatusBadge = (status: DeviceStatus) => {
    const styles = {
      AVAILABLE: { variant: "default" as const, text: "사용 가능" },
      INSTALLED: { variant: "secondary" as const, text: "설치됨" },
      UNDER_MAINTENANCE: { variant: "outline" as const, text: "점검 중" },
      DEACTIVATED: { variant: "destructive" as const, text: "비활성화" },
    };
    const config = styles[status];
    return <Badge variant={config.variant}>{config.text}</Badge>;
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            장치 관리
          </h1>
          <p className="text-gray-600 mt-2">
            설치 완료된 음주운전 방지장치 목록을 확인합니다
          </p>
        </div>
      </div>

      {/* 필터 및 목록 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>장치 목록</CardTitle>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                총 <span className="font-semibold">{filteredDevices?.length || 0}</span>대
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as DeviceStatus | "ALL")
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">전체</SelectItem>
                  <SelectItem value="AVAILABLE">사용 가능</SelectItem>
                  <SelectItem value="INSTALLED">설치됨</SelectItem>
                  <SelectItem value="UNDER_MAINTENANCE">점검 중</SelectItem>
                  <SelectItem value="DEACTIVATED">비활성화</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!filteredDevices || filteredDevices.length === 0 ? (
            <div className="text-center py-20">
              <Wrench className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2">
                {statusFilter === "ALL"
                  ? "등록된 장치가 없습니다"
                  : "해당 상태의 장치가 없습니다"}
              </p>
              <p className="text-sm text-gray-400">
                설치 예약 완료 시 자동으로 장치가 등록됩니다
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredDevices.map((device) => (
                <Card
                  key={device.deviceId}
                  className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Wrench className="h-5 w-5" />
                          {device.modelName}
                          {getStatusBadge(device.status)}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          S/N: {device.serialNumber}
                          {device.manufacturerId && ` • 제조업체 ID: ${device.manufacturerId}`}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {device.userId && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                            <User className="h-4 w-4" />
                            설치 사용자 ID
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {device.userId}
                          </p>
                        </div>
                      )}
                      {device.installDate && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            설치일
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatKoreanDate(device.installDate)}
                          </p>
                        </div>
                      )}
                      {device.lastInspectionDate && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            최종 검·교정일
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatKoreanDate(device.lastInspectionDate)}
                          </p>
                        </div>
                      )}
                      {device.nextInspectionDate && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            다음 검·교정 예정일
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatKoreanDate(device.nextInspectionDate)}
                          </p>
                        </div>
                      )}
                      {device.warrantyEndDate && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            보증 종료일
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatKoreanDate(device.warrantyEndDate)}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          업체 ID
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {device.companyId}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                      등록일: {formatKoreanDate(device.createdAt)} • 최종 수정:{" "}
                      {formatKoreanDate(device.updatedAt)}
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
