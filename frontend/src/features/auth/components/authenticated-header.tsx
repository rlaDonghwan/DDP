"use client";

import type { ReactNode } from "react";
import { useSession } from "@/features/auth/hooks/use-session";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * 인증된 사용자 네비게이션 바
 * 모든 인증 페이지에서 사용되는 공통 헤더 컴포넌트
 */
export function AuthenticatedHeader({ leftSlot }: { leftSlot?: ReactNode }) {
  const { user, isLoading, logout } = useSession();
  const router = useRouter();

  /**
   * 로그아웃 핸들러
   */
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  /**
   * 사용자 이름 이니셜 생성
   */
  const getUserInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  /**
   * Role 뱃지 색상 반환
   */
  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "default"; // 파란색
      case "company":
        return "secondary"; // 회색
      case "user":
        return "outline"; // 흰색 테두리
      default:
        return "default";
    }
  };

  /**
   * Role 한글 변환
   */
  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "관리자";
      case "company":
        return "업체";
      case "user":
        return "사용자";
      default:
        return role;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 좌측: (옵션) 사이드바 트리거 + 로고 */}
        <div className="flex items-center gap-2">
          {leftSlot ? <div className="-ml-1">{leftSlot}</div> : null}
          <Link
            href="/"
            aria-label="랜딩 페이지로 이동"
            className="flex items-center space-x-2 group"
          >
            <Zap className="h-6 w-6 text-indigo-600 transition-transform group-hover:rotate-12" />
            <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors">
              DDP
            </span>
          </Link>
        </div>

        {/* 우측: 사용자 정보 + 로그아웃 */}
        <div className="flex items-center gap-4">
          {isLoading ? (
            // 로딩 중 스켈레톤
            <div className="flex items-center gap-3">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          ) : user ? (
            // 인증된 사용자 정보 표시
            <>
              {/* 사용자 정보 + 뱃지 드롭다운 (아바타 제거, 뱃지 자체가 트리거) */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900 leading-tight">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate max-w-[160px]">
                    {user.email}
                  </p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Badge
                      variant={getRoleBadgeVariant(user.role)}
                      className="cursor-pointer select-none flex items-center gap-1 px-3 py-1.5 text-xs font-medium ring-1 ring-transparent transition focus-visible:ring-indigo-300"
                    >
                      {getRoleLabel(user.role)}
                      <ChevronDown className="h-3.5 w-3.5 opacity-70 transition-transform group-data-[state=open]:rotate-180" />
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="p-0">
                      <div className="px-3 py-2">
                        <p className="text-sm font-semibold text-gray-900 leading-snug">
                          {user.name}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500 break-all">
                          {user.email}
                        </p>
                        <div className="mt-2 inline-flex">
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {getRoleLabel(user.role)}
                          </Badge>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                    >
                      로그아웃
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          ) : (
            // 인증되지 않음 (로그인 버튼)
            <Link href="/login">
              <Button variant="default">로그인</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
