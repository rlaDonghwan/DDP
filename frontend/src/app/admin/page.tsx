import { redirect } from "next/navigation";

/**
 * 관리자 전용 로그인 페이지 (레거시)
 * /login으로 통합되었으므로 리다이렉트
 */
export default function AdminLoginPage() {
  redirect("/login");
}
