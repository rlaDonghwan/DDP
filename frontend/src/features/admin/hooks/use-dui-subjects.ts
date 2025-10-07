"use client";

import { useState, useEffect, useCallback } from "react";
import { adminDuiApi } from "../api";
import type { DuiSubject } from "../types";
import { toast } from "sonner";

/**
 * DUI 대상자 목록 관리 훅
 * 기존 /api/tcs/dui/subjects API를 사용
 */
export function useDuiSubjects() {
  const [subjects, setSubjects] = useState<DuiSubject[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * 대상자 목록 조회
   */
  const fetchSubjects = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminDuiApi.getSubjects();

      if (response.success) {
        setSubjects(response.subjects);
        setTotalCount(response.totalCount);
      } else {
        setError(response.errorMessage || "데이터를 가져오지 못했습니다.");
      }
    } catch (err: any) {
      console.error("DUI 대상자 목록 조회 실패:", err);
      setError(err?.message || "요청 중 오류가 발생했습니다.");
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
        const response = await adminDuiApi.createAccount(licenseNumber);

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

  // 컴포넌트 마운트 시 목록 조회
  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return {
    subjects,
    totalCount,
    isLoading,
    error,
    refetch: fetchSubjects,
    createAccount,
  };
}
