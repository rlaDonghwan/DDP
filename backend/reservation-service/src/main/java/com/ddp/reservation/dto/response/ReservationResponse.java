package com.ddp.reservation.dto.response;

import com.ddp.reservation.entity.Reservation;
import com.ddp.reservation.entity.ReservationStatus;
import com.ddp.reservation.entity.ServiceType;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// 예약 응답 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "예약 응답")
public class ReservationResponse {

    @Schema(description = "예약 ID", example = "1")
    private Long reservationId;

    @Schema(description = "사용자 ID", example = "123")
    private Long userId;

    @Schema(description = "업체 ID", example = "456")
    private Long companyId;

    @Schema(description = "서비스 타입", example = "INSTALLATION")
    private ServiceType serviceType;

    @Schema(description = "예약 상태", example = "PENDING")
    private ReservationStatus status;

    @Schema(description = "희망 예약 일시", example = "2025-11-01T10:00:00")
    private LocalDateTime requestedDate;

    @Schema(description = "확정 예약 일시", example = "2025-11-01T10:00:00")
    private LocalDateTime confirmedDate;

    @Schema(description = "완료 일시", example = "2025-11-01T12:00:00")
    private LocalDateTime completedDate;

    @Schema(description = "차량 정보", example = "현대 그랜저 12가1234")
    private String vehicleInfo;

    @Schema(description = "요청 사항", example = "오전 10시에 방문 부탁드립니다")
    private String notes;

    @Schema(description = "취소 사유", example = "개인 사정으로 취소합니다")
    private String cancelledReason;

    @Schema(description = "취소 일시", example = "2025-10-30T09:00:00")
    private LocalDateTime cancelledAt;

    @Schema(description = "거절 사유", example = "해당 일시에 예약이 가득 찼습니다")
    private String rejectedReason;

    @Schema(description = "거절 일시", example = "2025-10-30T09:00:00")
    private LocalDateTime rejectedAt;

    @Schema(description = "생성 일시", example = "2025-10-30T08:00:00")
    private LocalDateTime createdAt;

    @Schema(description = "수정 일시", example = "2025-10-30T09:00:00")
    private LocalDateTime updatedAt;

    // 사용자 정보 (업체가 예약 조회 시 필요)
    @Schema(description = "사용자 이름", example = "홍길동")
    private String userName;

    @Schema(description = "사용자 전화번호", example = "010-1234-5678")
    private String userPhone;

    @Schema(description = "사용자 주소", example = "서울시 강남구")
    private String userAddress;

    // 업체 정보 (사용자가 예약 조회 시 필요)
    @Schema(description = "업체명", example = "ABC 정비소")
    private String companyName;

    @Schema(description = "업체 주소", example = "서울시 서초구")
    private String companyAddress;

    @Schema(description = "업체 전화번호", example = "02-1234-5678")
    private String companyPhone;

    // 엔티티를 DTO로 변환하는 정적 팩토리 메서드 (기본)
    public static ReservationResponse from(Reservation reservation) {
        return ReservationResponse.builder()
                .reservationId(reservation.getReservationId())
                .userId(reservation.getUserId())
                .companyId(reservation.getCompanyId())
                .serviceType(reservation.getServiceType())
                .status(reservation.getStatus())
                .requestedDate(reservation.getRequestedDate())
                .confirmedDate(reservation.getConfirmedDate())
                .completedDate(reservation.getCompletedDate())
                .vehicleInfo(reservation.getVehicleInfo())
                .notes(reservation.getNotes())
                .cancelledReason(reservation.getCancelledReason())
                .cancelledAt(reservation.getCancelledAt())
                .rejectedReason(reservation.getRejectedReason())
                .rejectedAt(reservation.getRejectedAt())
                .createdAt(reservation.getCreatedAt())
                .updatedAt(reservation.getUpdatedAt())
                .build();
    }

    // 엔티티를 DTO로 변환하는 정적 팩토리 메서드 (사용자 정보 포함 - 업체용)
    public static ReservationResponse withUserInfo(Reservation reservation, String userName, String userPhone, String userAddress) {
        ReservationResponse response = from(reservation);
        response.setUserName(userName);
        response.setUserPhone(userPhone);
        response.setUserAddress(userAddress);
        return response;
    }

    // 엔티티를 DTO로 변환하는 정적 팩토리 메서드 (업체 정보 포함 - 사용자용)
    public static ReservationResponse withCompanyInfo(Reservation reservation, String companyName, String companyAddress, String companyPhone) {
        ReservationResponse response = from(reservation);
        response.setCompanyName(companyName);
        response.setCompanyAddress(companyAddress);
        response.setCompanyPhone(companyPhone);
        return response;
    }
}
