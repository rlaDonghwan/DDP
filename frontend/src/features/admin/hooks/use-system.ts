import { useQuery } from "@tanstack/react-query";
import { systemApi } from "../api/system-api";

/**
 * 관리자 시스템 계정 목록 조회 훅
 */
export function useAdminAccounts(filters?: {
  searchQuery?: string;
  role?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: ["admin", "accounts", filters],
    queryFn: async () => {
      const response = await systemApi.getAccounts(filters);
      return {
        accounts: response.accounts,
        totalCount: response.totalCount,
      };
    },
  });
}

/**
 * 시스템 권한 목록 조회 훅
 */
export function useAdminPermissions() {
  return useQuery({
    queryKey: ["admin", "permissions"],
    queryFn: systemApi.getPermissions,
  });
}

/**
 * 공지사항 목록 조회 훅
 */
export function useAdminNotices() {
  return useQuery({
    queryKey: ["admin", "notices"],
    queryFn: async () => {
      const response = await systemApi.getNotices();
      return {
        notices: response.notices,
        totalCount: response.totalCount,
      };
    },
  });
}

/**
 * 기존 호환성을 위한 래퍼 훅
 * @deprecated useAdminAccounts를 직접 사용하세요
 */
export function useAccounts(filters?: {
  searchQuery?: string;
  role?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  const { data, isLoading, error, refetch } = useAdminAccounts(filters);

  return {
    accounts: data?.accounts || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
    refetch,
  };
}

/**
 * @deprecated useAdminPermissions를 직접 사용하세요
 */
export function usePermissions() {
  const { data, isLoading, error, refetch } = useAdminPermissions();

  return {
    permissions: data?.permissions || [],
    isLoading,
    error,
    refetch,
  };
}

/**
 * @deprecated useAdminNotices를 직접 사용하세요
 */
export function useNotices() {
  const { data, isLoading, error, refetch } = useAdminNotices();

  return {
    notices: data?.notices || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
    refetch,
  };
}
