package com.ddp.tcs.controller;

import com.ddp.tcs.dto.DuiSubjectResponse;
import com.ddp.tcs.dto.LicenseVerifyRequest;
import com.ddp.tcs.dto.LicenseVerifyResponse;
import com.ddp.tcs.service.TcsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

// TCS Mock API 컨트롤러 - 경찰청 TCS API 시뮬레이션
@RestController
@RequestMapping("/api/v1/tcs")
@RequiredArgsConstructor
@Slf4j
@Validated
public class TcsController {

    private final TcsService tcsService;

    // 면허 정보 조회 API
    @PostMapping("/license/verify")
    public ResponseEntity<LicenseVerifyResponse> verifyLicense(@Valid @RequestBody LicenseVerifyRequest request) {
        log.debug("면허 정보 조회 요청: {}", request.getLicenseNumber());
        
        LicenseVerifyResponse response = tcsService.verifyLicense(request);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    // 음주운전 위반자 목록 조회 API
    @GetMapping("/dui/subjects")
    public ResponseEntity<DuiSubjectResponse> getDuiSubjects() {
        log.debug("음주운전 위반자 목록 조회 요청");
        
        DuiSubjectResponse response = tcsService.getDuiSubjects();
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // API 상태 확인 (헬스체크)
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("TCS Mock Service is running");
    }
}