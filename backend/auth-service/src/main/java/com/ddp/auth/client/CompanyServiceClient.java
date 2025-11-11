package com.ddp.auth.client;

import com.ddp.auth.client.dto.CompanyNameResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

// Company Service와 통신하기 위한 Feign Client
@FeignClient(name = "company-service")
public interface CompanyServiceClient {

    // 업체명 조회
    @GetMapping("/api/v1/public/operators/{id}/name")
    CompanyNameResponse getCompanyName(@PathVariable("id") Long id);
}
