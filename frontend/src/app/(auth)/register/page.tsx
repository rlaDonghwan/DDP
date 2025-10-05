import { Header } from "@/components/landing/header";
import { RegisterForm } from "@/features/auth/components/register-form";

/**
 * 사용자 회원가입 페이지
 */
export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-slate-100">
      <Header hideNav />
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-2xl">
          {/* Marketing header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              서비스 회원가입
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              관리자로부터 승인받은 면허번호와 전화번호로 계정을 활성화하세요
            </p>
          </div>

          {/* Registration form */}
          <RegisterForm />
        </div>
      </div>
    </div>
  );
}
