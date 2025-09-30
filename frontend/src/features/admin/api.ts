import api from "@/lib/axios";
import type { DuiSubjectListResponse } from "./types";

/**
 * Admin DUI 관련 API 집합
 */
export const adminDuiApi = {
  /**
   * 음주운전자 대상 목록 조회
   */
  async getSubjects(): Promise<DuiSubjectListResponse> {
    const res = await api.get<DuiSubjectListResponse>("/api/tcs/dui/subjects");
    return res.data;
  },
};
