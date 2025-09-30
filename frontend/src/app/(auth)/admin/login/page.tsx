"use client";

// 관리자 로그인 페이지 (공개 접근)
// 추후 실제 auth 연동 시 /features/auth/login-form 재사용 또는 별도 관리자 validation 추가

import { LoginForm } from "@/features/auth/components/login-form";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-100 px-4 py-12">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Left 설명 패널 */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              관리자 포털 로그인
            </h1>
            <p className="text-base leading-relaxed text-slate-600">
              시스템 운영, 사용자 계정 관리, 업체/장치 모니터링, 보안 및 감사
              설정을 위한 관리자 전용 접근 페이지입니다.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="rounded-xl border bg-white/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition">
              <div className="h-6 w-6 text-indigo-600 font-bold text-xl">U</div>
              <h3 className="mt-3 font-semibold text-gray-900">계정 관리</h3>
              <p className="mt-1 text-sm text-gray-600">
                사용자/업체 권한 및 상태 관리
              </p>
            </div>
            <div className="rounded-xl border bg-white/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition">
              <div className="h-6 w-6 text-indigo-600 font-bold text-xl">S</div>
              <h3 className="mt-3 font-semibold text-gray-900">
                시스템 모니터링
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                장치 데이터와 운영 이벤트 추적
              </p>
            </div>
            <div className="rounded-xl border bg-white/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition">
              <div className="h-6 w-6 text-indigo-600 font-bold text-xl">R</div>
              <h3 className="mt-3 font-semibold text-gray-900">리포트</h3>
              <p className="mt-1 text-sm text-gray-600">
                운영 통계 및 감사 리포트 다운로드
              </p>
            </div>
            <div className="rounded-xl border bg-white/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition">
              <div className="h-6 w-6 text-indigo-600 font-bold text-xl">A</div>
              <h3 className="mt-3 font-semibold text-gray-900">보안</h3>
              <p className="mt-1 text-sm text-gray-600">
                접근 제어 및 로그 감사 기능
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500">© 2025 DDP Platform</p>
        </div>

        {/* Right form card */}
        <LoginForm userType="admin" />
      </div>
    </div>
  );
}
