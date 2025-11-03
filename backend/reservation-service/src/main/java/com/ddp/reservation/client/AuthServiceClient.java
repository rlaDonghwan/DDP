package com.ddp.reservation.client;

import com.ddp.reservation.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// Auth-service Feign Client
@FeignClient(name = "auth-service")
public interface AuthServiceClient {

    /**
     * 사용자 정보 조회
     * GET /api/v1/users/{id}
     */
    @GetMapping("/api/v1/users/{id}")
    UserDto getUserById(@PathVariable("id") Long id);
}
