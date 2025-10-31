package com.ddp.reservation.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

// 예약 엔티티
@Entity
@Table(name = "reservations")
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Reservation {

    // 예약 ID (Primary Key)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reservation_id")
    private Long reservationId;

    // 사용자 ID (예약한 사용자)
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // 업체 ID (예약 대상 업체)
    @Column(name = "company_id", nullable = false)
    private Long companyId;

    // 서비스 타입 (설치, 검·교정, 유지보수, 수리)
    @Enumerated(EnumType.STRING)
    @Column(name = "service_type", nullable = false, length = 20)
    private ServiceType serviceType;

    // 예약 상태 (대기, 확정, 완료, 취소, 거절)
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private ReservationStatus status;

    // 희망 예약 일시 (사용자가 요청한 시간)
    @Column(name = "requested_date", nullable = false)
    private LocalDateTime requestedDate;

    // 확정된 예약 일시 (업체가 확정한 시간)
    @Column(name = "confirmed_date")
    private LocalDateTime confirmedDate;

    // 완료된 일시
    @Column(name = "completed_date")
    private LocalDateTime completedDate;

    // 차량 정보
    @Column(name = "vehicle_info", length = 200)
    private String vehicleInfo;

    // 요청 사항 (비고)
    @Column(name = "notes", length = 1000)
    private String notes;

    // 취소 사유 (사용자 취소 시)
    @Column(name = "cancelled_reason", length = 500)
    private String cancelledReason;

    // 취소 일시
    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    // 거절 사유 (업체 거절 시)
    @Column(name = "rejected_reason", length = 500)
    private String rejectedReason;

    // 거절 일시
    @Column(name = "rejected_at")
    private LocalDateTime rejectedAt;

    // 생성 일시
    @CreatedBy
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 수정 일시
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // JPA 생명주기 콜백: 엔티티 생성 시 자동으로 timestamps 설정
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // JPA 생명주기 콜백: 엔티티 수정 시 자동으로 updatedAt 갱신
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
