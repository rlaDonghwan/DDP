"use client";

import { RequireRole } from "@/features/auth/components/require-role";
import { AuthenticatedHeader } from "@/components/common/authenticated-header";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Admin 레이아웃
 * Admin 역할만 접근 가능하며, 좌측 사이드바와 상단 네비게이션을 포함합니다.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RequireRole allowedRoles={["admin"]}>
      <div className="flex h-screen flex-col">
        {/* 상단 네비게이션 바 */}
        <AuthenticatedHeader />

        {/* 메인 콘텐츠 영역 */}
        <div className="flex flex-1 overflow-hidden">
          {/* 좌측 사이드바 */}
          <AdminSidebar />

          {/* 콘텐츠 영역 */}
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            {children}
          </main>
        </div>
      </div>
    </RequireRole>
  );
}

/**
 * Admin 사이드바 컴포넌트
 */
function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    {
      label: "대시보드",
      href: "/admin/dashboard",
      icon: "D",
    },
    {
      label: "음주운전자 계정 관리",
      href: "/admin/users",
      icon: "U",
    },
    {
      label: "업체 관리",
      href: "/admin/companies",
      icon: "C",
    },
    {
      label: "장치 관리",
      href: "/admin/devices",
      icon: "M",
    },
    {
      label: "통계 및 리포트",
      href: "/admin/reports",
      icon: "R",
    },
    {
      label: "시스템 설정",
      href: "/admin/settings",
      icon: "S",
    },
  ];

  return (
    <aside className="w-64 border-r bg-white">
      <div className="flex h-full flex-col">
        {/* 사이드바 헤더 */}
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">관리자 메뉴</h2>
          <p className="text-xs text-gray-500 mt-1">Admin Dashboard</p>
        </div>

        {/* 메뉴 목록 */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md text-xs font-bold",
                    isActive
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  )}
                >
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* 사이드바 푸터 */}
        <div className="border-t px-6 py-4">
          <p className="text-xs text-gray-500">
            © 2025 DDP Platform
          </p>
        </div>
      </div>
    </aside>
  );
}