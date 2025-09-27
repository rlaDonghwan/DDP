package com.ddp.auth.controller;

import com.ddp.auth.dto.TokenResponse;
import com.ddp.auth.dto.UserLoginRequest;
import com.ddp.auth.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

// 인증 관련 컨트롤러
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@Validated
@CrossOrigin(origins = "*") // 개발용 CORS 설정
public class AuthController {

    private final AuthService authService;

    // 로그인
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody UserLoginRequest request) {
        log.debug("로그인 요청: {}", request.getEmail());

        TokenResponse response = authService.login(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    // 토큰 검증
    @PostMapping("/validate")
    public ResponseEntity<TokenResponse> validateToken(@RequestHeader("Authorization") String authHeader) {
        log.debug("토큰 검증 요청");

        // Bearer 토큰에서 실제 토큰 추출
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;

        TokenResponse response = authService.validateToken(token);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    // API 상태 확인
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Auth Service is running");
    }
}