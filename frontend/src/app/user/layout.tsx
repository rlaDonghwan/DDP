"use client";

import { useSession } from "@/features/auth/hooks/use-session";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * 사용자 포털 레이아웃
 * 사용자 역할(user)만 접근 가능하도록 보호합니다
 */
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, isAuthenticated } = useSession();
  const router = useRouter();

  // 인증 및 권한 체크
  useEffect(() => {
    if (!isLoading) {
      // 인증되지 않은 경우 로그인 페이지로 리다이렉트
      if (!isAuthenticated || !user) {
        router.push("/login");
        return;
      }

      // 사용자 역할이 아닌 경우 권한 없음 페이지로 리다이렉트
      if (user.role !== "user") {
        router.push("/unauthorized");
        return;
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  // 인증되지 않았거나 권한이 없는 경우
  if (!isAuthenticated || !user || user.role !== "user") {
    return null; // 리다이렉트 처리 중
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">{children}</div>
    </div>
  );
}
