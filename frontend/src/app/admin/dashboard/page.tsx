"use client";

import { useDashboard } from "@/features/admin/hooks/use-dashboard";
import { StatsCard } from "@/features/admin/components/dashboard/stats-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * 관리자 종합 현황 대시보드 페이지
 * 시스템의 전체 현황을 한눈에 파악할 수 있는 통계 및 그래프를 제공
 */
export default function AdminDashboardPage() {
  const { data, isLoading, error } = useDashboard();

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">종합 현황 대시보드</h1>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  // 데이터가 없을 때 기본값 설정
  const stats = data?.stats ?? {
    totalSubjects: 0,
    deviceInstallRate: 0,
    todayLogs: 0,
    pendingAlerts: 0,
  };
  const logTrend = data?.logTrend ?? [];
  const regionDistribution = data?.regionDistribution ?? [];
  const recentAlerts = data?.recentAlerts ?? [];

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          종합 현황 대시보드
        </h1>
        <p className="text-gray-600 mt-2">
          시스템의 전체 현황을 한눈에 확인할 수 있습니다.
        </p>
      </div>

      {/* 에러 알림 배너 */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-4">
            <p className="text-sm text-red-600">
              일부 데이터를 불러오는 중 오류가 발생했습니다. 기본 데이터를 표시합니다.
            </p>
          </CardContent>
        </Card>
      )}

      {/* 주요 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="전체 대상자 수"
          value={stats.totalSubjects}
          subtitle="조건부 면허 대상자"
        />
        <StatsCard
          title="장치 설치율"
          value={`${stats.deviceInstallRate}%`}
          valueColor="text-blue-600"
          subtitle="전체 대상자 기준"
        />
        <StatsCard
          title="금일 로그 제출"
          value={stats.todayLogs}
          valueColor="text-green-600"
          subtitle="운행기록 제출 수"
        />
        <StatsCard
          title="미처리 알림"
          value={stats.pendingAlerts}
          valueColor={
            stats.pendingAlerts > 0 ? "text-red-600" : "text-gray-600"
          }
          subtitle="확인 필요"
        />
      </div>

      {/* 로그 제출 추이 차트 (간단한 테이블로 대체) */}
      <Card>
        <CardHeader>
          <CardTitle>최근 7일 로그 제출 추이</CardTitle>
          <CardDescription>
            일별 운행기록 제출 현황 및 알코올 감지 이벤트 수
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>날짜</TableHead>
                <TableHead className="text-right">로그 제출 수</TableHead>
                <TableHead className="text-right">알코올 감지</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logTrend.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-gray-500 py-8">
                    표시할 데이터가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                logTrend.slice(-7).map((item) => (
                  <TableRow key={item.date}>
                    <TableCell className="font-medium">{item.date}</TableCell>
                    <TableCell className="text-right">{item.count}</TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          item.alertCount > 0 ? "text-red-600 font-bold" : ""
                        }
                      >
                        {item.alertCount}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 지역별 분포 */}
      <Card>
        <CardHeader>
          <CardTitle>지역별 분포 현황</CardTitle>
          <CardDescription>지역별 대상자, 업체, 장치 수</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>지역</TableHead>
                <TableHead className="text-right">대상자</TableHead>
                <TableHead className="text-right">업체</TableHead>
                <TableHead className="text-right">장치</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regionDistribution.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                    표시할 데이터가 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                regionDistribution.map((region) => (
                  <TableRow key={region.region}>
                    <TableCell className="font-medium">{region.region}</TableCell>
                    <TableCell className="text-right">
                      {region.subjectCount}
                    </TableCell>
                    <TableCell className="text-right">
                      {region.companyCount}
                    </TableCell>
                    <TableCell className="text-right">
                      {region.deviceCount}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 최근 시스템 알림 */}
      <Card>
        <CardHeader>
          <CardTitle>최근 시스템 알림</CardTitle>
          <CardDescription>확인이 필요한 최근 알림 목록</CardDescription>
        </CardHeader>
        <CardContent>
          {recentAlerts.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              확인이 필요한 알림이 없습니다.
            </p>
          ) : (
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          alert.type === "error"
                            ? "destructive"
                            : alert.type === "warning"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {alert.type === "error"
                          ? "오류"
                          : alert.type === "warning"
                          ? "경고"
                          : "정보"}
                      </Badge>
                      <span className="text-sm font-medium">{alert.title}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {alert.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(alert.createdAt).toLocaleString("ko-KR")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
