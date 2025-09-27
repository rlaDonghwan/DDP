package com.ddp.auth.controller;

import com.ddp.auth.dto.AdminUserCreateRequest;
import com.ddp.auth.dto.AdminUserCreateResponse;
import com.ddp.auth.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

// 관리자 전용 컨트롤러
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
@Validated
@CrossOrigin(origins = "*") // 개발용 CORS 설정
public class AdminController {

    private final AdminUserService adminUserService;

    // 관리자용 사용자 생성 (TCS 연동)
    @PostMapping("/users/create-from-tcs")
    @PreAuthorize("hasRole('ADMIN')") // 관리자 권한 필요
    public ResponseEntity<AdminUserCreateResponse> createUserFromTcs(@Valid @RequestBody AdminUserCreateRequest request) {
        log.debug("관리자용 사용자 생성 요청: 면허번호 {}", request.getLicenseNumber());
        
        AdminUserCreateResponse response = adminUserService.createUserFromTcs(request);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    // API 상태 확인 (관리자 전용)
    @GetMapping("/health")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> adminHealth() {
        return ResponseEntity.ok("Admin API is running");
    }
}