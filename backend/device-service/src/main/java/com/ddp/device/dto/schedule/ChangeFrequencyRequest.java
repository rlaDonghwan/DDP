package com.ddp.device.dto.schedule;

import com.ddp.device.document.SubmissionFrequency;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 제출 주기 변경 요청 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "제출 주기 변경 요청")
public class ChangeFrequencyRequest {

    @NotNull(message = "제출 주기는 필수입니다")
    @Schema(description = "새로운 제출 주기", example = "BIWEEKLY")
    private SubmissionFrequency frequency;
}
