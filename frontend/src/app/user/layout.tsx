import { AuthGuard } from "@/components/common/auth-guard";

/**
 * User 레이아웃
 * Admin 완성 후 개발 예정
 */
export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={['user']}>
      <main className="min-h-screen">{children}</main>
    </AuthGuard>
  );
}
