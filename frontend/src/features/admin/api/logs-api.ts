import api from "@/lib/axios";
import type {
  DrivingLogListResponse,
  DrivingLogDetailResponse,
  LogFilterOptions,
  LogStatistics,
} from "../types/log";

/**
 * 로그 관리 API 함수 모음
 */
export const logsApi = {
  /**
   * 로그 목록 조회
   */
  getLogs: async (
    params?: LogFilterOptions
  ): Promise<DrivingLogListResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 로그 목록 조회");

    try {
      const response = await api.get<DrivingLogListResponse>(
        "/api/admin/logs",
        {
          params,
        }
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 로그 목록 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 로그 목록 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 로그 상세 조회
   */
  getLogById: async (id: string): Promise<DrivingLogDetailResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 로그 상세 조회");

    try {
      const response = await api.get<DrivingLogDetailResponse>(
        `/api/admin/logs/${id}`
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 로그 상세 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 로그 상세 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 로그 통계 조회
   */
  getLogStatistics: async (params?: {
    startDate?: string;
    endDate?: string;
    subjectId?: string;
  }): Promise<LogStatistics> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 로그 통계 조회");

    try {
      const response = await api.get<LogStatistics>(
        "/api/admin/logs/statistics",
        {
          params,
        }
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 로그 통계 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 로그 통계 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 로그 승인
   */
  approveLog: async (logId: string): Promise<void> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 로그 승인");

    try {
      await api.post(`/api/admin/logs/${logId}/approve`);

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 로그 승인 (${(endTime - startTime).toFixed(2)}ms)`
      );
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 로그 승인 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 로그 반려
   */
  rejectLog: async (logId: string, reason: string): Promise<void> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 로그 반려");

    try {
      await api.post(`/api/admin/logs/${logId}/reject`, { reason });

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 로그 반려 (${(endTime - startTime).toFixed(2)}ms)`
      );
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 로그 반려 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },
};
