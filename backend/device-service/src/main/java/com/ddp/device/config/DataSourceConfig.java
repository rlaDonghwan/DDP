package com.ddp.device.config;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

/**
 * 멀티 데이터소스 설정
 * - PostgreSQL: 장치 정보 및 검·교정 이력 (구조화된 데이터)
 * - MongoDB: 운행기록 로그 (비구조화/대용량 데이터)
 */
@Configuration
@EnableJpaRepositories(
    basePackages = "com.ddp.device.repository.jpa",
    entityManagerFactoryRef = "entityManagerFactory",
    transactionManagerRef = "transactionManager"
)
@EnableMongoRepositories(
    basePackages = "com.ddp.device.repository.mongo"
)
@EntityScan(basePackages = {
    "com.ddp.device.entity",
    "com.ddp.device.document"
})
public class DataSourceConfig {
    // Spring Boot의 자동 구성을 활용하므로 별도의 Bean 정의는 불필요
    // JPA: @EnableJpaRepositories가 자동으로 EntityManagerFactory와 TransactionManager 구성
    // MongoDB: @EnableMongoRepositories가 자동으로 MongoTemplate 구성
}
