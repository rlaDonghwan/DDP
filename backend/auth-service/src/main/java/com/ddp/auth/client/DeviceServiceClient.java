package com.ddp.auth.client;

import com.ddp.auth.client.dto.DeviceResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

// Device Service와 통신하기 위한 Feign Client
@FeignClient(name = "device-service")
public interface DeviceServiceClient {

    // 사용자의 장치 목록 조회
    @GetMapping("/api/v1/devices/user/{userId}")
    List<DeviceResponse> getUserDevices(@PathVariable("userId") Long userId);
}
