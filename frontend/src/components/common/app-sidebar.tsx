'use client';

import { Home, FileText, Calendar, Users, BarChart3, Settings, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
} from '@/components/ui/sidebar';

const menuItems = {
  user: [
    {
      title: '대시보드',
      url: '/user/dashboard',
      icon: Home,
    },
    {
      title: '운행기록',
      url: '/user/records',
      icon: FileText,
    },
    {
      title: '예약 관리',
      url: '/user/bookings',
      icon: Calendar,
    },
  ],
  company: [
    {
      title: '대시보드',
      url: '/company/dashboard',
      icon: Home,
    },
    {
      title: '고객 관리',
      url: '/company/customers',
      icon: Users,
    },
    {
      title: '예약 관리',
      url: '/company/bookings',
      icon: Calendar,
    },
    {
      title: '일정 관리',
      url: '/company/schedule',
      icon: Calendar,
    },
  ],
  admin: [
    {
      title: '대시보드',
      url: '/admin/dashboard',
      icon: Home,
    },
    {
      title: '사용자 관리',
      url: '/admin/users',
      icon: Users,
    },
    {
      title: '로그 관리',
      url: '/admin/logs',
      icon: FileText,
    },
    {
      title: '통계 분석',
      url: '/admin/analytics',
      icon: BarChart3,
    },
    {
      title: '시스템 설정',
      url: '/admin/settings',
      icon: Settings,
    },
  ],
};

export function AppSidebar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  const items = menuItems[user.role] || [];

  return (
    <Sidebar>
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="text-sm font-semibold">
            음주운전 방지장치 시스템
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>메인 메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback>
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.role === 'admin' && '관리자'}
                {user.role === 'company' && '업체'}
                {user.role === 'user' && '사용자'}
              </p>
            </div>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}