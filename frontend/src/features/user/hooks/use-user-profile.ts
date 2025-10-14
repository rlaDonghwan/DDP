"use client";

import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/user-api";

/**
 * 사용자 프로필 조회 훅
 */
export function useUserProfile() {
  return useQuery({
    queryKey: ["userProfile"],
    queryFn: userApi.getProfile,
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh 상태 유지
    gcTime: 1000 * 60 * 10, // 10분 동안 캐시 보관
    retry: 1, // 실패 시 1회 재시도
  });
}
