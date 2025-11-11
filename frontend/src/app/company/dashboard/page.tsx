"use client";

import {
  useCompanyStats,
  useCompanyReservations,
} from "@/features/company/hooks/use-company";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Users,
  Wrench,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react";
import { formatKoreanDate } from "@/lib/date-utils";

/**
 * 업체 대시보드 페이지
 */
export default function CompanyDashboardPage() {
  const router = useRouter();
  const { data: stats, isLoading: statsLoading } = useCompanyStats();
  const { data: reservations, isLoading: reservationsLoading } =
    useCompanyReservations("PENDING");

  /**
   * 오늘 날짜의 예약 필터링
   */
  const todayReservations = reservations?.filter((reservation) => {
    const reservationDate = new Date(reservation.requestedDate);
    const today = new Date();
    return (
      reservationDate.getFullYear() === today.getFullYear() &&
      reservationDate.getMonth() === today.getMonth() &&
      reservationDate.getDate() === today.getDate()
    );
  });

  // 로딩 상태
  if (statsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          대시보드
        </h1>
        <p className="text-gray-600 mt-2">업체 운영 현황을 한눈에 확인하세요</p>
      </div>

      {/* 통계 카드 그리드 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* 총 서비스 건수 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              총 서비스 건수
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats?.totalServiceCount || 0}
            </div>
            <p className="text-xs text-gray-500 mt-2">누적 서비스</p>
          </CardContent>
        </Card>

        {/* 설치 건수 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              설치
            </CardTitle>
            <Wrench className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats?.installationCount || 0}
            </div>
            <p className="text-xs text-gray-500 mt-2">건</p>
          </CardContent>
        </Card>

        {/* 검·교정 건수 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              검·교정
            </CardTitle>
            <CheckCircle className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {stats?.inspectionCount || 0}
            </div>
            <p className="text-xs text-gray-500 mt-2">건</p>
          </CardContent>
        </Card>

        {/* 수리/유지보수 건수 */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              수리/유지보수
            </CardTitle>
            <Wrench className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">
              {(stats?.repairCount || 0) + (stats?.maintenanceCount || 0)}
            </div>
            <p className="text-xs text-gray-500 mt-2">건</p>
          </CardContent>
        </Card>
      </div>

      {/* 매출 및 평균 비용 */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />총 매출
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900">
              {(stats?.totalRevenue || 0).toLocaleString()}원
            </div>
            <p className="text-sm text-gray-500 mt-2">누적 총 매출</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              이번 달 매출
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900">
              {(stats?.thisMonthRevenue || 0).toLocaleString()}원
            </div>
            <p className="text-sm text-gray-500 mt-2">
              서비스 {stats?.thisMonthServiceCount || 0}건
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              평균 서비스 비용
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-gray-900">
              {(stats?.averageServiceCost || 0).toLocaleString()}원
            </div>
            <p className="text-sm text-gray-500 mt-2">평균 비용</p>
          </CardContent>
        </Card>
      </div>

      {/* 오늘의 일정 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>오늘의 일정</CardTitle>
              <CardDescription>
                오늘 예정된 예약 {todayReservations?.length || 0}건
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push("/company/reservations")}
            >
              전체 보기
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {reservationsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-20" />
              ))}
            </div>
          ) : todayReservations && todayReservations.length > 0 ? (
            <div className="space-y-4">
              {todayReservations.slice(0, 5).map((reservation) => (
                <div
                  key={reservation.reservationId}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-900">
                        {reservation.userName}
                      </p>
                      <Badge variant="secondary">
                        {reservation.serviceType === "INSTALLATION"
                          ? "설치"
                          : reservation.serviceType === "REPAIR"
                          ? "수리"
                          : "점검"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {formatKoreanDate(reservation.requestedDate)}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => router.push("/company/reservations")}
                  >
                    상세 보기
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">오늘 예정된 일정이 없습니다</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
