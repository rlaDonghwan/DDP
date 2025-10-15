import api from "@/lib/axios";
import type {
  Log,
  UploadLogRequest,
  UploadLogResponse,
  LogFilter,
} from "../types/log";

/**
 * 운행기록(Log) API 함수 모음
 */
export const logApi = {
  /**
   * 로그 파일 업로드
   */
  uploadLog: async (data: UploadLogRequest): Promise<UploadLogResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 로그 파일 업로드");

    try {
      // FormData 생성
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("deviceId", data.deviceId);
      formData.append("recordStartDate", data.recordStartDate);
      formData.append("recordEndDate", data.recordEndDate);

      const response = await api.post<UploadLogResponse>(
        "/api/v1/logs/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 로그 파일 업로드 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 로그 파일 업로드 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 사용자 로그 목록 조회
   */
  getUserLogs: async (userId: string, filter?: LogFilter): Promise<Log[]> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 사용자 로그 목록 조회");

    try {
      const response = await api.get<Log[]>(`/api/v1/logs/user/${userId}`, {
        params: filter,
      });

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 사용자 로그 목록 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 사용자 로그 목록 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );
      throw error;
    }
  },

  /**
   * 로그 상세 조회
   */
  getLog: async (id: string): Promise<Log> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 로그 상세 조회");

    try {
      const response = await api.get<Log>(`/api/v1/logs/${id}`);

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
   * 전체 로그 목록 조회 (관리자용)
   */
  getAllLogs: async (filter?: LogFilter): Promise<Log[]> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 전체 로그 목록 조회");

    try {
      const response = await api.get<Log[]>("/api/v1/logs", {
        params: filter,
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
};
