package com.ddp.eureka;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

// Eureka 서버 메인 애플리케이션 클래스
@SpringBootApplication
@EnableEurekaServer // Eureka 서버 기능 활성화
public class EurekaServerApplication {

    // 애플리케이션 진입점
    public static void main(String[] args) {
        SpringApplication.run(EurekaServerApplication.class, args);
    }
}