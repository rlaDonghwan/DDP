import { Header } from "@/components/landing/header";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-slate-100">
      <Header hideNav />
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-2 items-center">
          {/* Left marketing panel */}
          <div className="hidden lg:block space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                안전하고 신뢰할 수 있는
                <br />
                <span className="text-indigo-600">통합 운영 플랫폼</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                조건부 면허 대상자, 제조·수리 업체, 행정 담당자를 하나의
                흐름으로 연결합니다. 데이터 기반 의사결정과 효율적 운영을 지금
                시작하세요.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-xl border bg-white/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition">
                <div className="h-6 w-6 text-indigo-600 font-bold text-xl">U</div>
                <h3 className="mt-3 font-semibold text-gray-900">
                  역할별 포털
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  사용자 · 업체 · 관리자 맞춤형 업무 화면
                </p>
              </div>
              <div className="rounded-xl border bg-white/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition">
                <div className="h-6 w-6 text-indigo-600 font-bold text-xl">S</div>
                <h3 className="mt-3 font-semibold text-gray-900">
                  보안/감사 추적
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  접근 제어 및 감사 로그로 신뢰성 확보
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500">© 2025 DDP Platform</p>
          </div>

          {/* Right form card */}
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
