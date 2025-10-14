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
import type { Notification } from "../types/user";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface NotificationsCardProps {
  notifications: Notification[] | undefined;
  isLoading: boolean;
}

/**
 * 알림 카드 컴포넌트
 */
export function NotificationsCard({
  notifications,
  isLoading,
}: NotificationsCardProps) {
  // 로딩 상태
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  /**
   * 알림 타입별 뱃지 반환
   */
  const getNotificationBadge = (type: Notification["type"]) => {
    switch (type) {
      case "inspection":
        return <Badge variant="default">검교정</Badge>;
      case "log_submit":
        return <Badge variant="secondary">로그 제출</Badge>;
      case "warning":
        return <Badge variant="destructive">경고</Badge>;
      case "system":
      default:
        return <Badge variant="outline">시스템</Badge>;
    }
  };

  /**
   * 날짜 포맷팅
   */
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MM월 dd일 HH:mm", { locale: ko });
    } catch {
      return "날짜 오류";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 알림</CardTitle>
        <CardDescription>
          검사일, 로그 제출일 등 중요한 알림을 확인하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!notifications || notifications.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            새로운 알림이 없습니다
          </p>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                  notification.read
                    ? "border-gray-200 bg-white"
                    : "border-indigo-200 bg-indigo-50"
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {getNotificationBadge(notification.type)}
                    <span className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
                {!notification.read && (
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 rounded-full bg-indigo-600"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
