package com.ddp.reservation.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 예약 취소 요청 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "예약 취소 요청")
public class CancelReservationRequest {

    // 취소 사유
    @Schema(description = "취소 사유", example = "개인 사정으로 취소합니다")
    private String reason;
}
