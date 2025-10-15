import api from "@/lib/axios";
import type { DashboardResponse } from "../types/dashboard";

/**
 * 대시보드 API 함수 모음
 */
export const dashboardApi = {
  /**
   * 대시보드 전체 데이터 조회
   */
  getDashboardData: async (): Promise<DashboardResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 대시보드 데이터 조회");

    try {
      const response = await api.get<DashboardResponse>("/api/v1/admin/dashboard");

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 대시보드 데이터 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 대시보드 데이터 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );
      throw error;
    }
  },
};
