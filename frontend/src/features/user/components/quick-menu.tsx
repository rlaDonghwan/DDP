"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { QuickMenuItem } from "../types/user";

/**
 * 바로가기 메뉴 아이템 목록
 */
const quickMenuItems: QuickMenuItem[] = [
  {
    id: "submit-log",
    title: "운행기록 제출",
    description: "음주측정 운행기록을 제출합니다",
    href: "/user/logs/submit",
    icon: "📋",
  },
  {
    id: "book-installation",
    title: "장치 설치/검교정 예약",
    description: "장치 설치 또는 검교정 예약을 신청합니다",
    href: "/user/appointments/book",
    icon: "📅",
  },
  {
    id: "view-appointments",
    title: "예약 내역 조회",
    description: "나의 예약 내역을 확인합니다",
    href: "/user/appointments",
    icon: "📋",
  },
  {
    id: "view-companies",
    title: "설치 가능 업체 조회",
    description: "장치 설치 가능한 업체 목록을 확인합니다",
    href: "/user/companies",
    icon: "🏢",
  },
];

/**
 * 바로가기 메뉴 컴포넌트
 */
export function QuickMenu() {
  const router = useRouter();

  return (
    <Card>
      <CardHeader>
        <CardTitle>바로가기 메뉴</CardTitle>
        <CardDescription>
          자주 사용하는 기능으로 빠르게 이동합니다
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickMenuItems.map((item) => (
            <Button
              key={item.id}
              variant="outline"
              className="h-auto py-4 px-6 flex flex-col items-start gap-2 hover:bg-gray-50"
              onClick={() => router.push(item.href)}
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-base font-semibold">{item.title}</span>
              </div>
              <span className="text-sm text-gray-600 text-left">
                {item.description}
              </span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
