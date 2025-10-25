package com.ddp.auth.controller;

import com.ddp.auth.dto.request.CreateCompanyAccountRequest;
import com.ddp.auth.dto.response.ApiResponse;
import com.ddp.auth.dto.response.CreateCompanyAccountResponse;
import com.ddp.auth.service.CompanyAccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

// 업체 계정 관리 컨트롤러
@RestController
@RequestMapping("/api/v1/auth/company/accounts")
@RequiredArgsConstructor
@Slf4j
@Validated
@Tag(name = "Company Account", description = "업체 계정 관리 API")
public class CompanyAccountController {

    private final CompanyAccountService companyAccountService;

    /**
     * 업체 계정 생성 (company-service에서 호출)
     */
    @PostMapping
    @Operation(summary = "업체 계정 생성", description = "company-service에서 업체 승인 시 호출하여 로그인 계정을 생성합니다")
    public ResponseEntity<CreateCompanyAccountResponse> createCompanyAccount(
        @Valid @RequestBody CreateCompanyAccountRequest request
    ) {
        log.debug("업체 계정 생성 요청 - 업체 ID: {}, 이메일: {}", request.getCompanyId(), request.getEmail());

        CreateCompanyAccountResponse response = companyAccountService.createCompanyAccount(
            request.getCompanyId(),
            request.getCompanyName(),
            request.getEmail(),
            request.getPassword(),
            request.getPhone()
        );

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 업체 계정 비활성화 (company-service에서 업체 삭제 시 호출)
     */
    @PostMapping("/{companyId}/deactivate")
    @Operation(summary = "업체 계정 비활성화", description = "업체 삭제 시 해당 업체의 로그인 계정을 비활성화합니다")
    public ResponseEntity<ApiResponse> deactivateCompanyAccount(
        @PathVariable Long companyId
    ) {
        log.debug("업체 계정 비활성화 요청 - 업체 ID: {}", companyId);

        ApiResponse response = companyAccountService.deactivateCompanyAccount(companyId);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
