package com.ddp.auth.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

// 데이터베이스 설정 클래스
@Configuration
@EnableJpaAuditing // JPA Auditing 활성화 (CreatedDate, LastModifiedDate)
public class DatabaseConfig {
}