package com.ddp.gateway.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

// JWT 설정 클래스
@Configuration
@ConfigurationProperties(prefix = "jwt")
@Data
public class JwtConfig {

    // JWT 시크릿 키
    private String secret;

    // 발급자
    private String issuer = "ddp-gateway";
}
