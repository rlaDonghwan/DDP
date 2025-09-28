package com.ddp.auth.service;

import com.ddp.auth.config.JwtConfig;
import com.ddp.auth.entity.User;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.UUID;

// JWT 토큰 관리 서비스
@Service
@RequiredArgsConstructor
@Slf4j
public class JwtService {

    private final JwtConfig jwtConfig;
    private final BlacklistService blacklistService;

    // JWT 시크릿 키 생성
    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes());
    }

    // JWT 토큰 생성
    public String generateToken(User user) {
        log.info("API 호출 시작: JWT 토큰 생성 - 사용자 ID: {}", user.getUserId());
        
        long startTime = System.currentTimeMillis();
        
        try {
            Date now = new Date();
            Date expiryDate = new Date(now.getTime() + jwtConfig.getExpirationMs());
            String jti = UUID.randomUUID().toString(); // JWT ID 생성

            String token = Jwts.builder()
                    .setSubject(user.getEmail()) // 토큰 주체 (이메일)
                    .setId(jti) // JWT ID (블랙리스트용)
                    .claim("userId", user.getUserId()) // 사용자 ID
                    .claim("email", user.getEmail()) // 이메일
                    .claim("name", user.getName()) // 사용자 이름
                    .claim("role", user.getRole().name()) // 사용자 역할
                    .setIssuer(jwtConfig.getIssuer()) // 발급자
                    .setIssuedAt(now) // 발급 시간
                    .setExpiration(expiryDate) // 만료 시간
                    .signWith(getSigningKey(), SignatureAlgorithm.HS512) // 서명
                    .compact();

            log.info("API 호출 완료: JWT 액세스 토큰 생성 - 사용자 ID: {}, JTI: {} ({}ms)", 
                    user.getUserId(), jti, System.currentTimeMillis() - startTime);
            
            return token;
            
        } catch (Exception e) {
            log.error("JWT 토큰 생성 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("JWT 토큰 생성에 실패했습니다.", e);
        }
    }

    // JWT 토큰 유효성 검증
    public boolean validateToken(String token) {
        log.info("API 호출 시작: JWT 토큰 검증");
        
        long startTime = System.currentTimeMillis();
        
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            
            // 블랙리스트 확인
            String jti = claims.getId();
            if (jti != null && blacklistService.isAccessTokenBlacklisted(jti)) {
                log.warn("블랙리스트에 등록된 토큰: {}", jti);
                return false;
            }
            
            // 사용자별 블랙리스트 확인 (전체 로그아웃 처리)
            Long userId = claims.get("userId", Long.class);
            Date issuedAt = claims.getIssuedAt();
            if (userId != null && issuedAt != null && 
                blacklistService.isUserTokenBlacklistedBefore(userId, issuedAt)) {
                log.warn("전체 로그아웃으로 무효화된 토큰 - 사용자 ID: {}", userId);
                return false;
            }
            
            log.info("API 호출 완료: JWT 토큰 검증 - 유효함 ({}ms)", 
                    System.currentTimeMillis() - startTime);
            
            return true;
            
        } catch (SecurityException e) {
            log.warn("잘못된 JWT 서명: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            log.warn("잘못된 JWT 토큰 형식: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.warn("만료된 JWT 토큰: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.warn("지원되지 않는 JWT 토큰: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.warn("JWT 토큰이 비어있음: {}", e.getMessage());
        } catch (Exception e) {
            log.error("JWT 토큰 검증 중 오류 발생: {}", e.getMessage(), e);
        }
        
        log.info("API 호출 완료: JWT 토큰 검증 - 유효하지 않음 ({}ms)", 
                System.currentTimeMillis() - startTime);
        
        return false;
    }

    // JWT 토큰에서 사용자 이메일 추출
    public String getUserEmailFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.getSubject();
    }

    // JWT 토큰에서 사용자 ID 추출
    public Long getUserIdFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.get("userId", Long.class);
    }

    // JWT 토큰에서 사용자 이름 추출
    public String getUserNameFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.get("name", String.class);
    }

    // JWT 토큰에서 사용자 역할 추출
    public String getUserRoleFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.get("role", String.class);
    }

    // JWT 토큰에서 만료 시간 추출
    public Date getExpirationDateFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.getExpiration();
    }

    // JWT 토큰에서 발급 시간 추출
    public Date getIssuedAtFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.getIssuedAt();
    }

    // JWT 토큰에서 JTI (JWT ID) 추출
    public String getJtiFromToken(String token) {
        Claims claims = getClaimsFromToken(token);
        return claims.getId();
    }

    // JWT 토큰에서 Claims 추출 (내부 메서드)
    private Claims getClaimsFromToken(String token) {
        try {
            return Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            log.error("JWT Claims 추출 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("JWT 토큰 파싱에 실패했습니다.", e);
        }
    }
}