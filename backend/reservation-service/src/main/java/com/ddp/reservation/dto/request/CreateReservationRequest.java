package com.ddp.reservation.dto.request;

import com.ddp.reservation.entity.ServiceType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// 예약 생성 요청 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "예약 생성 요청")
public class CreateReservationRequest {

    // 업체 ID
    @NotNull(message = "업체 ID는 필수입니다")
    @Schema(description = "업체 ID", example = "1", required = true)
    private Long companyId;

    // 서비스 타입
    @NotNull(message = "서비스 타입은 필수입니다")
    @Schema(description = "서비스 타입 (INSTALLATION, INSPECTION, MAINTENANCE, REPAIR)",
            example = "INSTALLATION", required = true)
    private ServiceType serviceType;

    // 희망 예약 일시
    @NotNull(message = "희망 예약 일시는 필수입니다")
    @Schema(description = "희망 예약 일시", example = "2025-11-01T10:00:00", required = true)
    private LocalDateTime requestedDate;

    // 차량 정보
    @Schema(description = "차량 정보", example = "현대 그랜저 12가1234")
    private String vehicleInfo;

    // 요청 사항
    @Schema(description = "요청 사항", example = "오전 10시에 방문 부탁드립니다")
    private String notes;
}
