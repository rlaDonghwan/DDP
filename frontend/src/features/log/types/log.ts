/**
 * 운행기록(Log) 관련 타입 정의
 */

/**
 * 로그 상태
 */
export type LogStatus =
  | "SUBMITTED" // 제출됨
  | "UNDER_REVIEW" // 검토 중
  | "APPROVED" // 승인됨
  | "REJECTED" // 반려됨
  | "FLAGGED"; // 이상 징후 발견

/**
 * 이상 징후 유형
 */
export type AnomalyType =
  | "NORMAL" // 정상
  | "TAMPERING_ATTEMPT" // 장치 조작 시도
  | "BYPASS_ATTEMPT" // 우회 시도
  | "EXCESSIVE_FAILURES" // 과도한 측정 실패
  | "DEVICE_MALFUNCTION" // 장치 오작동
  | "DATA_INCONSISTENCY" // 데이터 불일치
  | undefined; // 분석 전 또는 정보 없음

/**
 * 이상 징후 유형 키 (undefined 제외, Record 키로 사용 가능)
 */
export type AnomalyTypeKey = Exclude<AnomalyType, undefined>;

/**
 * 위험도 등급
 */
export type RiskLevel = "HIGH" | "MEDIUM" | "LOW";

/**
 * 로그 통계 정보
 */
export interface LogStatistics {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  skippedTests: number;
  averageBAC: number;
  maxBAC: number;
  tamperingAttempts: number;
}

/**
 * 운행기록 로그 응답 (백엔드 DrivingLogResponse)
 */
export interface DrivingLogResponse {
  logId: string;
  deviceId: number;
  userId: number;
  submitDate: string;
  periodStart: string;
  periodEnd: string;

  // 파일 정보
  fileName: string;
  fileSize: number;
  fileType: string;

  // 상태 및 분석
  status: LogStatus;
  anomalyType?: AnomalyType; // 이상 징후 유형 (옵셔널)
  riskLevel?: RiskLevel; // 위험도 등급 (옵셔널)
  analysisResult?: string;

  // 통계 정보
  statistics?: LogStatistics;

  // 검토 정보
  reviewNotes?: string; // 검토 메모 추가
  reviewedBy?: number;
  reviewedAt?: string;

  // 조치 정보
  actionTaken?: boolean;
  actionId?: string;

  createdAt: string;
  updatedAt: string;
}

/**
 * 레거시 Log 타입 (하위 호환성)
 * @deprecated DrivingLogResponse 사용 권장
 */
export interface Log {
  id: string;
  userId: string;
  userName: string;
  deviceId: string;
  deviceSerialNumber: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  uploadDate: string;
  recordStartDate: string;
  recordEndDate: string;
  status: LogStatus;
  rejectionReason?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 로그 제출 요청 (백엔드 SubmitLogRequest)
 */
export interface SubmitLogRequest {
  deviceId: number;
  userId: number;
  periodStart: string; // YYYY-MM-DD
  periodEnd: string; // YYYY-MM-DD
  notes?: string;
}

/**
 * 로그 검토 요청 (관리자용)
 */
export interface ReviewLogRequest {
  status: LogStatus; // APPROVED 또는 REJECTED
  reviewNotes?: string;
  reviewerId: number;
}

/**
 * 장치 로그 통계
 */
export interface DeviceLogStats {
  totalLogCount: number;
  lastLogSubmitDate?: string;
  nextLogDueDate?: string;
  flaggedLogCount: number;
  isOverdue: boolean;
}

/**
 * 장치 + 로그 통계 응답
 */
export interface DeviceWithLogStatsResponse {
  device: any; // DeviceResponse 타입
  logStats: DeviceLogStats;
}

/**
 * 레거시 타입 (하위 호환성)
 * @deprecated
 */
export interface UploadLogRequest {
  deviceId: string;
  recordStartDate: string;
  recordEndDate: string;
  file: File;
}

export interface UploadLogResponse {
  success: boolean;
  message: string;
  log?: Log;
}

export interface LogFilter {
  status?: LogStatus;
  startDate?: string;
  endDate?: string;
  deviceId?: string;
}
