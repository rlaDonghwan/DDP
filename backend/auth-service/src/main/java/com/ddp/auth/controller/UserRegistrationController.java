package com.ddp.auth.controller;

import com.ddp.auth.dto.*;
import com.ddp.auth.service.UserRegistrationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

// 사용자 회원가입 컨트롤러
@RestController
@RequestMapping("/api/v1/auth/registration")
@RequiredArgsConstructor
@Slf4j
@Validated
@Tag(name = "User Registration", description = "사용자 회원가입 API")
public class UserRegistrationController {

    private final UserRegistrationService userRegistrationService;

    // Step 1: SMS 인증번호 발송
    @PostMapping("/send-sms")
    @Operation(summary = "SMS 인증번호 발송", description = "회원가입을 위한 SMS 인증번호 발송")
    public ResponseEntity<SmsVerificationResponse> sendVerificationCode(
            @Valid @RequestBody SmsVerificationRequest request) {

        log.debug("SMS 인증번호 발송 요청: 전화번호 {}", request.getPhone());

        SmsVerificationResponse response = userRegistrationService.sendVerificationCode(
                request.getPhone()
        );

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Step 2: SMS 인증번호 확인
    @PostMapping("/verify-sms")
    @Operation(summary = "SMS 인증번호 확인", description = "SMS 인증번호 확인 및 임시 토큰 발급")
    public ResponseEntity<SmsVerificationResponse> verifyCode(
            @Valid @RequestBody SmsVerificationCodeRequest request) {

        log.debug("SMS 인증번호 확인 요청: 전화번호 {}", request.getPhone());

        SmsVerificationResponse response = userRegistrationService.verifyCode(
                request.getPhone(),
                request.getVerificationCode()
        );

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    // Step 3: 회원가입 완료 (이메일/비밀번호 설정)
    @PostMapping("/complete")
    @Operation(summary = "회원가입 완료", description = "이메일/비밀번호 설정 및 계정 활성화")
    public ResponseEntity<CompleteRegistrationResponse> completeRegistration(
            @Valid @RequestBody CompleteRegistrationRequest request) {

        log.debug("회원가입 완료 요청: 이메일 {}", request.getEmail());

        CompleteRegistrationResponse response = userRegistrationService.completeRegistration(
                request.getVerificationToken(),
                request.getEmail(),
                request.getPassword()
        );

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
}
