/**
 * 운행기록(Log) 관련 타입 정의
 */

/**
 * 로그 상태
 */
export type LogStatus = "PENDING" | "APPROVED" | "REJECTED";

/**
 * 운행기록 정보
 */
export interface Log {
  id: string;
  userId: string; // 사용자 ID
  userName: string; // 사용자 이름
  deviceId: string; // 장치 ID
  deviceSerialNumber: string; // 장치 S/N
  fileName: string; // 업로드된 파일명
  fileSize: number; // 파일 크기 (bytes)
  fileUrl: string; // 파일 저장 경로
  uploadDate: string; // 업로드 날짜 (ISO 8601)
  recordStartDate: string; // 기록 시작 날짜 (ISO 8601)
  recordEndDate: string; // 기록 종료 날짜 (ISO 8601)
  status: LogStatus; // 로그 상태
  rejectionReason?: string; // 거절 사유 (REJECTED 상태인 경우)
  reviewedBy?: string; // 검토자 (관리자 ID)
  reviewedAt?: string; // 검토 날짜 (ISO 8601)
  createdAt: string; // 생성일 (ISO 8601)
  updatedAt: string; // 수정일 (ISO 8601)
}

/**
 * 로그 업로드 요청
 */
export interface UploadLogRequest {
  deviceId: string; // 장치 ID
  recordStartDate: string; // 기록 시작 날짜 (ISO 8601)
  recordEndDate: string; // 기록 종료 날짜 (ISO 8601)
  file: File; // 업로드할 파일
}

/**
 * 로그 업로드 응답
 */
export interface UploadLogResponse {
  success: boolean;
  message: string;
  log?: Log;
}

/**
 * 로그 목록 필터
 */
export interface LogFilter {
  status?: LogStatus; // 상태 필터
  startDate?: string; // 시작 날짜 (ISO 8601)
  endDate?: string; // 종료 날짜 (ISO 8601)
  deviceId?: string; // 장치 ID 필터
}
