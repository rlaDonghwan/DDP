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
import type { Announcement } from "../types/user";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface AnnouncementsCardProps {
  announcements: Announcement[] | undefined;
  isLoading: boolean;
}

/**
 * 공지사항 카드 컴포넌트
 */
export function AnnouncementsCard({
  announcements,
  isLoading,
}: AnnouncementsCardProps) {
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
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  /**
   * 날짜 포맷팅
   */
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "yyyy년 MM월 dd일", { locale: ko });
    } catch {
      return "날짜 오류";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>공지사항</CardTitle>
        <CardDescription>
          관리자가 등록한 전체 공지사항을 확인하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!announcements || announcements.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            등록된 공지사항이 없습니다
          </p>
        ) : (
          <div className="space-y-3">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className={`p-4 rounded-lg border transition-colors ${
                  announcement.important
                    ? "border-red-200 bg-red-50"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    {announcement.important && (
                      <Badge variant="destructive" className="text-xs">
                        중요
                      </Badge>
                    )}
                    <h4 className="text-sm font-semibold text-gray-900">
                      {announcement.title}
                    </h4>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {announcement.content}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>작성자: {announcement.author}</span>
                  <span>{formatDate(announcement.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
