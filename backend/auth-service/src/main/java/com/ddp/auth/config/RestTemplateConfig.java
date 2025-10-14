package com.ddp.auth.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

// RestTemplate 설정 클래스
@Configuration
@Slf4j
public class RestTemplateConfig {

    // RestTemplate Bean 등록
    @Bean
    public RestTemplate restTemplate(RestTemplateBuilder builder) {
        log.info("RestTemplate Bean 생성 중...");
        
        // HTTP 연결 설정
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(5000); // 연결 타임아웃: 5초
        factory.setReadTimeout(10000);   // 읽기 타임아웃: 10초
        
        RestTemplate restTemplate = builder.connectTimeout(Duration.ofSeconds(5)).readTimeout(Duration.ofSeconds(10))    // 읽기 타임아웃
                .requestFactory(() -> factory)
                .build();
        
        log.info("RestTemplate Bean 생성 완료 - 연결타임아웃: 5초, 읽기타임아웃: 10초");
        
        return restTemplate;
    }
}