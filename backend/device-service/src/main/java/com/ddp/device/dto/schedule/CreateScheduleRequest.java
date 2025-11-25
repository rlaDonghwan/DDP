package com.ddp.device.dto.schedule;

import com.ddp.device.document.SubmissionFrequency;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 로그 제출 일정 생성 요청 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "로그 제출 일정 생성 요청")
public class CreateScheduleRequest {

    @NotNull(message = "사용자 ID는 필수입니다")
    @Schema(description = "사용자 ID", example = "1")
    private Long userId;

    @NotNull(message = "장치 ID는 필수입니다")
    @Schema(description = "장치 ID", example = "1")
    private Long deviceId;

    @NotNull(message = "제출 주기는 필수입니다")
    @Schema(description = "제출 주기", example = "MONTHLY")
    private SubmissionFrequency frequency;
}
