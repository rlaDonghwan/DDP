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
import { FileText, CalendarPlus, CalendarCheck } from "lucide-react";

/**
 * 빠른 메뉴 카드 컴포넌트
 * 주요 기능으로 빠르게 이동할 수 있는 버튼들을 제공합니다
 */
export function QuickMenuCard() {
  const router = useRouter();

  const quickMenuItems = [
    {
      id: "submit-log",
      title: "운행기록 제출하기",
      description: "음주운전 방지장치 운행기록을 제출합니다",
      icon: FileText,
      href: "/user/log/submit",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200",
      iconColor: "text-blue-600",
    },
    {
      id: "new-reservation",
      title: "예약 신청하기",
      description: "장치 설치 또는 점검 예약을 신청합니다",
      icon: CalendarPlus,
      href: "/user/operators/search",
      color: "bg-green-50 hover:bg-green-100 border-green-200",
      iconColor: "text-green-600",
    },
    {
      id: "my-reservations",
      title: "나의 예약 내역",
      description: "신청한 예약 내역을 확인합니다",
      icon: CalendarCheck,
      href: "/user/reservations",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200",
      iconColor: "text-purple-600",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>빠른 메뉴</CardTitle>
        <CardDescription>
          자주 사용하는 기능으로 빠르게 이동할 수 있습니다
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {quickMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.href)}
                className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${item.color}`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div
                    className={`p-3 rounded-full bg-white border-2 ${item.iconColor}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
