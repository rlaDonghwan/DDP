package com.ddp.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// TCS 운전면허 검증 요청 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "TCS 운전면허 검증 요청")
public class TcsVerificationRequest {

    @NotBlank(message = "운전면허 번호는 필수입니다")
    @Schema(description = "운전면허 번호", example = "23-45-678901-22", required = true)
    private String licenseNumber;
}
