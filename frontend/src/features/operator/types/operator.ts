/**
 * 업체(Operator) 관련 타입 정의
 */

/**
 * 업체 서비스 타입
 */
export type OperatorServiceType =
  | "INSTALLATION" // 설치
  | "REPAIR" // 수리
  | "INSPECTION" // 검교정
  | "MAINTENANCE"; // 유지보수

/**
 * 업체 인증 상태
 */
export type OperatorCertificationStatus = "APPROVED" | "PENDING" | "REJECTED";

/**
 * 업체 정보
 */
export interface Operator {
  id: string;
  name: string; // 업체명
  businessNumber: string; // 사업자등록번호
  address: string; // 주소
  phone: string; // 연락처
  email?: string; // 이메일
  latitude: number; // 위도
  longitude: number; // 경도
  businessHours: string; // 영업시간
  certificationStatus: OperatorCertificationStatus; // 인증 상태
  rating?: number; // 평점 (0-5)
  reviewCount?: number; // 리뷰 수
  services: OperatorServiceType[]; // 제공 서비스 목록
  description?: string; // 업체 소개
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/**
 * 업체 목록 조회 필터
 */
export interface OperatorFilter {
  serviceType?: OperatorServiceType; // 서비스 타입 필터
  certificationStatus?: OperatorCertificationStatus; // 인증 상태 필터
  searchKeyword?: string; // 검색 키워드 (업체명, 주소)
}

/**
 * 주변 업체 검색 요청
 */
export interface NearbyOperatorsRequest {
  latitude: number; // 현재 위치 위도
  longitude: number; // 현재 위치 경도
  radius?: number; // 검색 반경 (km, 기본 10km)
  serviceType?: OperatorServiceType; // 서비스 타입 필터
}

/**
 * 업체 예약 가능 일정
 */
export interface OperatorAvailability {
  operatorId: string;
  availableDates: string[]; // 예약 가능한 날짜 목록 (ISO 8601)
  availableTimeSlots: {
    date: string; // ISO 8601
    timeSlots: string[]; // 예약 가능한 시간대 ["09:00", "10:00", ...]
  }[];
}

/**
 * 업체 목록 조회 응답 (백엔드 형식)
 */
export interface OperatorListResponse {
  success: boolean;
  totalCount: number;
  operators: Operator[];
}
