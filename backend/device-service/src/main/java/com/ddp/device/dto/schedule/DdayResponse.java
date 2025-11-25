package com.ddp.device.dto.schedule;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * D-day 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "D-day 응답")
public class DdayResponse {

    @Schema(description = "사용자 ID", example = "1")
    private Long userId;

    @Schema(description = "D-day (양수: 남은 일수, 음수: 초과 일수, 0: 오늘)", example = "7")
    private Long dday;

    @Schema(description = "D-day 메시지", example = "D-7 (제출까지 7일 남음)")
    private String message;
}
