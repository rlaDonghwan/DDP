package com.ddp.reservation.client;

import com.ddp.reservation.client.dto.RegisterDeviceRequest;
import com.ddp.reservation.client.dto.DeviceResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Device Service 통신을 위한 Feign Client
 */
@FeignClient(name = "device-service")
public interface DeviceServiceClient {

    /**
     * 장치 등록 API 호출
     *
     * @param request 장치 등록 요청
     * @return 등록된 장치 정보
     */
    @PostMapping("/api/v1/devices")
    DeviceResponse registerDevice(@RequestBody RegisterDeviceRequest request);
}
