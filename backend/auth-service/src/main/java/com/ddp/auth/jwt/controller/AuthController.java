package com.ddp.auth.jwt.controller;

import com.ddp.auth.dto.TokenRequest;
import com.ddp.auth.dto.TokenResponse;
import com.ddp.auth.jwt.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// JWT 토큰 관리 REST API 컨트롤러
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final JwtService jwtService;

    @Autowired
    public AuthController(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    // JWT 토큰 생성 API
    @PostMapping("/token")
    public ResponseEntity<TokenResponse> generateToken(@Valid @RequestBody TokenRequest request) {
        String accessToken = jwtService.generateAccessToken(request.userId(), request.email(), request.name());
        String refreshToken = jwtService.generateRefreshToken(request.userId());
        
        TokenResponse response = new TokenResponse(accessToken, refreshToken, 3600L); // 1시간
        return ResponseEntity.ok(response);
    }

    // 토큰 갱신 API
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        String email = request.get("email");
        String name = request.get("name");
        
        if (refreshToken == null || email == null || name == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "refreshToken, email, name이 필요합니다"));
        }
        
        try {
            String newAccessToken = jwtService.refreshAccessToken(refreshToken, email, name);
            return ResponseEntity.ok(Map.of(
                "accessToken", newAccessToken,
                "tokenType", "Bearer",
                "expiresIn", 3600L
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        }
    }

    // 토큰 유효성 검증 API
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateToken(@RequestBody Map<String, String> request) {
        String token = request.get("token");
        
        if (token == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "token이 필요합니다"));
        }
        
        boolean isValid = jwtService.validateToken(token);
        
        if (isValid) {
            String userId = jwtService.getUserIdFromToken(token);
            return ResponseEntity.ok(Map.of(
                "valid", true,
                "userId", userId
            ));
        } else {
            return ResponseEntity.ok(Map.of("valid", false));
        }
    }

    // 로그아웃 API (리프레시 토큰 삭제)
    @PostMapping("/logout")
    public ResponseEntity<Map<String, String>> logout(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        
        if (userId == null) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "userId가 필요합니다"));
        }
        
        jwtService.deleteRefreshToken(userId);
        return ResponseEntity.ok(Map.of("message", "로그아웃 성공"));
    }

    // 헬스체크 API
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "auth-service"));
    }
}