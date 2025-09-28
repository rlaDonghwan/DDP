package com.ddp.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

// 사용자 로그인 요청 DTO - 로그인에 필요한 최소 정보만 포함
@Data
@NoArgsConstructor
@Schema(description = "사용자 로그인 요청 정보")
public class UserLoginRequest {
    
    // 이메일 주소 (관리자는 "admin" 허용)
    @NotBlank(message = "이메일은 필수입니다")
    @Schema(description = "사용자 이메일 주소 또는 관리자 ID", example = "admin", required = true)
    private String email;
    
    // 비밀번호
    @NotBlank(message = "비밀번호는 필수입니다")
    @Schema(description = "사용자 비밀번호", example = "password123", required = true)
    private String password;
}