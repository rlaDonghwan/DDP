/**
 * User 대시보드 (임시 준비 중 페이지)
 * Admin 완성 후 개발 예정
 */
export default function UserDashboard() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 text-3xl font-bold">
          U
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            사용자 대시보드
          </h1>
          <p className="text-lg text-gray-600">
            현재 이 페이지는 개발 중입니다
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <p className="text-sm text-gray-600">
            Admin 기능 완성 후 순차적으로 개발될 예정입니다.
            <br />
            잠시만 기다려주세요.
          </p>
        </div>
      </div>
    </div>
  );
}