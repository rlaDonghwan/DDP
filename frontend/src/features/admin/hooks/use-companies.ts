import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companiesApi } from "../api/companies-api";
import type { CompanyFilterData } from "../schemas/company-schema";
import { toast } from "sonner";

/**
 * 관리자 업체 목록 조회 훅
 */
export function useAdminCompanies(filters?: CompanyFilterData) {
  return useQuery({
    queryKey: ["admin", "companies", filters],
    queryFn: async () => {
      const response = await companiesApi.getCompanies(filters);
      return {
        companies: response.companies,
        totalCount: response.totalCount,
      };
    },
  });
}

/**
 * 업체 상세 정보 조회 훅
 */
export function useAdminCompanyDetail(id: string) {
  return useQuery({
    queryKey: ["admin", "companies", id],
    queryFn: () => companiesApi.getCompanyById(id),
    enabled: !!id,
  });
}

/**
 * 업체 승인 훅
 */
export function useApproveCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyId: string) => companiesApi.approveCompany(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
      toast.success("업체가 승인되었습니다");
    },
    onError: () => {
      toast.error("업체 승인에 실패했습니다");
    },
  });
}

/**
 * 업체 거절 훅
 */
export function useRejectCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      companyId,
      reason,
    }: {
      companyId: string;
      reason: string;
    }) => companiesApi.rejectCompany(companyId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });
      toast.success("업체가 거절되었습니다");
    },
    onError: () => {
      toast.error("업체 거절에 실패했습니다");
    },
  });
}

/**
 * 기존 호환성을 위한 래퍼 훅
 * @deprecated useAdminCompanies를 직접 사용하세요
 */
export function useCompanies(filters?: CompanyFilterData) {
  const { data, isLoading, error, refetch } = useAdminCompanies(filters);

  return {
    companies: data?.companies || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
    refetch,
  };
}

/**
 * @deprecated useAdminCompanyDetail을 직접 사용하세요
 */
export function useCompanyDetail(id: string) {
  const { data, isLoading, error, refetch } = useAdminCompanyDetail(id);

  return {
    company: data || null,
    isLoading,
    error,
    refetch,
  };
}
