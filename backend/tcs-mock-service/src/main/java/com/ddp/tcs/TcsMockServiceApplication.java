package com.ddp.tcs;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

// TCS Mock Service 메인 애플리케이션 클래스
@SpringBootApplication
@EnableDiscoveryClient // Eureka 클라이언트 활성화
public class TcsMockServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(TcsMockServiceApplication.class, args);
    }
}