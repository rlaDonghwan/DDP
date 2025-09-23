package com.ddp.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

/**
 * DDP 프로젝트 Config Server 애플리케이션
 * 
 * Spring Cloud Config Server를 통해 마이크로서비스들의 환경설정을 중앙 관리
 * Git 저장소 기반으로 설정 파일들을 관리하며 Eureka에 등록됨
 */
@SpringBootApplication
@EnableConfigServer // Config Server 기능 활성화
@EnableDiscoveryClient // Eureka 서비스 디스커버리 클라이언트 활성화
public class ConfigServiceApplication {

    /**
     * Config Service 애플리케이션 시작점
     */
    public static void main(String[] args) {
        // Config Service 시작 로그
        System.out.println("DDP Config Service 시작 중...");
        SpringApplication.run(ConfigServiceApplication.class, args);
        System.out.println("DDP Config Service 시작 완료");
    }
}