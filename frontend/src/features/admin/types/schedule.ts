/**
 * 로그 제출 일정 관련 타입 정의
 */

/**
 * 제출 주기
 */
export type SubmissionFrequency = "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "QUARTERLY";

/**
 * 로그 제출 일정
 */
export interface LogSubmissionSchedule {
  scheduleId: string;
  userId: number;
  deviceId: number;
  frequency: SubmissionFrequency;
  lastSubmissionDate?: string; // YYYY-MM-DD
  nextDueDate: string; // YYYY-MM-DD
  missedSubmissions: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 일정 생성 요청
 */
export interface CreateScheduleRequest {
  userId: number;
  deviceId: number;
  frequency: SubmissionFrequency;
}

/**
 * 주기 변경 요청
 */
export interface ChangeFrequencyRequest {
  frequency: SubmissionFrequency;
}

/**
 * D-day 응답
 */
export interface DdayResponse {
  userId: number;
  dday: number | null;
  message: string;
}

/**
 * 제출 주기 라벨 맵
 */
export const SUBMISSION_FREQUENCY_LABELS: Record<SubmissionFrequency, string> = {
  WEEKLY: "주간 (7일)",
  BIWEEKLY: "격주 (14일)",
  MONTHLY: "월간 (30일)",
  QUARTERLY: "분기 (90일)",
};

/**
 * 제출 주기별 일수
 */
export const SUBMISSION_FREQUENCY_DAYS: Record<SubmissionFrequency, number> = {
  WEEKLY: 7,
  BIWEEKLY: 14,
  MONTHLY: 30,
  QUARTERLY: 90,
};
