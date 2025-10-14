package com.ddp.auth.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// JWT 토큰 응답 DTO - 인증 응답용
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "JWT 토큰 응답 정보")
public class TokenResponse {
    
    // 성공 여부
    @Schema(description = "요청 성공 여부", example = "true", required = true)
    private boolean success;
    
    // 응답 메시지
    @Schema(description = "응답 메시지", example = "로그인 성공")
    private String message;
    
    // 액세스 토큰
    @Schema(description = "JWT 액세스 토큰", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    private String accessToken;
    
    // 리프레시 토큰
    @Schema(description = "리프레시 토큰", example = "refresh_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx")
    private String refreshToken;
    
    // 토큰 타입 (Bearer)
    @Schema(description = "토큰 타입", example = "Bearer")
    private String tokenType;
    
    // 만료 시간 (초)
    @Schema(description = "액세스 토큰 만료 시간 (초)", example = "3600")
    private Long expiresIn;
    
    // 리프레시 토큰 만료 시간 (초)
    @Schema(description = "리프레시 토큰 만료 시간 (초)", example = "604800")
    private Long refreshExpiresIn;
    
    // 사용자 정보
    @Schema(description = "사용자 ID")
    private Long userId;
    
    @Schema(description = "사용자 이메일")
    private String email;
    
    @Schema(description = "사용자 이름")
    private String name;
    
    @Schema(description = "사용자 역할")
    private String role;
    
    // 만료 시간 상수
    private static final Long ACCESS_TOKEN_EXPIRES_IN = 1800L; // 30분
    private static final Long REFRESH_TOKEN_EXPIRES_IN = 604800L; // 7일

    // 성공 응답 생성 (로그인 성공)
    public static TokenResponse success(String accessToken, String refreshToken, Long userId, String email, String name, String role) {
        return TokenResponse.builder()
                .success(true)
                .message("로그인 성공")
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(ACCESS_TOKEN_EXPIRES_IN)
                .refreshExpiresIn(REFRESH_TOKEN_EXPIRES_IN)
                .userId(userId)
                .email(email)
                .name(name)
                .role(role)
                .build();
    }

    // 성공 응답 생성 (토큰 갱신 성공)
    public static TokenResponse successRefresh(String accessToken, String refreshToken, Long userId, String email, String name, String role) {
        return TokenResponse.builder()
                .success(true)
                .message("토큰 갱신 성공")
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(ACCESS_TOKEN_EXPIRES_IN)
                .refreshExpiresIn(REFRESH_TOKEN_EXPIRES_IN)
                .userId(userId)
                .email(email)
                .name(name)
                .role(role)
                .build();
    }

    // 성공 응답 생성 (토큰 검증 성공) - 리프레시 토큰 없음
    public static TokenResponse successValidation(String accessToken, Long userId, String email, String name, String role) {
        return TokenResponse.builder()
                .success(true)
                .message("토큰 검증 성공")
                .accessToken(accessToken)
                .tokenType("Bearer")
                .userId(userId)
                .email(email)
                .name(name)
                .role(role)
                .build();
    }

    // 실패 응답 생성
    public static TokenResponse failure(String message) {
        return TokenResponse.builder()
                .success(false)
                .message(message)
                .build();
    }
}