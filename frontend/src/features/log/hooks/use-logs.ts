"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { logApi } from "../api/log-api";
import type { SubmitLogRequest } from "../types/log";
import { toast } from "sonner";

/**
 * 사용자별 로그 조회 훅
 */
export function useUserLogs(userId?: string) {
  return useQuery({
    queryKey: ["userLogs", userId],
    queryFn: () => {
      if (!userId) throw new Error("사용자 ID가 필요합니다");
      return logApi.getLogsByUser(parseInt(userId));
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 2, // 2분 동안 fresh 상태 유지
    gcTime: 1000 * 60 * 5, // 5분 동안 캐시 보관
    retry: 1,
  });
}

/**
 * 로그 상세 조회 훅
 */
export function useLog(id: string | undefined) {
  return useQuery({
    queryKey: ["log", id],
    queryFn: () => logApi.getLog(id!),
    enabled: !!id, // id가 있을 때만 쿼리 실행
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh 상태 유지
    gcTime: 1000 * 60 * 10, // 10분 동안 캐시 보관
    retry: 1,
  });
}

/**
 * 로그 업로드 훅
 */
export function useUploadLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { request: SubmitLogRequest; file: File }) =>
      logApi.submitLog(data.request, data.file),
    onSuccess: () => {
      // 로그 목록 캐시 무효화 (재조회)
      queryClient.invalidateQueries({ queryKey: ["userLogs"] });
      toast.success("운행기록이 제출되었습니다", {
        description: "관리자 검토 후 승인됩니다.",
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "로그 제출에 실패했습니다";
      toast.error("제출 실패", {
        description: message,
      });
    },
  });
}

/**
 * 전체 로그 목록 조회 훅 (관리자용)
 */
export function useAllLogs() {
  return useQuery({
    queryKey: ["allLogs"],
    queryFn: () => logApi.getAllLogs(),
    staleTime: 1000 * 60 * 2, // 2분 동안 fresh 상태 유지
    gcTime: 1000 * 60 * 5, // 5분 동안 캐시 보관
    retry: 1,
  });
}
