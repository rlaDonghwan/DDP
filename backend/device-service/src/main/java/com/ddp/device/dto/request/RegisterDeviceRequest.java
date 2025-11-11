package com.ddp.device.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

// 장치 등록 요청 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "장치 등록 요청")
public class RegisterDeviceRequest {

    // 장치 시리얼 번호
    @NotNull(message = "장치 시리얼 번호는 필수입니다")
    @Schema(description = "장치 시리얼 번호", example = "DDP-2025-001", required = true)
    private String serialNumber;

    // 모델명
    @NotNull(message = "모델명은 필수입니다")
    @Schema(description = "모델명", example = "DDP-X100", required = true)
    private String modelName;

    // 제조업체 ID
    @Schema(description = "제조업체 ID", example = "1")
    private Long manufacturerId;

    // 사용자 ID
    @Schema(description = "사용자 ID (설치 시)", example = "123")
    private Long userId;

    // 업체 ID
    @NotNull(message = "업체 ID는 필수입니다")
    @Schema(description = "설치 업체 ID", example = "5", required = true)
    private Long companyId;

    // 설치일
    @Schema(description = "설치일", example = "2025-01-15")
    private LocalDate installDate;

    // 보증 종료일
    @Schema(description = "보증 종료일", example = "2026-01-15")
    private LocalDate warrantyEndDate;
}
