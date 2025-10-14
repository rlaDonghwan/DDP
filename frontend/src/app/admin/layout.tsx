"use client";

import { RequireRole } from "@/features/auth/components/require-role";
import { AuthenticatedHeader } from "@/components/common/authenticated-header";
import { AppSidebar } from "@/components/common/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

/**
 * Admin 레이아웃
 * Admin 역할만 접근 가능하며, shadcn/ui Sidebar와 상단 네비게이션을 포함합니다.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireRole allowedRoles={["admin"]}>
      <SidebarProvider defaultOpen={true}>
        <div className="flex w-full flex-col">
          {/* 헤더를 전체 너비로 최상단에 배치 */}
          <AuthenticatedHeader
            leftSlot={<SidebarTrigger className="-ml-1" />}
          />

          {/* 사이드바와 메인 콘텐츠를 헤더 아래에 가로로 배치 */}
          <div className="flex flex-1">
            {/* 사이드바를 헤더 아래 왼쪽에 배치 */}
            <AppSidebar />

            {/* 메인 콘텐츠 영역 */}
            <main className="flex-1">
              <div className="flex flex-col gap-4 bg-gray-50 p-6 pt-8 md:pt-10">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </RequireRole>
  );
}
