"use client";

import { useState, useEffect, useCallback } from "react";
import { subjectsApi } from "../api/subjects-api";
import type { DuiSubject } from "../types/subject";
import type { SubjectFilterData } from "../schemas/subject-schema";
import { toast } from "sonner";

/**
 * 대상자 목록 관리 훅
 */
export function useSubjects(filters?: SubjectFilterData) {
  const [subjects, setSubjects] = useState<DuiSubject[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 대상자 목록 조회
   */
  const fetchSubjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await subjectsApi.getSubjects();
      setSubjects(response.subjects);
      setTotalCount(response.totalCount);
    } catch (err) {
      console.error("대상자 목록 조회 실패:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * 계정 생성
   */
  const createAccount = useCallback(
    async (licenseNumber: string) => {
      try {
        const response = await subjectsApi.createAccount(licenseNumber);

        if (response.success) {
          toast.success("계정 생성 완료", {
            description:
              response.message || "계정이 성공적으로 생성되었습니다.",
          });

          // 목록 새로고침
          await fetchSubjects();
        } else {
          toast.error("계정 생성 실패", {
            description: response.message || "계정 생성에 실패했습니다.",
          });
        }
      } catch (err: any) {
        console.error("계정 생성 실패:", err);
        toast.error("계정 생성 오류", {
          description:
            err?.response?.data?.message || "계정 생성 중 오류가 발생했습니다.",
        });
      }
    },
    [fetchSubjects]
  );

  // 필터 변경 시 데이터 재조회
  useEffect(() => {
    fetchSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return {
    subjects,
    totalCount,
    isLoading,
    error,
    refetch: fetchSubjects,
    createAccount,
  };
}

