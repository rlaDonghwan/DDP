"use client";

import { useState, useEffect } from "react";
import { systemApi } from "../api/system-api";
import type {
  SystemAccount,
  PermissionResponse,
  Notice,
} from "../types/system";

/**
 * 계정 목록 관리 훅
 */
export function useAccounts(filters?: {
  searchQuery?: string;
  role?: string;
  status?: string;
  page?: number;
  pageSize?: number;
}) {
  const [accounts, setAccounts] = useState<SystemAccount[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 계정 목록 조회
   */
  const fetchAccounts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await systemApi.getAccounts(filters);
      setAccounts(response.accounts);
      setTotalCount(response.totalCount);
    } catch (err) {
      console.error("계정 목록 조회 실패:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 변경 시 데이터 재조회
  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return {
    accounts,
    totalCount,
    isLoading,
    error,
    refetch: fetchAccounts,
  };
}

/**
 * 권한 설정 관리 훅
 */
export function usePermissions() {
  const [data, setData] = useState<PermissionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 권한 설정 조회
   */
  const fetchPermissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await systemApi.getPermissions();
      setData(response);
    } catch (err) {
      console.error("권한 설정 조회 실패:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchPermissions,
  };
}

/**
 * 공지사항 목록 관리 훅
 */
export function useNotices(filters?: {
  searchQuery?: string;
  targetRole?: string;
  page?: number;
  pageSize?: number;
}) {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 공지사항 목록 조회
   */
  const fetchNotices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await systemApi.getNotices(filters);
      setNotices(response.notices);
      setTotalCount(response.totalCount);
    } catch (err) {
      console.error("공지사항 목록 조회 실패:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 변경 시 데이터 재조회
  useEffect(() => {
    fetchNotices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return {
    notices,
    totalCount,
    isLoading,
    error,
    refetch: fetchNotices,
  };
}

/**
 * 공지사항 상세 관리 훅
 */
export function useNoticeDetail(id: string) {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 공지사항 상세 조회
   */
  const fetchNoticeDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await systemApi.getNoticeById(id);
      setNotice(response.notice);
    } catch (err) {
      console.error("공지사항 상세 조회 실패:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchNoticeDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return {
    notice,
    isLoading,
    error,
    refetch: fetchNoticeDetail,
  };
}
