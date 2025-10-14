package com.ddp.auth.controller;

import com.ddp.auth.dto.response.AccountCheckResponse;
import com.ddp.auth.dto.request.AdminCreateAccountRequest;
import com.ddp.auth.dto.response.AdminCreateAccountResponse;
import com.ddp.auth.service.AdminAccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

// 관리자 계정 관리 컨트롤러
@RestController
@RequestMapping("/api/v1/auth/admin/accounts")
@RequiredArgsConstructor
@Slf4j
@Validated
@Tag(name = "Admin Account", description = "관리자 계정 관리 API")
public class AdminAccountController {

    private final AdminAccountService adminAccountService;

    // 관리자가 음주운전자 미완성 계정 생성
    @PostMapping("/create")
    @Operation(summary = "음주운전자 미완성 계정 생성", description = "TCS 검증 후 미완성 계정 생성 (관리자 전용)")
    public ResponseEntity<AdminCreateAccountResponse> createPendingAccount(
            @Valid @RequestBody AdminCreateAccountRequest request) {

        log.debug("관리자 계정 생성 요청: 운전면허 번호 {}", request.getLicenseNumber());

        AdminCreateAccountResponse response = adminAccountService.createPendingAccount(
                request.getLicenseNumber()
        );

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    // 계정 존재 여부 확인
    @GetMapping("/check/{licenseNumber}")
    @Operation(summary = "계정 존재 여부 확인", description = "운전면허 번호로 계정 존재 여부 및 상태 확인")
    public ResponseEntity<AccountCheckResponse> checkAccount(@PathVariable String licenseNumber) {

        log.debug("계정 존재 여부 확인 요청: 운전면허 번호 {}", licenseNumber);

        boolean exists = adminAccountService.checkAccountExists(licenseNumber);

        if (exists) {
            String accountStatus = adminAccountService.getAccountStatus(licenseNumber);
            return ResponseEntity.ok(AccountCheckResponse.exists(accountStatus));
        } else {
            return ResponseEntity.ok(AccountCheckResponse.notExists());
        }
    }
}
