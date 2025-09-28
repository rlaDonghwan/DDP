package com.ddp.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

// 토큰 갱신 요청 DTO
@Data
@NoArgsConstructor
@Schema(description = "토큰 갱신 요청 정보")
public class RefreshTokenRequest {
    
    // 리프레시 토큰
    @NotBlank(message = "리프레시 토큰은 필수입니다")
    @Schema(description = "리프레시 토큰", example = "refresh_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", required = true)
    private String refreshToken;
}