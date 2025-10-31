package com.ddp.reservation.entity;

// 예약 상태 Enum
public enum ReservationStatus {
    PENDING,      // 대기 중
    CONFIRMED,    // 확정
    COMPLETED,    // 완료
    CANCELLED,    // 취소 (사용자)
    REJECTED      // 거절 (업체)
}
