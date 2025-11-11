"use client";

import { useState } from "react";
import { useOperators } from "@/features/operator/hooks/use-operators";
import type { OperatorServiceType } from "@/features/operator/types/operator";
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
import { useRouter } from "next/navigation";
import { MapPin, Phone, Star } from "lucide-react";

/**
 * 업체 검색 페이지
 * 사용자가 설치/수리/검교정 서비스를 제공하는 업체를 검색합니다
 */
export default function OperatorSearchPage() {
  const router = useRouter();
  const [serviceTypeFilter, setServiceTypeFilter] = useState<
    OperatorServiceType | undefined
  >(undefined);

  const {
    data: operators,
    isLoading,
    error,
  } = useOperators({
    serviceType: serviceTypeFilter,
    certificationStatus: "APPROVED", // 승인된 업체만 조회
  });

  /**
   * 서비스 타입 한글 변환
   */
  const getServiceTypeLabel = (type: OperatorServiceType): string => {
    switch (type) {
      case "INSTALLATION":
        return "설치";
      case "REPAIR":
        return "수리";
      case "INSPECTION":
        return "검교정";
      case "MAINTENANCE":
        return "유지보수";
    }
  };

  /**
   * 예약 페이지로 이동
   */
  const handleReservation = (operatorId: string) => {
    router.push(`/user/reservations/new?operatorId=${operatorId}`);
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          업체 검색
        </h1>
        <p className="text-gray-600 mt-2">
          음주운전 방지장치 설치/수리/검교정 서비스를 제공하는 업체를 찾아보세요
        </p>
      </div>

      {/* 검색 필터 */}
      <Card>
        <CardHeader>
          <CardTitle>검색 옵션</CardTitle>
          <CardDescription>
            원하는 서비스 타입으로 업체를 필터링하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">서비스 타입:</label>
            <Select
              value={serviceTypeFilter || "all"}
              onValueChange={(value) =>
                setServiceTypeFilter(
                  value === "all" ? undefined : (value as OperatorServiceType)
                )
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="INSTALL">설치</SelectItem>
                <SelectItem value="REPAIR">수리</SelectItem>
                <SelectItem value="INSPECTION">검교정</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 업체 목록 */}
      {error ? (
        <Card>
          <CardContent className="py-20 text-center">
            <p className="text-red-600 mb-4">
              업체 정보를 불러오는 중 오류가 발생했습니다
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {error instanceof Error ? error.message : "알 수 없는 오류"}
            </p>
            <Button onClick={() => window.location.reload()}>
              페이지 새로고침
            </Button>
          </CardContent>
        </Card>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : operators && operators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {operators.map((operator) => (
            <Card
              key={operator.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {operator.name}
                  {operator.rating && (
                    <div className="flex items-center gap-1 text-sm text-yellow-600">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{operator.rating.toFixed(1)}</span>
                      {operator.reviewCount && (
                        <span className="text-gray-500">
                          ({operator.reviewCount})
                        </span>
                      )}
                    </div>
                  )}
                </CardTitle>
                <CardDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {operator.services.map((service) => (
                      <Badge key={service} variant="secondary">
                        {getServiceTypeLabel(service)}
                      </Badge>
                    ))}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{operator.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span>{operator.phone}</span>
                </div>
                {operator.businessHours && (
                  <div className="text-sm text-gray-500">
                    영업시간: {operator.businessHours}
                  </div>
                )}
                {operator.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {operator.description}
                  </p>
                )}
                <div className="pt-2">
                  <Button
                    onClick={() => handleReservation(operator.id)}
                    className="w-full"
                  >
                    예약하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-20 text-center">
            <p className="text-gray-500">
              {serviceTypeFilter
                ? `${getServiceTypeLabel(
                    serviceTypeFilter
                  )} 서비스를 제공하는 업체가 없습니다`
                : "등록된 업체가 없습니다"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
