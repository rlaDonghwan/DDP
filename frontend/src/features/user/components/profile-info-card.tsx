"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { UserProfile } from "../types/user";
import { useRouter } from "next/navigation";

interface ProfileInfoCardProps {
  profile: UserProfile | undefined;
  isLoading: boolean;
}

/**
 * 사용자 프로필 정보 카드 컴포넌트
 */
export function ProfileInfoCard({ profile, isLoading }: ProfileInfoCardProps) {
  const router = useRouter();

  // 로딩 상태
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-48 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    );
  }

  // 프로필 없음
  if (!profile) {
    return (
      <Card>
        <CardContent className="py-10">
          <p className="text-center text-red-600">
            프로필 정보를 불러올 수 없습니다
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>내 정보</CardTitle>
        <CardDescription>
          회원님의 기본 정보를 확인하고 수정할 수 있습니다
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">이름</p>
            <p className="text-base font-semibold text-gray-900">
              {profile.name}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">이메일</p>
            <p className="text-base font-semibold text-gray-900">
              {profile.email}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">연락처</p>
            <p className="text-base font-semibold text-gray-900">
              {profile.phone || "등록되지 않음"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">주소</p>
            <p className="text-base font-semibold text-gray-900">
              {profile.address || "등록되지 않음"}
            </p>
          </div>
          {profile.licenseNumber && (
            <div>
              <p className="text-sm font-medium text-gray-500">면허번호</p>
              <p className="text-base font-semibold text-gray-900">
                {profile.licenseNumber}
              </p>
            </div>
          )}
          {profile.deviceId && (
            <div>
              <p className="text-sm font-medium text-gray-500">장치 ID</p>
              <p className="text-base font-semibold text-gray-900">
                {profile.deviceId}
              </p>
            </div>
          )}
        </div>
        <div className="pt-4">
          <Button onClick={() => router.push("/user/profile")}>
            개인정보 수정
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
