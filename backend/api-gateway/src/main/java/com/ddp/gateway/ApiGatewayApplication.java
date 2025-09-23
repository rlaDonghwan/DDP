package com.ddp.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

// API Gateway 메인 애플리케이션 클래스
@SpringBootApplication
@EnableDiscoveryClient // Eureka 클라이언트 기능 활성화
public class ApiGatewayApplication {

    // 애플리케이션 진입점
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}