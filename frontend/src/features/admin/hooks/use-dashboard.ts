import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "../api/dashboard-api";

/**
 * 관리자 대시보드 데이터 조회 훅
 */
export function useDashboard() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: dashboardApi.getDashboardData,
  });
}
