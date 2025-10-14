"use client";

import { useUserProfile } from "@/features/user/hooks/use-user-profile";
import { ProfileInfoCard } from "@/features/user/components/profile-info-card";
import { QuickMenu } from "@/features/user/components/quick-menu";

/**
 * 사용자 포털 메인 페이지 (마이페이지)
 * 사용자의 기본 정보와 바로가기 메뉴를 제공합니다
 */
export default function UserMainPage() {
  const { data: profile, isLoading } = useUserProfile();

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          마이페이지
        </h1>
        <p className="text-gray-600 mt-2">
          내 정보를 확인하고 주요 기능을 이용하세요
        </p>
      </div>

      {/* 사용자 정보 카드 */}
      <ProfileInfoCard profile={profile} isLoading={isLoading} />

      {/* 바로가기 메뉴 */}
      <QuickMenu />
    </div>
  );
}
