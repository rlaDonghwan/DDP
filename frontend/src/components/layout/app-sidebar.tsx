"use client";

import {
  Home,
  FileText,
  Calendar,
  Users,
  Settings,
  LogOut,
  ClipboardList,
  Building2,
  Wrench,
  UserCircle,
  ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "@/features/auth/hooks/use-session";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

/**
 * 역할별 메뉴 항목 정의
 */
const menuItems = {
  user: [
    {
      title: "마이페이지",
      url: "/user",
      icon: Home,
    },
    {
      title: "업체 검색",
      url: "/user/operators/search",
      icon: Building2,
    },
    {
      title: "나의 예약",
      url: "/user/reservations",
      icon: Calendar,
    },
    {
      title: "운행기록 제출",
      url: "/user/log/submit",
      icon: ClipboardList,
    },
    {
      title: "제출 이력",
      url: "/user/log",
      icon: FileText,
    },
    {
      title: "개인정보 수정",
      url: "/user/profile",
      icon: UserCircle,
    },
  ],
  company: [
    {
      title: "대시보드",
      url: "/company/dashboard",
      icon: Home,
    },
    {
      title: "예약 관리",
      url: "/company/reservations",
      icon: Calendar,
    },
  
    {
      title: "장치 관리",
      url: "/company/devices",
      icon: Wrench,
    },
    {
      title: "서비스 이력",
      url: "/company/service-records",
      icon: ClipboardList,
    },
  ],
  admin: [
    {
      title: "종합 현황",
      url: "/admin/dashboard",
      icon: Home,
    },
    {
      title: "대상자 관리",
      url: "/admin/subjects",
      icon: Users,
    },
    {
      title: "장치 관리",
      url: "/admin/devices",
      icon: Wrench,
    },
    {
      title: "로그 관리",
      url: "/admin/log",
      icon: FileText,
    },
    {
      title: "업체 관리",
      url: "/admin/companies",
      icon: Building2,
    },
    {
      title: "시스템 관리",
      url: "/admin/system",
      icon: Settings,
    },
  ],
};

/**
 * AppSidebar 컴포넌트
 * 역할(user.role)에 따라 자동으로 메뉴를 표시합니다
 */
export function AppSidebar({ className }: { className?: string }) {
  const { user, logout } = useSession();
  const router = useRouter();

  // 로그아웃 핸들러
  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  // 프로필 페이지 이동
  const handleProfile = () => {
    if (user?.role === "admin") {
      router.push("/admin/profile");
    } else if (user?.role === "company") {
      router.push("/company/profile");
    } else {
      router.push("/user/profile");
    }
  };

  if (!user) return null;

  // 역할에 따라 메뉴 항목 선택
  const items = menuItems[user.role] || [];

  // 역할 표시 텍스트
  const roleText = {
    admin: "관리자",
    company: "업체",
    user: "사용자",
  }[user.role];

  return (
    <Sidebar collapsible="icon" className={className}>
      <SidebarContent className="rounded-none">
        <SidebarGroup>
          <SidebarGroupLabel>메뉴</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-3 py-3">
                      <item.icon className="h-5 w-5" />
                      <span className="text-sm">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{roleText}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
