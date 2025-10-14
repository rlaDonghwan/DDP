"use client";

import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/user-api";

/**
 * 사용자 현황 정보 조회 훅
 */
export function useUserStatus() {
  return useQuery({
    queryKey: ["userStatus"],
    queryFn: userApi.getUserStatus,
    staleTime: 1000 * 60 * 2, // 2분 동안 fresh 상태 유지
    gcTime: 1000 * 60 * 5, // 5분 동안 캐시 보관
    retry: 1, // 실패 시 1회 재시도
  });
}

/**
 * 알림 목록 조회 훅
 */
export function useNotifications(limit: number = 5) {
  return useQuery({
    queryKey: ["notifications", limit],
    queryFn: () => userApi.getNotifications(limit),
    staleTime: 1000 * 60, // 1분 동안 fresh 상태 유지
    gcTime: 1000 * 60 * 3, // 3분 동안 캐시 보관
    retry: 1,
  });
}

/**
 * 공지사항 목록 조회 훅
 */
export function useAnnouncements(limit: number = 5) {
  return useQuery({
    queryKey: ["announcements", limit],
    queryFn: () => userApi.getAnnouncements(limit),
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh 상태 유지
    gcTime: 1000 * 60 * 10, // 10분 동안 캐시 보관
    retry: 1,
  });
}
