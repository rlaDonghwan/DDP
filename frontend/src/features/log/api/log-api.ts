import { apiClient } from "@/lib/axios";
import type {
  DrivingLogResponse,
  SubmitLogRequest,
  ReviewLogRequest,
  DeviceWithLogStatsResponse,
} from "../types/log";

/**
 * 운행기록(Log) API 함수 모음
 */
export const logApi = {
  /**
   * 로그 제출 (파일 업로드)
   */
  submitLog: async (
    request: SubmitLogRequest,
    file: File
  ): Promise<DrivingLogResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 로그 제출");

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "request",
        new Blob([JSON.stringify(request)], { type: "application/json" })
      );

      const response = await apiClient.post<DrivingLogResponse>(
        "/api/v1/logs/submit",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 로그 제출 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 로그 제출 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 로그 상세 조회
   */
  getLog: async (logId: string): Promise<DrivingLogResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 로그 상세 조회");

    try {
      const response = await apiClient.get<DrivingLogResponse>(
        `/api/v1/logs/${logId}`
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
   * 장치별 로그 목록 조회
   */
  getLogsByDevice: async (
    deviceId: number,
    page: number = 0,
    size: number = 20
  ): Promise<{ content: DrivingLogResponse[]; totalElements: number }> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 장치별 로그 목록 조회");

    try {
      const response = await apiClient.get(
        `/api/v1/logs/device/${deviceId}`,
        {
          params: { page, size, sort: "submitDate,desc" },
        }
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 장치별 로그 목록 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 장치별 로그 목록 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );
      throw error;
    }
  },

  /**
   * 사용자별 로그 목록 조회
   */
  getLogsByUser: async (
    userId: number,
    page: number = 0,
    size: number = 20
  ): Promise<{ content: DrivingLogResponse[]; totalElements: number }> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 사용자별 로그 목록 조회");

    try {
      const response = await apiClient.get(`/api/v1/logs/user/${userId}`, {
        params: { page, size, sort: "submitDate,desc" },
      });

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 사용자별 로그 목록 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 사용자별 로그 목록 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );
      throw error;
    }
  },

  /**
   * 장치의 최근 로그 조회
   */
  getLatestLogByDevice: async (
    deviceId: number
  ): Promise<DrivingLogResponse | null> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 장치 최근 로그 조회");

    try {
      const response = await apiClient.get<DrivingLogResponse>(
        `/api/v1/logs/device/${deviceId}/latest`
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 장치 최근 로그 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );

      return response.data;
    } catch (error: any) {
      // 204 No Content는 정상 (로그 없음)
      if (error?.response?.status === 204) {
        return null;
      }

      const endTime = performance.now();
      console.log(
        `API 호출 실패: 장치 최근 로그 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );
      throw error;
    }
  },

  // 관리자 API
  /**
   * 전체 로그 목록 조회 (관리자용)
   */
  getAllLogs: async (
    page: number = 0,
    size: number = 20
  ): Promise<{ content: DrivingLogResponse[]; totalElements: number }> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 전체 로그 목록 조회 (관리자)");

    try {
      const response = await apiClient.get("/api/v1/logs/admin/all", {
        params: { page, size, sort: "submitDate,desc" },
      });

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 전체 로그 목록 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 전체 로그 목록 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );
      throw error;
    }
  },

  /**
   * 이상 징후 로그 목록 조회 (관리자용)
   */
  getFlaggedLogs: async (
    page: number = 0,
    size: number = 20
  ): Promise<{ content: DrivingLogResponse[]; totalElements: number }> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 이상 징후 로그 목록 조회");

    try {
      const response = await apiClient.get("/api/v1/logs/admin/flagged", {
        params: { page, size, sort: "submitDate,desc" },
      });

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 이상 징후 로그 목록 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 이상 징후 로그 목록 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );
      throw error;
    }
  },

  /**
   * 검토 대기 로그 목록 조회 (관리자용)
   */
  getPendingReviewLogs: async (
    page: number = 0,
    size: number = 20
  ): Promise<{ content: DrivingLogResponse[]; totalElements: number }> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 검토 대기 로그 목록 조회");

    try {
      const response = await apiClient.get(
        "/api/v1/logs/admin/pending-review",
        {
          params: { page, size, sort: "submitDate,desc" },
        }
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 검토 대기 로그 목록 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 검토 대기 로그 목록 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );
      throw error;
    }
  },

  /**
   * 로그 검토 (관리자용)
   */
  reviewLog: async (
    logId: string,
    request: ReviewLogRequest
  ): Promise<DrivingLogResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 로그 검토");

    try {
      const response = await apiClient.patch<DrivingLogResponse>(
        `/api/v1/logs/admin/${logId}/review`,
        request
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 로그 검토 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 로그 검토 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },
};
