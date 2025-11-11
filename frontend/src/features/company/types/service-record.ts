/**
 * 서비스 이력 관련 타입 정의
 */

/**
 * 서비스 타입
 */
export type ServiceType = "INSTALLATION" | "INSPECTION" | "REPAIR" | "MAINTENANCE";

/**
 * 서비스 이력 응답 DTO
 */
export interface ServiceRecord {
  id: string;
  type: ServiceType;
  subjectId: string;
  subjectName: string;
  deviceId: string;
  deviceSerialNumber: string;
  description: string;
  performedAt: string; // ISO 8601 날짜 문자열
  performedBy: string;
  cost: number;
}

/**
 * 서비스 이력 목록 필터
 */
export interface ServiceRecordFilter {
  type?: ServiceType;
  startDate?: string;
  endDate?: string;
}
