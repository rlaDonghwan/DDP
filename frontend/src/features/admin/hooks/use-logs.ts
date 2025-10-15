import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { logsApi } from "../api/logs-api";
import type { LogFilterOptions } from "../types/log";
import { toast } from "sonner";

/**
 * 관리자 로그 목록 조회 훅
 */
export function useAdminLogs(filters?: LogFilterOptions) {
  return useQuery({
    queryKey: ["admin", "logs", filters],
    queryFn: async () => {
      const response = await logsApi.getLogs(filters);
      return {
        logs: response.logs,
        totalCount: response.totalCount,
      };
    },
  });
}

/**
 * 로그 상세 정보 조회 훅
 */
export function useAdminLogDetail(id: string) {
  return useQuery({
    queryKey: ["admin", "logs", id],
    queryFn: async () => {
      const response = await logsApi.getLogById(id);
      return response.log;
    },
    enabled: !!id,
  });
}

/**
 * 로그 통계 조회 훅
 */
export function useAdminLogStatistics(params?: {
  startDate?: string;
  endDate?: string;
  subjectId?: string;
}) {
  return useQuery({
    queryKey: ["admin", "log-statistics", params],
    queryFn: () => logsApi.getLogStatistics(params),
  });
}

/**
 * 로그 승인 훅
 */
export function useApproveLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (logId: string) => logsApi.approveLog(logId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "logs"] });
      toast.success("로그가 승인되었습니다");
    },
    onError: () => {
      toast.error("로그 승인에 실패했습니다");
    },
  });
}

/**
 * 로그 반려 훅
 */
export function useRejectLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ logId, reason }: { logId: string; reason: string }) =>
      logsApi.rejectLog(logId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "logs"] });
      toast.success("로그가 반려되었습니다");
    },
    onError: () => {
      toast.error("로그 반려에 실패했습니다");
    },
  });
}

/**
 * 기존 호환성을 위한 래퍼 훅
 * @deprecated useAdminLogs를 직접 사용하세요
 */
export function useLogs(filters?: LogFilterOptions) {
  const { data, isLoading, error, refetch } = useAdminLogs(filters);

  return {
    logs: data?.logs || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
    refetch,
  };
}

/**
 * @deprecated useAdminLogDetail을 직접 사용하세요
 */
export function useLogDetail(id: string) {
  const { data, isLoading, error, refetch } = useAdminLogDetail(id);

  return {
    log: data || null,
    isLoading,
    error,
    refetch,
  };
}

/**
 * @deprecated useAdminLogStatistics를 직접 사용하세요
 */
export function useLogStatistics(params?: {
  startDate?: string;
  endDate?: string;
  subjectId?: string;
}) {
  const { data, isLoading, error, refetch } = useAdminLogStatistics(params);

  return {
    statistics: data || null,
    isLoading,
    error,
    refetch,
  };
}
