package com.ddp.auth.controller;

import com.ddp.auth.dto.TokenResponse;
import com.ddp.auth.dto.UserLoginRequest;
import com.ddp.auth.service.AuthService;
import com.ddp.auth.service.CookieService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

// 인증 관련 컨트롤러
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
@Validated
public class AuthController {

    private final AuthService authService;
    private final CookieService cookieService;


    // 로그인
    @PostMapping("/login")
    public ResponseEntity<TokenResponse> login(@Valid @RequestBody UserLoginRequest request, HttpServletResponse httpResponse) {
        log.debug("로그인 요청: {}", request.getEmail());

        TokenResponse response = authService.login(request);

        if (response.isSuccess()) {
            // Access Token을 httpOnly 쿠키로 설정
            ResponseCookie accessTokenCookie = cookieService.createAccessTokenCookie(response.getAccessToken());
            httpResponse.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
            
            // Refresh Token을 httpOnly 쿠키로 설정
            ResponseCookie refreshTokenCookie = cookieService.createRefreshTokenCookie(response.getRefreshToken());
            httpResponse.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
            
            // 응답에서 토큰들 제거 (쿠키로 전송하므로)
            TokenResponse cookieResponse = TokenResponse.success(
                null, // 액세스 토큰 제거
                null, // 리프레시 토큰 제거
                response.getUserId(),
                response.getEmail(),
                response.getName(),
                response.getRole()
            );
            
            return ResponseEntity.ok(cookieResponse);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    // 토큰 검증
    @PostMapping("/validate")
    public ResponseEntity<TokenResponse> validateToken(HttpServletRequest request) {
        log.debug("토큰 검증 요청");

        // 쿠키에서 JWT 추출
        String token = cookieService.extractAccessToken(request);

        if (token == null) {
            return ResponseEntity.badRequest().body(TokenResponse.failure("인증 토큰이 없습니다."));
        }

        TokenResponse response = authService.validateToken(token);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<TokenResponse> logout(HttpServletRequest request, HttpServletResponse httpResponse) {
        log.debug("로그아웃 요청");

        // 쿠키에서 JWT 추출
        String token = cookieService.extractAccessToken(request);

        if (token == null) {
            return ResponseEntity.badRequest().body(TokenResponse.failure("인증 토큰이 없습니다."));
        }

        TokenResponse response = authService.logout(token);

        if (response.isSuccess()) {
            clearAuthCookies(httpResponse);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    // 전체 로그아웃 (모든 기기에서 로그아웃)
    @PostMapping("/logout-all")
    public ResponseEntity<TokenResponse> logoutAll(HttpServletRequest request, HttpServletResponse httpResponse) {
        log.debug("전체 로그아웃 요청");

        // 쿠키에서 JWT 추출
        String token = cookieService.extractAccessToken(request);

        if (token == null) {
            return ResponseEntity.badRequest().body(TokenResponse.failure("인증 토큰이 없습니다."));
        }

        TokenResponse response = authService.logoutAll(token);

        if (response.isSuccess()) {
            clearAuthCookies(httpResponse);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    // 인증 쿠키 삭제 공통 메서드
    private void clearAuthCookies(HttpServletResponse httpResponse) {
        ResponseCookie deleteAccessCookie = cookieService.createDeleteAccessTokenCookie();
        ResponseCookie deleteRefreshCookie = cookieService.createDeleteRefreshTokenCookie();
        httpResponse.addHeader(HttpHeaders.SET_COOKIE, deleteAccessCookie.toString());
        httpResponse.addHeader(HttpHeaders.SET_COOKIE, deleteRefreshCookie.toString());
    }

    // 토큰 갱신
    @PostMapping("/refresh")
    public ResponseEntity<TokenResponse> refreshToken(HttpServletRequest request, HttpServletResponse httpResponse) {
        log.debug("토큰 갱신 요청");

        // 쿠키에서 Refresh Token 추출
        String refreshToken = cookieService.extractRefreshToken(request);
        
        if (refreshToken == null) {
            return ResponseEntity.badRequest().body(TokenResponse.failure("리프레시 토큰이 없습니다."));
        }

        TokenResponse response = authService.refreshToken(refreshToken);

        if (response.isSuccess()) {
            // 새로운 Access Token을 httpOnly 쿠키로 설정
            ResponseCookie accessTokenCookie = cookieService.createAccessTokenCookie(response.getAccessToken());
            httpResponse.addHeader(HttpHeaders.SET_COOKIE, accessTokenCookie.toString());
            
            // 새로운 Refresh Token을 httpOnly 쿠키로 설정 (토큰 로테이션)
            ResponseCookie refreshTokenCookie = cookieService.createRefreshTokenCookie(response.getRefreshToken());
            httpResponse.addHeader(HttpHeaders.SET_COOKIE, refreshTokenCookie.toString());
            
            // 응답에서 토큰들 제거 (쿠키로 전송하므로)
            TokenResponse cookieResponse = TokenResponse.successRefresh(
                null, // 액세스 토큰 제거
                null, // 리프레시 토큰 제거
                response.getUserId(),
                response.getEmail(),
                response.getName(),
                response.getRole()
            );
            
            return ResponseEntity.ok(cookieResponse);
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