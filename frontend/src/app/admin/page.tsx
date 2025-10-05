import { redirect } from "next/navigation";

/**
 * Admin 루트 페이지
 * /admin/users (음주운전자 계정 관리)로 리다이렉트
 */
export default function AdminRootPage() {
  redirect("/admin/dashboard");
}
