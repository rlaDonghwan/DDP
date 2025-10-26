import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { subjectsApi } from "../api/subjects-api";
import { toast } from "sonner";

/**
 * 관리자 대상자 목록 조회 훅
 */
export function useAdminSubjects() {
  return useQuery({
    queryKey: ["admin", "subjects"],
    queryFn: async () => {
      const response = await subjectsApi.getSubjects();
      return {
        subjects: response.subjects,
        totalCount: response.totalCount,
      };
    },
  });
}

/**
 * 대상자 계정 생성 훅
 */
export function useCreateSubjectAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (licenseNumber: string) =>
      subjectsApi.createAccount(licenseNumber),
    onSuccess: (response) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: ["admin", "subjects"] });
        toast.success("계정 생성 완료", {
          description: response.message || "계정이 성공적으로 생성되었습니다.",
        });
      } else {
        // success가 false인 경우 (서버에서 비즈니스 로직 실패)
        toast.error("계정 생성 실패", {
          description: response.message || "계정 생성에 실패했습니다.",
        });
      }
    },
    onError: (err: any) => {
      // HTTP 에러 발생 시 (400, 500 등)
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "계정 생성 중 오류가 발생했습니다.";

      console.error("계정 생성 에러:", {
        status: err?.response?.status,
        statusText: err?.response?.statusText,
        data: err?.response?.data,
        message: err?.message,
      });

      toast.error("계정 생성 오류", {
        description: errorMessage,
      });
    },
  });
}

/**
 * 기존 호환성을 위한 래퍼 훅
 * @deprecated useAdminSubjects와 useCreateSubjectAccount를 직접 사용하세요
 */
export function useSubjects() {
  const { data, isLoading, error, refetch } = useAdminSubjects();
  const createAccountMutation = useCreateSubjectAccount();

  return {
    subjects: data?.subjects || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
    refetch,
    createAccount: createAccountMutation.mutate,
  };
}
