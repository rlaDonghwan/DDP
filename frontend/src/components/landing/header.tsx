import React from "react";
import { Zap } from "lucide-react";
import Link from "next/link";

export const Header: React.FC<{ hideNav?: boolean }> = ({ hideNav }) => (
  <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/90 backdrop-blur-sm">
    <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
      <div className="flex items-center space-x-2">
        <Zap className="h-6 w-6 text-indigo-600" />
        <span className="text-xl font-bold tracking-tight text-gray-900">
          DDP
        </span>
      </div>
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
      <Link
        href="/login"
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        시스템 로그인
      </Link>
    </div>
  </header>
);

export default Header;
