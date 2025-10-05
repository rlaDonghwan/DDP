package com.ddp.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 회원가입 완료 요청 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "회원가입 완료 요청")
public class CompleteRegistrationRequest {

    @NotBlank(message = "인증 토큰은 필수입니다")
    @Schema(description = "SMS 인증 토큰", example = "abc123-def456-ghi789", required = true)
    private String verificationToken;

    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    @Schema(description = "이메일", example = "user@example.com", required = true)
    private String email;

    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다")
    @Schema(description = "비밀번호", example = "password123", required = true)
    private String password;
}
