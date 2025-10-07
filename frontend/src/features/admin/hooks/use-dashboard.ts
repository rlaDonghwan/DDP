"use client";

import { useState, useEffect } from "react";
import { dashboardApi } from "../api/dashboard-api";
import type { DashboardResponse } from "../types/dashboard";

/**
 * 대시보드 데이터 관리 훅
 */
export function useDashboard() {
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 대시보드 데이터 조회
   */
  const fetchDashboard = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await dashboardApi.getDashboardData();
      setData(response);
    } catch (err) {
      console.error("대시보드 데이터 조회 실패:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 데이터 조회
  useEffect(() => {
    fetchDashboard();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDashboard,
  };
}
