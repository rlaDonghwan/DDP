package com.ddp.reservation.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 예약 거절 요청 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "예약 거절 요청")
public class RejectReservationRequest {

    // 거절 사유
    @NotBlank(message = "거절 사유는 필수입니다")
    @Schema(description = "거절 사유", example = "해당 일시에 예약이 가득 찼습니다", required = true)
    private String reason;
}
