package com.ddp.auth.dto;

// 토큰 응답 DTO
public record TokenResponse(
    // 액세스 토큰
    String accessToken,
    
    // 리프레시 토큰
    String refreshToken,
    
    // 토큰 타입 (Bearer)
    String tokenType,
    
    // 만료 시간 (초)
    Long expiresIn
) {
    // 기본 토큰 타입을 Bearer로 설정하는 생성자
    public TokenResponse(String accessToken, String refreshToken, Long expiresIn) {
        this(accessToken, refreshToken, "Bearer", expiresIn);
    }
}