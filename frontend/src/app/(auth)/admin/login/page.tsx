import { Header } from "@/components/landing/header";
import { LoginForm } from "@/features/auth/components/login-form";

/**
 * 관리자 전용 로그인 페이지
 */
export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-white to-slate-100">
      <Header hideNav />
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-2 items-center">
          {/* Left marketing panel */}
          <div className="hidden lg:block space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                통합 운영 관리
                <br />
                <span className="text-orange-600">관리자 전용 포털</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                시스템 전체를 관리하고, 사용자 및 업체 현황을 모니터링하며,
                데이터 기반 의사결정을 내릴 수 있습니다.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-xl border bg-white/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition">
                <div className="h-6 w-6 text-orange-600 font-bold text-xl">
                  M
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">계정 관리</h3>
                <p className="mt-1 text-sm text-gray-600">
                  사용자 및 업체 계정 통합 관리
                </p>
              </div>
              <div className="rounded-xl border bg-white/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition">
                <div className="h-6 w-6 text-orange-600 font-bold text-xl">
                  D
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">
                  데이터 분석
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  실시간 통계 및 리포트 제공
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              © 2025 DDP Platform - Admin Portal
            </p>
          </div>

          {/* Right form card */}
          <LoginForm userType="admin" />
        </div>
      </div>
    </div>
  );
}
