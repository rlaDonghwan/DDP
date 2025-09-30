"use client";

import { useSession } from "@/features/auth/hooks/use-session";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
export function AuthenticatedHeader() {
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
    <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 좌측: 로고 */}
        <Link
          href="/"
          className="flex items-center space-x-2 group"
        >
          <span className="text-xl font-bold tracking-tight text-gray-900 group-hover:text-indigo-600 transition-colors">
            DDP
          </span>
        </Link>

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
              {/* 사용자 정보 표시 (데스크톱) */}
              <div className="hidden sm:flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Badge variant={getRoleBadgeVariant(user.role)}>
                  {getRoleLabel(user.role)}
                </Badge>
              </div>

              {/* 드롭다운 메뉴 */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">
                        {getUserInitial(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                      <Badge
                        variant={getRoleBadgeVariant(user.role)}
                        className="w-fit mt-2"
                      >
                        {getRoleLabel(user.role)}
                      </Badge>
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