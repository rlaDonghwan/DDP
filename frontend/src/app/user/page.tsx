"use client";

import { useUserProfile } from "@/features/user/hooks/use-user-profile";
import {
  useUserStatus,
  useNotifications,
  useAnnouncements,
} from "@/features/user/hooks/use-user-status";
import { UserStatusCard } from "@/features/user/components/user-status-card";
import { QuickMenuCard } from "@/features/user/components/quick-menu-card";
import { NotificationsCard } from "@/features/user/components/notifications-card";
import { AnnouncementsCard } from "@/features/user/components/announcements-card";
import { ProfileInfoCard } from "@/features/user/components/profile-info-card";

/**
 * 사용자 포털 메인 페이지 (마이페이지)
 * SFR-010: 음주운전 방지장치 사용자 시스템 요구기능
 * - 일반 현황 및 내역 조회
 * - 알림 및 공지사항
 *
 * 주요 기능 바로가기는 좌측 사이드바에서 제공됩니다
 */
export default function UserMainPage() {
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: status, isLoading: statusLoading } = useUserStatus();
  const { data: notifications, isLoading: notificationsLoading } =
    useNotifications();
  const { data: announcements, isLoading: announcementsLoading } =
    useAnnouncements();

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          마이페이지
        </h1>
        <p className="text-gray-600 mt-2">
          음주운전 방지장치 설치 대상자 현황 및 주요 기능을 확인하세요
        </p>
      </div>

      {/* 사용자 현황 요약 (SFR-010: 일반 현황 조회) */}
      <UserStatusCard
        profile={profile}
        status={status}
        isLoading={statusLoading || profileLoading}
      />

      {/* 빠른 메뉴 */}
      <QuickMenuCard />

      {/* 사용자 정보 카드 */}
      <ProfileInfoCard profile={profile} isLoading={profileLoading} />

      {/* 알림 및 공지사항 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 최근 알림 */}
        <NotificationsCard
          notifications={notifications}
          isLoading={notificationsLoading}
        />

        {/* 공지사항 */}
        <AnnouncementsCard
          announcements={announcements}
          isLoading={announcementsLoading}
        />
      </div>
    </div>
  );
}
