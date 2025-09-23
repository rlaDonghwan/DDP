import { AuthGuard } from '@/components/common/auth-guard';
import { AppSidebar } from '@/components/common/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <AuthGuard allowedRoles={['company']}>
      <SidebarProvider>
        <div className="flex min-h-screen">
          <AppSidebar />
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </SidebarProvider>
    // </AuthGuard>
  );
}