package com.ddp.device.dto.log;

import com.ddp.device.document.LogStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 로그 검토 요청 DTO (관리자용)
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewLogRequest {

    @NotNull(message = "검토 상태는 필수입니다")
    private LogStatus status; // APPROVED 또는 REJECTED

    private String reviewNotes; // 검토 메모

    @NotNull(message = "검토자 ID는 필수입니다")
    private Long reviewerId; // 검토자 (관리자) ID
}
