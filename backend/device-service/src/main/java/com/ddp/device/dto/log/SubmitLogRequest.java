package com.ddp.device.dto.log;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * 로그 제출 요청 DTO
 * (파일은 MultipartFile로 별도 처리)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubmitLogRequest {

    @NotNull(message = "장치 ID는 필수입니다")
    private Long deviceId;

    @NotNull(message = "사용자 ID는 필수입니다")
    private Long userId;

    @NotNull(message = "운행기록 시작일은 필수입니다")
    private LocalDate periodStart;

    @NotNull(message = "운행기록 종료일은 필수입니다")
    private LocalDate periodEnd;

    private String notes; // 제출 시 특이사항
}
