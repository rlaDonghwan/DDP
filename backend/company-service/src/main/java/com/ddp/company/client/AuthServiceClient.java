package com.ddp.company.client;

import com.ddp.company.dto.request.CreateCompanyAccountRequest;
import com.ddp.company.dto.response.ApiResponse;
import com.ddp.company.dto.response.CreateCompanyAccountResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

// Auth Service Feign Client
@FeignClient(name = "auth-service", path = "/api/v1/auth/company/accounts")
public interface AuthServiceClient {

    /**
     * 업체 계정 생성 (auth-service 호출)
     */
    @PostMapping
    CreateCompanyAccountResponse createCompanyAccount(@RequestBody CreateCompanyAccountRequest request);

    /**
     * 업체 계정 비활성화 (auth-service 호출)
     */
    @PostMapping("/{companyId}/deactivate")
    ApiResponse deactivateCompanyAccount(@PathVariable("companyId") Long companyId);
}
