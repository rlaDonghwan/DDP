import { Header } from "@/components/landing/header";
import { LoginForm } from "@/features/auth/components/login-form";

/**
 * 업체 전용 로그인 페이지
 */
export default function CompanyLoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-slate-100">
      <Header hideNav />
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-2 items-center">
          {/* Left marketing panel */}
          <div className="hidden lg:block space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                효율적인 고객 관리
                <br />
                <span className="text-blue-600">업체 전용 포털</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                장치 설치 및 수리 업무를 체계적으로 관리하고,
                고객 예약과 일정을 효율적으로 운영할 수 있습니다.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-xl border bg-white/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition">
                <div className="h-6 w-6 text-blue-600 font-bold text-xl">
                  C
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">고객 관리</h3>
                <p className="mt-1 text-sm text-gray-600">
                  고객 정보 및 장치 할당 관리
                </p>
              </div>
              <div className="rounded-xl border bg-white/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition">
                <div className="h-6 w-6 text-blue-600 font-bold text-xl">
                  S
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">
                  일정 관리
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  설치 및 수리 예약 스케줄링
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500">
              © 2025 DDP Platform - Company Portal
            </p>
          </div>

          {/* Right form card */}
          <LoginForm userType="company" />
        </div>
      </div>
    </div>
  );
}
