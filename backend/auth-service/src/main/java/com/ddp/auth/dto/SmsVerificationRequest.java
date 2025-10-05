package com.ddp.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// SMS 인증 요청 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "SMS 인증 요청")
public class SmsVerificationRequest {

    @NotBlank(message = "전화번호는 필수입니다")
    @Pattern(regexp = "^01[0-9]-[0-9]{3,4}-[0-9]{4}$", message = "올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)")
    @Schema(description = "전화번호", example = "010-1234-5678", required = true)
    private String phone;
}
