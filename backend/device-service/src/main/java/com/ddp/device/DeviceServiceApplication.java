package com.ddp.device;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.openfeign.EnableFeignClients;

/**
 * Device Service 메인 애플리케이션
 * 장치 관리 마이크로서비스
 */
@SpringBootApplication
@EnableFeignClients
public class DeviceServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(DeviceServiceApplication.class, args);
    }
}
