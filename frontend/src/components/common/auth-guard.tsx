'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: Array<'user' | 'company' | 'admin'>;
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  // const { user, isAuthenticated } = useAuthStore();
  // const router = useRouter();
  // const pathname = usePathname();

  // useEffect(() => {
  //   // Skip auth check for login page
  //   if (pathname.startsWith('/login')) {
  //     return;
  //   }

  //   // Redirect to login if not authenticated
  //   if (!isAuthenticated) {
  //     router.push('/login');
  //     return;
  //   }

  //   // Check role permissions
  //   if (allowedRoles && user && !allowedRoles.includes(user.role)) {
  //     router.push('/unauthorized');
  //     return;
  //   }
  // }, [isAuthenticated, user, router, pathname, allowedRoles]);

  // // Show loading skeleton while checking auth
  // if (!isAuthenticated && !pathname.startsWith('/login')) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="space-y-4">
  //         <Skeleton className="h-8 w-48" />
  //         <Skeleton className="h-4 w-32" />
  //       </div>
  //     </div>
  //   );
  // }

  // // Check role permissions
  // if (allowedRoles && user && !allowedRoles.includes(user.role)) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-center">
  //         <h1 className="text-2xl font-bold text-gray-900">접근 권한이 없습니다</h1>
  //         <p className="mt-2 text-gray-600">이 페이지에 접근할 권한이 없습니다.</p>
  //       </div>
  //     </div>
  //   );
  // }

  // 인증 검사 비활성화 - 모든 페이지 접근 허용
  return <>{children}</>;
}