/**
 * 예약(Reservation) 관련 타입 정의
 */

/**
 * 예약 서비스 타입
 */
export type ReservationServiceType = "INSTALL" | "REPAIR" | "INSPECTION";

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
  id: string;
  userId: string; // 사용자 ID
  userName: string; // 사용자 이름
  userPhone: string; // 사용자 연락처
  operatorId: string; // 업체 ID
  operatorName: string; // 업체명
  operatorAddress: string; // 업체 주소
  operatorPhone: string; // 업체 연락처
  serviceType: ReservationServiceType; // 서비스 타입
  reservationDate: string; // 예약 날짜 및 시간 (ISO 8601)
  status: ReservationStatus; // 예약 상태
  notes?: string; // 요청사항
  rejectionReason?: string; // 거절 사유 (REJECTED 상태인 경우)
  createdAt: string; // 생성일 (ISO 8601)
  updatedAt: string; // 수정일 (ISO 8601)
}

/**
 * 예약 생성 요청
 */
export interface CreateReservationRequest {
  operatorId: string; // 업체 ID
  serviceType: ReservationServiceType; // 서비스 타입
  reservationDate: string; // 예약 날짜 및 시간 (ISO 8601)
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
