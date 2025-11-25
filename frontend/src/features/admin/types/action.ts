/**
 * 관리자 조치 관련 타입 정의
 */

/**
 * 조치 유형
 */
export type ActionType =
  | "WARNING_NOTIFICATION" // 경고 통보
  | "ADDITIONAL_INSPECTION_REQUIRED" // 추가 검사 요구
  | "EDUCATION_REQUIRED" // 교육 이수 명령
  | "LOG_SUBMISSION_FREQUENCY_CHANGE" // 로그 제출 주기 변경
  | "DEVICE_REINSTALLATION_REQUIRED" // 장치 재설치 명령
  | "EMERGENCY_CONTACT" // 긴급 연락 필요
  | "LICENSE_STATUS_CHANGE" // 면허 상태 변경
  | "LICENSE_SUSPENSION" // 면허 정지
  | "LICENSE_REVOCATION" // 면허 취소
  | "LEGAL_ACTION_REVIEW" // 법적 조치 검토
  | "POLICE_REPORT"; // 경찰 신고

/**
 * 조치 상태
 */
export type ActionStatus =
  | "PENDING" // 대기 중
  | "IN_PROGRESS" // 진행 중
  | "COMPLETED" // 완료
  | "FAILED" // 실패
  | "CANCELLED"; // 취소됨

/**
 * 관리자 조치
 */
export interface AdminAction {
  actionId: string;
  logId: string;
  userId: number;
  adminId: number;
  actionType: ActionType;
  actionDetail: string;
  status: ActionStatus;

  // 사용자 알림 정보
  isRead: boolean;
  readAt?: string;

  // TCS 연동 정보
  tcsSynced: boolean;
  tcsResponse?: string;

  // 메타데이터
  createdAt: string;
  executedAt?: string;
  completedAt?: string;
  updatedAt: string;
}

/**
 * 조치 생성 요청
 */
export interface CreateActionRequest {
  logId: string;
  userId: number;
  adminId: number;
  actionType: ActionType;
  actionDetail: string;
}

/**
 * 조치 확인 요청
 */
export interface MarkAsReadRequest {
  userId: number;
}

/**
 * 조치 유형 라벨 맵
 */
export const ACTION_TYPE_LABELS: Record<ActionType, string> = {
  WARNING_NOTIFICATION: "경고 통보",
  ADDITIONAL_INSPECTION_REQUIRED: "추가 검사 요구",
  EDUCATION_REQUIRED: "교육 이수 명령",
  LOG_SUBMISSION_FREQUENCY_CHANGE: "로그 제출 주기 변경",
  DEVICE_REINSTALLATION_REQUIRED: "장치 재설치 명령",
  EMERGENCY_CONTACT: "긴급 연락 필요",
  LICENSE_STATUS_CHANGE: "면허 상태 변경",
  LICENSE_SUSPENSION: "면허 정지",
  LICENSE_REVOCATION: "면허 취소",
  LEGAL_ACTION_REVIEW: "법적 조치 검토",
  POLICE_REPORT: "경찰 신고",
};

/**
 * 조치 상태 라벨 맵
 */
export const ACTION_STATUS_LABELS: Record<ActionStatus, string> = {
  PENDING: "대기 중",
  IN_PROGRESS: "진행 중",
  COMPLETED: "완료",
  FAILED: "실패",
  CANCELLED: "취소됨",
};
