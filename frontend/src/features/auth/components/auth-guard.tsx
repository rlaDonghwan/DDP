"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/features/auth/hooks/use-session";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserRole } from "@/types/auth";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: Array<UserRole>;
}

/**
 * 인증 가드 컴포넌트
 * 클라이언트 측 인증 체크 및 역할 기반 접근 제어
 */
export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 로그인 페이지는 인증 체크 스킵
    if (pathname.startsWith("/login")) {
      return;
    }

    // 로딩 중이면 대기
    if (isLoading) {
      return;
    }

    // 인증되지 않은 경우 로그인 페이지로 리다이렉트
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // 역할 권한 체크
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      router.push("/unauthorized");
      return;
    }
  }, [isAuthenticated, isLoading, user, router, pathname, allowedRoles]);

  // 로딩 중인 경우 스켈레톤 표시
  if (isLoading && !pathname.startsWith("/login")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  // 인증되지 않은 경우 (리다이렉트 전까지 빈 화면)
  if (!isAuthenticated && !pathname.startsWith("/login")) {
    return null;
  }

  // 역할 권한 체크
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            접근 권한이 없습니다
          </h1>
          <p className="mt-2 text-gray-600">
            이 페이지에 접근할 권한이 없습니다.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
