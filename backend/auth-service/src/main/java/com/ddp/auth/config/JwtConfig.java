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
    
    // JWT 시크릿 키 (기본값 설정)
    private String secret = "ddp-auth-service-jwt-secret-key-2024-very-long-secret-key-for-security";
    
    // JWT 토큰 만료 시간 (밀리초, 기본값: 24시간)
    private long expirationMs = 86400000; // 24 * 60 * 60 * 1000
    
    // 리프레시 토큰 만료 시간 (밀리초, 기본값: 7일)
    private long refreshExpirationMs = 604800000; // 7 * 24 * 60 * 60 * 1000
    
    // JWT 토큰 발급자
    private String issuer = "ddp-auth-service";
}