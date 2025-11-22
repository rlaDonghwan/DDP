/**
 * 예약(Reservation) 관련 타입 정의
 */

/**
 * 예약 서비스 타입
 */
export type ReservationServiceType =
  | "INSTALLATION" // 설치
  | "REPAIR" // 수리
  | "INSPECTION" // 검교정
  | "MAINTENANCE"; // 유지보수

/**
 * 예약 상태
 */
export type ReservationStatus =
  | "PENDING" // 신청 (사용자가 예약 신청)
  | "CONFIRMED" // 확정 (업체가 승인)
  | "REJECTED" // 거절 (업체가 거절)
  | "CANCELLED" // 취소 (사용자가 취소)
  | "COMPLETED"; // 완료 (서비스 완료)

/**
 * 예약 정보
 */
export interface Reservation {
  reservationId: string; // 예약 ID (백엔드 필드명에 맞춤)
  userId: string; // 사용자 ID
  userName?: string; // 사용자 이름 (업체가 조회 시 포함)
  userPhone?: string; // 사용자 연락처 (업체가 조회 시 포함)
  userAddress?: string; // 사용자 주소 (업체가 조회 시 포함)
  companyId: string; // 업체 ID (백엔드 필드명에 맞춤)
  companyName?: string; // 업체명 (사용자가 조회 시 포함)
  companyAddress?: string; // 업체 주소 (사용자가 조회 시 포함)
  companyPhone?: string; // 업체 연락처 (사용자가 조회 시 포함)
  serviceType: ReservationServiceType; // 서비스 타입
  requestedDate: string; // 예약 날짜 및 시간 (백엔드 필드명에 맞춤)
  confirmedDate?: string; // 확정 일시
  completedDate?: string; // 완료 일시
  status: ReservationStatus; // 예약 상태
  vehicleInfo?: string; // 차량 정보
  notes?: string; // 요청사항
  rejectedReason?: string; // 거절 사유 (REJECTED 상태인 경우)
  cancelledReason?: string; // 취소 사유
  cancelledAt?: string; // 취소 일시
  rejectedAt?: string; // 거절 일시
  createdAt: string; // 생성일 (ISO 8601)
  updatedAt: string; // 수정일 (ISO 8601)
}

/**
 * 예약 생성 요청
 */
export interface CreateReservationRequest {
  companyId: string; // 업체 ID (백엔드 필드명에 맞춤)
  serviceType: ReservationServiceType; // 서비스 타입
  requestedDate: string; // 예약 날짜 및 시간 (ISO 8601, 백엔드 필드명에 맞춤)
  vehicleInfo?: string; // 차량 번호 (한국 번호판 형식: 123가1234)
  notes?: string; // 요청사항
}

/**
 * 예약 생성 응답
 */
export interface CreateReservationResponse {
  success: boolean;
  message: string;
  reservation?: Reservation;
}

/**
 * 예약 목록 필터
 */
export interface ReservationFilter {
  status?: ReservationStatus; // 상태 필터
  serviceType?: ReservationServiceType; // 서비스 타입 필터
  startDate?: string; // 시작 날짜 (ISO 8601)
  endDate?: string; // 종료 날짜 (ISO 8601)
}

/**
 * 예약 취소 요청
 */
export interface CancelReservationRequest {
  reason?: string; // 취소 사유
}

/**
 * 예약 취소 응답
 */
export interface CancelReservationResponse {
  reservationId: string; // 예약 ID
  cancellationFee: number; // 취소 수수료
  cancellationPolicy: string; // 취소 정책 (24H_BEFORE 또는 24H_WITHIN)
  message: string; // 안내 메시지
}

/**
 * 예약 확정 요청 (업체용)
 */
export interface ConfirmReservationRequest {
  confirmedDate?: string; // 확정된 날짜/시간 (변경 시)
}

/**
 * 예약 거절 요청 (업체용)
 */
export interface RejectReservationRequest {
  reason: string; // 거절 사유
}
