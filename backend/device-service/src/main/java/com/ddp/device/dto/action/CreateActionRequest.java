package com.ddp.device.dto.action;

import com.ddp.device.document.ActionType;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 관리자 조치 생성 요청 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "관리자 조치 생성 요청")
public class CreateActionRequest {

    @NotBlank(message = "로그 ID는 필수입니다")
    @Schema(description = "대상 로그 ID", example = "log_001")
    private String logId;

    @NotNull(message = "사용자 ID는 필수입니다")
    @Schema(description = "대상 사용자 ID", example = "1")
    private Long userId;

    @NotNull(message = "관리자 ID는 필수입니다")
    @Schema(description = "조치 실행 관리자 ID", example = "1")
    private Long adminId;

    @NotNull(message = "조치 유형은 필수입니다")
    @Schema(description = "조치 유형", example = "WARNING_NOTIFICATION")
    private ActionType actionType;

    @NotBlank(message = "조치 상세 내용은 필수입니다")
    @Schema(description = "조치 상세 내용", example = "로그 제출 기한이 임박했습니다. 7일 이내에 제출해주세요.")
    private String actionDetail;
}
