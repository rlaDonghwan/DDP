"use client";

import React from "react";
import { Zap } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/features/auth/hooks/use-session";
import { Button } from "@/components/ui/button";

export const Header: React.FC<{ hideNav?: boolean }> = ({ hideNav }) => {
  const router = useRouter();
  const { user, isLoading } = useSession();

  /**
   * 로그인 버튼 클릭 핸들러
   * 인증 상태에 따라 적절한 페이지로 리다이렉트
   */
  const handleLoginClick = () => {
    // 로딩 중이면 클릭 무시 (세션 확인 중)
    if (isLoading) {
      return;
    }

    if (user) {
      // 로그인 상태: 역할에 따라 리다이렉트
      switch (user.role) {
        case "admin":
          router.push("/admin/dashboard");
          break;
        case "company":
          router.push("/company/dashboard");
          break;
        case "user":
        default:
          router.push("/user");
          break;
      }
    } else {
      // 비로그인 상태: 로그인 페이지로 이동
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/90 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
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
        {!hideNav && (
          <nav className="hidden space-x-6 md:flex">
            <a
              href="#overview"
              className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
            >
              사업 개요
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
            >
              주요 기능
            </a>
            <a
              href="#benefits"
              className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
            >
              기대 효과
            </a>
            <a
              href="#contact"
              className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors"
            >
              문의
            </a>
          </nav>
        )}
        <Button
          onClick={handleLoginClick}
          disabled={isLoading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          {isLoading ? "로딩..." : user ? "시스템 입장" : "시스템 로그인"}
        </Button>
      </div>
    </header>
  );
};

export default Header;
