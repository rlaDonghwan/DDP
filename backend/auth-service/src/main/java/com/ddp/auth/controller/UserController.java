package com.ddp.auth.controller;

import com.ddp.auth.dto.UserRegistrationRequest;
import com.ddp.auth.dto.UserResponse;
import com.ddp.auth.service.UserService;
import com.ddp.auth.service.JwtService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// 사용자 관리 REST API 컨트롤러
@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;
    private final JwtService jwtService;

    @Autowired
    public UserController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    // 사용자 등록 API
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerUser(@Valid @RequestBody UserRegistrationRequest request) {
        // 사용자 등록
        UserResponse user = userService.registerUser(request);
        
        // JWT 토큰 생성
        String accessToken = jwtService.generateAccessToken(
            user.userId().toString(), 
            user.email(), 
            user.name()
        );
        String refreshToken = jwtService.generateRefreshToken(user.userId().toString());
        
        // 응답 생성
        Map<String, Object> response = Map.of(
            "user", user,
            "accessToken", accessToken,
            "refreshToken", refreshToken,
            "tokenType", "Bearer",
            "expiresIn", 3600L
        );
        
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 사용자 로그인 API
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> loginUser(@Valid @RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        
        // 사용자 인증
        UserResponse user = userService.authenticateUser(email, password);
        
        // JWT 토큰 생성
        String accessToken = jwtService.generateAccessToken(
            user.userId().toString(), 
            user.email(), 
            user.name()
        );
        String refreshToken = jwtService.generateRefreshToken(user.userId().toString());
        
        // 로그인 성공 응답
        Map<String, Object> response = Map.of(
            "user", user,
            "accessToken", accessToken,
            "refreshToken", refreshToken,
            "tokenType", "Bearer",
            "expiresIn", 3600L
        );
        
        return ResponseEntity.ok(response);
    }

    // 사용자 정보 조회 API
    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long userId) {
        UserResponse response = userService.getUserById(userId);
        return ResponseEntity.ok(response);
    }

    // 사용자 정보 수정 API
    @PutMapping("/{userId}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long userId,
            @Valid @RequestBody UserRegistrationRequest request) {
        UserResponse response = userService.updateUser(userId, request);
        return ResponseEntity.ok(response);
    }

    // 헬스체크 API
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "auth-service"));
    }
}