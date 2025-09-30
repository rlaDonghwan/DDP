import { AuthGuard } from "@/components/common/auth-guard";

/**
 * Company 레이아웃
 * Admin 완성 후 개발 예정
 */
export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard allowedRoles={['company']}>
      <main className="min-h-screen">{children}</main>
    </AuthGuard>
  );
}
