package com.ddp.auth.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

// JWT 설정 클래스
@Component
@ConfigurationProperties(prefix = "jwt")
@Getter
@Setter
public class JwtConfig {
    
    // JWT 시크릿 키 (config-repo 환경변수 연동)
    private String secret = "myDevelopmentSecretKeyForDDPProject32Chars";
    
    // JWT 액세스 토큰 만료 시간 (초 단위, 기본값: 30분)
    private long accessTokenExpiration = 1800; // 30분
    
    // JWT 리프레시 토큰 만료 시간 (초 단위, 기본값: 7일)
    private long refreshTokenExpiration = 604800; // 7일
    
    // JWT 토큰 발급자
    private String issuer = "ddp-auth-service";
    
    // 쿠키 설정
    private Cookie cookie = new Cookie();
    
    // 액세스 토큰 만료 시간을 밀리초로 반환 (기존 호환성 유지)
    public long getExpirationMs() {
        return accessTokenExpiration * 1000;
    }
    
    // 리프레시 토큰 만료 시간을 밀리초로 반환 (기존 호환성 유지)
    public long getRefreshExpirationMs() {
        return refreshTokenExpiration * 1000;
    }
    
    // 쿠키 설정 내부 클래스
    @Getter
    @Setter
    public static class Cookie {
        // Access Token 쿠키 설정
        private String name = "jwt";
        private long maxAge = 3600; // 1시간
        
        // Refresh Token 쿠키 설정
        private String refreshName = "refreshToken";
        private long refreshMaxAge = 604800; // 7일
        
        // 공통 쿠키 보안 설정
        private boolean secure = false;
        private boolean httpOnly = true;
        private String sameSite = "strict";
    }
}