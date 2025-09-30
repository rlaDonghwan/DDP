"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Admin 대시보드 페이지
 * 시스템 전체 통계 및 모니터링 정보를 표시합니다.
 */
export default function AdminDashboardPage() {
  // TODO: 백엔드 API 연동 필요
  const stats = {
    totalUsers: 156,
    activeUsers: 142,
    totalCompanies: 23,
    totalDevices: 178,
    pendingRequests: 8,
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          관리자 대시보드
        </h1>
        <p className="text-gray-600 mt-2">
          시스템 전체 통계 및 현황을 한눈에 확인하세요.
        </p>
      </div>

      {/* 통계 카드 그리드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 사용자</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              활성: {stats.activeUsers}명
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">등록 업체</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground mt-1">
              제조·수리 업체
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">관리 장치</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDevices}</div>
            <p className="text-xs text-muted-foreground mt-1">
              전체 등록 장치
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">대기 요청</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.pendingRequests}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              처리 대기 중
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 최근 활동 */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>최근 등록 사용자</CardTitle>
            <CardDescription>최근 7일간 신규 등록된 사용자</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: "김철수", date: "2024-03-28", status: "active" },
                { name: "이영희", date: "2024-03-27", status: "pending" },
                { name: "박민수", date: "2024-03-26", status: "active" },
              ].map((user, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.date}</p>
                  </div>
                  <Badge
                    variant={user.status === "active" ? "default" : "secondary"}
                  >
                    {user.status === "active" ? "활성" : "대기"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>시스템 알림</CardTitle>
            <CardDescription>주요 시스템 이벤트 및 알림</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  message: "신규 업체 승인 요청 3건",
                  time: "10분 전",
                  type: "warning",
                },
                {
                  message: "시스템 정기 점검 완료",
                  time: "2시간 전",
                  type: "success",
                },
                {
                  message: "운행기록 로그 업로드 실패 1건",
                  time: "3시간 전",
                  type: "error",
                },
              ].map((notification, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between border-b pb-2 last:border-0"
                >
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.time}
                    </p>
                  </div>
                  <Badge
                    variant={
                      notification.type === "error"
                        ? "destructive"
                        : notification.type === "warning"
                          ? "secondary"
                          : "default"
                    }
                    className="ml-2"
                  >
                    {notification.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}