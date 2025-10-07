"use client";

import { useState, useEffect } from "react";
import { subjectsApi } from "../api/subjects-api";
import type { Subject, SubjectDetail } from "../types/subject";
import type { SubjectFilterData } from "../schemas/subject-schema";

/**
 * 대상자 목록 관리 훅
 */
export function useSubjects(filters?: SubjectFilterData) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 대상자 목록 조회
   */
  const fetchSubjects = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await subjectsApi.getSubjects(filters);
      setSubjects(response.subjects);
      setTotalCount(response.totalCount);
    } catch (err) {
      console.error("대상자 목록 조회 실패:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

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
  };
}

/**
 * 대상자 상세 정보 관리 훅
 */
export function useSubjectDetail(id: string) {
  const [subject, setSubject] = useState<SubjectDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 대상자 상세 조회
   */
  const fetchSubjectDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await subjectsApi.getSubjectById(id);
      setSubject(response.subject);
    } catch (err) {
      console.error("대상자 상세 조회 실패:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchSubjectDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return {
    subject,
    isLoading,
    error,
    refetch: fetchSubjectDetail,
  };
}
