import api from "@/lib/axios";
import type { DuiSubjectListResponse } from "../types/subject";

/**
 * Admin DUI 관련 API 집합
 */
export const adminDuiApi = {
  /**
   * 음주운전자 대상 목록 조회
   */
  async getSubjects(): Promise<DuiSubjectListResponse> {
    const startTime = performance.now();
    console.log("API 호출 시작: 음주운전자 대상 목록 조회");

    try {
      const res = await api.get<DuiSubjectListResponse>(
        "/api/v1/tcs/dui/subjects"
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 음주운전자 대상 목록 조회 (${(
          endTime - startTime
        ).toFixed(2)}ms)`
      );

      return res.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 음주운전자 대상 목록 조회 (${(
          endTime - startTime
        ).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 음주운전자 계정 생성
   */
  async createAccount(
    licenseNumber: string
  ): Promise<{ success: boolean; message: string }> {
    const startTime = performance.now();
    console.log("API 호출 시작: 음주운전자 계정 생성");

    try {
      const res = await api.post<{ success: boolean; message: string }>(
        "/api/v1/auth/admin/accounts/create",
        { licenseNumber }
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 음주운전자 계정 생성 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );

      return res.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 음주운전자 계정 생성 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );
      throw error;
    }
  },
};

// Hook과의 호환성을 위한 alias
export const subjectsApi = adminDuiApi;
