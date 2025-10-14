"use client";

import { useSession } from "@/features/auth/hooks/use-session";
import { AuthenticatedHeader } from "@/components/common/authenticated-header";
import { AppSidebar } from "@/components/common/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * 사용자 포털 레이아웃
 * 사용자 역할(user)만 접근 가능하도록 보호합니다
 * shadcn/ui Sidebar와 상단 Header를 포함합니다
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
      <div className="flex h-screen flex-col">
        <div className="h-16 w-full border-b bg-gray-50 animate-pulse"></div>
        <div className="flex-1 bg-gray-50 p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-96" />
          </div>
        </div>
      </div>
    );
  }

  // 인증되지 않았거나 권한이 없는 경우
  if (!isAuthenticated || !user || user.role !== "user") {
    return null; // 리다이렉트 처리 중
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main className="flex w-full flex-1 flex-col">
        {/* 상단 네비게이션 바 */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1">
            <AuthenticatedHeader />
          </div>
        </header>

        {/* 콘텐츠 영역 */}
        <div className="flex flex-1 flex-col overflow-y-auto bg-gray-50">
          <div className="max-w-7xl mx-auto w-full p-8">{children}</div>
        </div>
      </main>
    </SidebarProvider>
  );
}
