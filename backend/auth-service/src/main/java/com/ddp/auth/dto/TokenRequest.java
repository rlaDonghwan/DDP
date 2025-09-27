package com.ddp.auth.dto;

import com.ddp.auth.entity.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

// 토큰 생성 요청 DTO - JWT 토큰 생성을 위한 사용자 정보
@Data
@NoArgsConstructor
@Schema(description = "JWT 토큰 생성 요청 정보")
public class TokenRequest {
    
    // 사용자 ID
    @NotBlank(message = "사용자 ID는 필수입니다")
    @Schema(description = "사용자 고유 ID", example = "123", required = true)
    private String userId;
    
    // 사용자 이메일
    @Email(message = "올바른 이메일 형식이 아닙니다")
    @NotBlank(message = "이메일은 필수입니다")
    @Schema(description = "사용자 이메일 주소", example = "user@example.com", required = true)
    private String email;
    
    // 사용자 이름
    @NotBlank(message = "이름은 필수입니다")
    @Schema(description = "사용자 이름", example = "홍길동", required = true)
    private String name;
    
    // 사용자 역할
    @Schema(description = "사용자 역할", example = "USER", allowableValues = {"USER", "COMPANY", "ADMIN"})
    private UserRole role;
}