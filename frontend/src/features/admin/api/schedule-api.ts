/**
 * 로그 제출 일정 API
 */

import { apiClient } from "@/lib/axios";
import type {
  LogSubmissionSchedule,
  CreateScheduleRequest,
  ChangeFrequencyRequest,
  DdayResponse,
} from "../types/schedule";

export const scheduleApi = {
  /**
   * 사용자별 로그 제출 일정 조회 (사용자용)
   */
  getSchedule: async (userId: number): Promise<LogSubmissionSchedule> => {
    const response = await apiClient.get<LogSubmissionSchedule>(
      `/api/v1/users/${userId}/log-schedule`
    );
    return response.data;
  },

  /**
   * 로그 제출 일정 생성 (관리자용)
   */
  createSchedule: async (
    data: CreateScheduleRequest
  ): Promise<LogSubmissionSchedule> => {
    const response = await apiClient.post<LogSubmissionSchedule>(
      "/api/v1/admin/log-schedules",
      data
    );
    return response.data;
  },

  /**
   * 제출 주기 변경 (관리자 조치)
   */
  changeFrequency: async (
    userId: number,
    data: ChangeFrequencyRequest
  ): Promise<LogSubmissionSchedule> => {
    const response = await apiClient.patch<LogSubmissionSchedule>(
      `/api/v1/users/${userId}/log-schedule/frequency`,
      data
    );
    return response.data;
  },

  /**
   * D-day 계산 (사용자용)
   */
  calculateDday: async (userId: number): Promise<DdayResponse> => {
    const response = await apiClient.get<DdayResponse>(
      `/api/v1/users/${userId}/log-schedule/dday`
    );
    return response.data;
  },

  /**
   * 전체 일정 목록 조회 (관리자용)
   */
  getAllSchedules: async (): Promise<LogSubmissionSchedule[]> => {
    const response = await apiClient.get<LogSubmissionSchedule[]>(
      "/api/v1/admin/log-schedules"
    );
    return response.data;
  },

  /**
   * 미제출 횟수가 특정 값 이상인 사용자 조회 (관리자용)
   */
  getSchedulesWithMissedSubmissions: async (
    count: number = 3
  ): Promise<LogSubmissionSchedule[]> => {
    const response = await apiClient.get<LogSubmissionSchedule[]>(
      `/api/v1/admin/log-schedules/missed?count=${count}`
    );
    return response.data;
  },

  /**
   * 제출 기한이 임박한 사용자 조회 (관리자용)
   */
  getSchedulesDueSoon: async (
    daysAhead: number = 3
  ): Promise<LogSubmissionSchedule[]> => {
    const response = await apiClient.get<LogSubmissionSchedule[]>(
      `/api/v1/admin/log-schedules/due-soon?daysAhead=${daysAhead}`
    );
    return response.data;
  },
};
