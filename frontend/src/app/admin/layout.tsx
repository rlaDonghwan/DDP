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
        {/* 상단 헤더 높이만큼 배경바를 고정시켜 사이드바 영역까지 헤더 배경을 확장 */}
        <div className="fixed inset-x-0 top-0 z-30 h-16 border-b bg-white" />
        <AppSidebar className="top-16 z-20" />
        <main className="flex w-full flex-1 flex-col pt-16">
          {/* 상단 네비게이션 바 - 사이드바 트리거를 같은 줄/같은 배경으로 배치 */}
          <AuthenticatedHeader
            leftSlot={<SidebarTrigger className="-ml-1" />}
          />

          {/* 콘텐츠 영역 */}
          <div className="flex flex-1 flex-col gap-4 bg-gray-50 p-6">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </RequireRole>
  );
}
