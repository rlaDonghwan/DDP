package com.ddp.reservation.client;

import com.ddp.reservation.client.dto.CreateServiceRecordRequest;
import com.ddp.reservation.client.dto.ServiceRecordResponse;
import com.ddp.reservation.dto.CompanyDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

// Company-service Feign Client
@FeignClient(name = "company-service")
public interface CompanyServiceClient {

    /**
     * 업체 기본 정보 조회
     * GET /api/v1/companies/{id}
     */
    @GetMapping("/api/v1/companies/{id}")
    CompanyDto getCompanyById(@PathVariable("id") Long id);

    /**
     * 서비스 이력 생성
     * POST /api/v1/company/service-records
     */
    @PostMapping("/api/v1/company/service-records")
    ServiceRecordResponse createServiceRecord(@RequestBody CreateServiceRecordRequest request);
}
