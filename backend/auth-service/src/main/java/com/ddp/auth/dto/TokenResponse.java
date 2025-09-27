package com.ddp.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import lombok.NoArgsConstructor;

// JWT 토큰 응답 DTO - 토큰 발급 및 갱신 응답용
@Data
@NoArgsConstructor
@Schema(description = "JWT 토큰 응답 정보")
public class TokenResponse {
    
    // 액세스 토큰
    @NotBlank(message = "액세스 토큰은 필수입니다")
    @Schema(description = "JWT 액세스 토큰", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", required = true)
    private String accessToken;
    
    // 리프레시 토큰
    @NotBlank(message = "리프레시 토큰은 필수입니다")
    @Schema(description = "JWT 리프레시 토큰", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", required = true)
    private String refreshToken;
    
    // 토큰 타입 (Bearer)
    @NotBlank(message = "토큰 타입은 필수입니다")
    @Schema(description = "토큰 타입", example = "Bearer", required = true)
    private String tokenType;
    
    // 만료 시간 (초)
    @NotNull(message = "만료 시간은 필수입니다")
    @Positive(message = "만료 시간은 양수여야 합니다")
    @Schema(description = "액세스 토큰 만료 시간 (초)", example = "3600", required = true)
    private Long expiresIn;
    
    // 모든 필드를 포함하는 생성자
    public TokenResponse(String accessToken, String refreshToken, String tokenType, Long expiresIn) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.tokenType = tokenType;
        this.expiresIn = expiresIn;
    }
    
    // 기본 토큰 타입을 Bearer로 설정하는 팩토리 메서드
    public static TokenResponse createBearerToken(String accessToken, String refreshToken, Long expiresIn) {
        return new TokenResponse(accessToken, refreshToken, "Bearer", expiresIn);
    }
    
    // 액세스 토큰만 갱신하는 팩토리 메서드
    public static TokenResponse createAccessTokenOnly(String accessToken, Long expiresIn) {
        return new TokenResponse(accessToken, null, "Bearer", expiresIn);
    }
    
    // 토큰 유효성 검증 메서드
    public boolean isValid() {
        return accessToken != null && !accessToken.trim().isEmpty() &&
               tokenType != null && !tokenType.trim().isEmpty() &&
               expiresIn != null && expiresIn > 0;
    }
    
    // 리프레시 토큰 포함 여부 확인
    public boolean hasRefreshToken() {
        return refreshToken != null && !refreshToken.trim().isEmpty();
    }
}