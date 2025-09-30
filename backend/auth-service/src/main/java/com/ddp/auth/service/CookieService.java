package com.ddp.auth.service;

import com.ddp.auth.config.JwtConfig;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

// JWT 쿠키 관리 서비스
@Service
@RequiredArgsConstructor
@Slf4j
public class CookieService {

    private final JwtConfig jwtConfig;

    // Access Token 쿠키 생성
    public ResponseCookie createAccessTokenCookie(String accessToken) {
        log.debug("Access Token 쿠키 생성");
        
        return ResponseCookie.from(jwtConfig.getCookie().getName(), accessToken)
                .httpOnly(jwtConfig.getCookie().isHttpOnly())
                .secure(jwtConfig.getCookie().isSecure())
                .path("/")
                .maxAge(jwtConfig.getCookie().getMaxAge())
                .sameSite(jwtConfig.getCookie().getSameSite())
                .build();
    }

    // Refresh Token 쿠키 생성
    public ResponseCookie createRefreshTokenCookie(String refreshToken) {
        log.debug("Refresh Token 쿠키 생성");
        
        return ResponseCookie.from(jwtConfig.getCookie().getRefreshName(), refreshToken)
                .httpOnly(jwtConfig.getCookie().isHttpOnly())
                .secure(jwtConfig.getCookie().isSecure())
                .path("/")
                .maxAge(jwtConfig.getCookie().getRefreshMaxAge())
                .sameSite(jwtConfig.getCookie().getSameSite())
                .build();
    }

    // Access Token 쿠키 삭제
    public ResponseCookie createDeleteAccessTokenCookie() {
        log.debug("Access Token 쿠키 삭제");
        
        return ResponseCookie.from(jwtConfig.getCookie().getName(), "")
                .httpOnly(jwtConfig.getCookie().isHttpOnly())
                .secure(jwtConfig.getCookie().isSecure())
                .path("/")
                .maxAge(0)
                .sameSite(jwtConfig.getCookie().getSameSite())
                .build();
    }

    // Refresh Token 쿠키 삭제
    public ResponseCookie createDeleteRefreshTokenCookie() {
        log.debug("Refresh Token 쿠키 삭제");
        
        return ResponseCookie.from(jwtConfig.getCookie().getRefreshName(), "")
                .httpOnly(jwtConfig.getCookie().isHttpOnly())
                .secure(jwtConfig.getCookie().isSecure())
                .path("/")
                .maxAge(0)
                .sameSite(jwtConfig.getCookie().getSameSite())
                .build();
    }

    // 요청에서 Access Token 추출
    public String extractAccessToken(HttpServletRequest request) {
        return extractCookieValue(request, jwtConfig.getCookie().getName());
    }

    // 요청에서 Refresh Token 추출
    public String extractRefreshToken(HttpServletRequest request) {
        return extractCookieValue(request, jwtConfig.getCookie().getRefreshName());
    }

    // 쿠키에서 값 추출하는 공통 메서드
    private String extractCookieValue(HttpServletRequest request, String cookieName) {
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookieName.equals(cookie.getName())) {
                    log.debug("{} 쿠키에서 값 추출 성공", cookieName);
                    return cookie.getValue();
                }
            }
        }
        log.debug("{} 쿠키를 찾을 수 없음", cookieName);
        return null;
    }
}