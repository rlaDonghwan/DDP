"use client";

import { useSession } from "../hooks/use-session";
import { UserRole } from "@/types/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface RequireRoleProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * 역할 기반 권한 체크 컴포넌트
 * 백엔드에서 검증된 Role 정보를 기반으로 접근 권한을 체크합니다.
 */
export function RequireRole({
  allowedRoles,
  children,
  fallback,
}: RequireRoleProps) {
  const { user, isLoading, isAuthenticated } = useSession();
  const router = useRouter();

  // TODO: 개발 중 임시 주석처리 - 로그인 없이 모든 페이지 접근 가능
  useEffect(() => {
    // 로딩 완료 후 인증되지 않은 경우 로그인 페이지로 이동
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  // TODO: 개발 중 임시 주석처리 - 로그인 없이 모든 페이지 접근 가능
  // 로딩 중
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 인증되지 않음
  if (!isAuthenticated || !user) {
    return null; // useEffect에서 리다이렉트 처리
  }

  // 권한 체크
  const hasPermission = allowedRoles.includes(user.role);

  // 권한 없음
  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full px-4">
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <div className="flex flex-col gap-4">
              <div>
                <AlertTitle className="text-red-800 font-bold text-lg">
                  접근 권한이 없습니다
                </AlertTitle>
                <AlertDescription className="text-red-700 mt-2">
                  이 페이지에 접근할 권한이 없습니다.
                  <br />
                  <span className="font-semibold">현재 역할:</span> {user.role}
                  <br />
                  <span className="font-semibold">필요한 역할:</span>{" "}
                  {allowedRoles.join(", ")}
                </AlertDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  이전 페이지
                </Button>
                <Button
                  onClick={() => router.push("/")}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  홈으로 이동
                </Button>
              </div>
            </div>
          </Alert>
        </div>
      </div>
    );
  }

  // 권한 있음 - children 렌더링
  return <>{children}</>;
}
