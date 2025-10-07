"use client";

import { useState, useEffect } from "react";
import { logsApi } from "../api/logs-api";
import type {
  DrivingLog,
  DrivingLogDetail,
  LogFilterOptions,
  LogStatistics,
} from "../types/log";

/**
 * 로그 목록 관리 훅
 */
export function useLogs(filters?: LogFilterOptions) {
  const [logs, setLogs] = useState<DrivingLog[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 로그 목록 조회
   */
  const fetchLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await logsApi.getLogs(filters);
      setLogs(response.logs);
      setTotalCount(response.totalCount);
    } catch (err) {
      console.error("로그 목록 조회 실패:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 변경 시 데이터 재조회
  useEffect(() => {
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return {
    logs,
    totalCount,
    isLoading,
    error,
    refetch: fetchLogs,
  };
}

/**
 * 로그 상세 정보 관리 훅
 */
export function useLogDetail(id: string) {
  const [log, setLog] = useState<DrivingLogDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 로그 상세 조회
   */
  const fetchLogDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await logsApi.getLogById(id);
      setLog(response.log);
    } catch (err) {
      console.error("로그 상세 조회 실패:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchLogDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return {
    log,
    isLoading,
    error,
    refetch: fetchLogDetail,
  };
}

/**
 * 로그 통계 관리 훅
 */
export function useLogStatistics(params?: {
  startDate?: string;
  endDate?: string;
  subjectId?: string;
}) {
  const [statistics, setStatistics] = useState<LogStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 로그 통계 조회
   */
  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await logsApi.getLogStatistics(params);
      setStatistics(response);
    } catch (err) {
      console.error("로그 통계 조회 실패:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  return {
    statistics,
    isLoading,
    error,
    refetch: fetchStatistics,
  };
}
