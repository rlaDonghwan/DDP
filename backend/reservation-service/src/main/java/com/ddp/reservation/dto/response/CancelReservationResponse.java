package com.ddp.reservation.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

// 예약 취소 응답 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "예약 취소 응답")
public class CancelReservationResponse {

    // 예약 ID
    @Schema(description = "예약 ID", example = "1")
    private Long reservationId;

    // 취소 수수료
    @Schema(description = "취소 수수료", example = "50000")
    private BigDecimal cancellationFee;

    // 취소 정책 (24H_BEFORE: 24시간 이전, 24H_WITHIN: 24시간 이내)
    @Schema(description = "취소 정책", example = "24H_BEFORE")
    private String cancellationPolicy;

    // 안내 메시지
    @Schema(description = "안내 메시지", example = "취소 수수료 없이 예약이 취소되었습니다.")
    private String message;
}
