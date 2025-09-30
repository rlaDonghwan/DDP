export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-slate-100 px-4">
      <div className="max-w-md text-center space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">
            접근 권한 없음
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            이 페이지에 접근할 권한이 없습니다. 권한이 필요한 관리자 기능인 경우
            <br />
            올바른 계정으로 다시 로그인해주세요.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/admin/login"
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 transition"
          >
            관리자 로그인
          </a>
          <a
            href="/login"
            className="rounded-lg border border-indigo-200 bg-white/70 backdrop-blur px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50 transition"
          >
            일반 로그인
          </a>
          <a
            href="/"
            className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
          >
            홈으로
          </a>
        </div>
        <p className="text-xs text-gray-400">© 2025 DDP Platform</p>
      </div>
    </div>
  );
}
