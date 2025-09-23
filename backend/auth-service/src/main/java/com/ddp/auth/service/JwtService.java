package com.ddp.auth.service;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.concurrent.TimeUnit;

// JWT 토큰 관리 서비스
@Service
public class JwtService {

    private final SecretKey secretKey;
    private final long accessTokenExpiration;
    private final long refreshTokenExpiration;
    private final RedisTemplate<String, String> redisTemplate;

    public JwtService(
            @Value("${jwt.secret:mySecretKeyForDDPProjectThatNeedsToBeAtLeast32Characters}") String secret,
            @Value("${jwt.access-token-expiration:3600}") long accessTokenExpiration,
            @Value("${jwt.refresh-token-expiration:604800}") long refreshTokenExpiration,
            RedisTemplate<String, String> redisTemplate) {
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.accessTokenExpiration = accessTokenExpiration; // 1시간
        this.refreshTokenExpiration = refreshTokenExpiration; // 7일
        this.redisTemplate = redisTemplate;
    }

    // 액세스 토큰 생성
    public String generateAccessToken(String userId, String email, String name) {
        // API 호출 시작 로그
        long startTime = System.currentTimeMillis();
        System.out.println("API 호출 시작: 액세스 토큰 생성");

        try {
            Date expirationDate = new Date(System.currentTimeMillis() + (accessTokenExpiration * 1000));

            String token = Jwts.builder()
                    .subject(userId)
                    .claim("email", email)
                    .claim("name", name)
                    .claim("type", "access")
                    .issuedAt(new Date())
                    .expiration(expirationDate)
                    .signWith(secretKey)
                    .compact();

            // API 호출 완료 로그
            long endTime = System.currentTimeMillis();
            System.out.println("API 호출 완료: 액세스 토큰 생성 (" + (endTime - startTime) + "ms)");

            return token;
        } catch (Exception e) {
            // API 호출 실패 로그
            long endTime = System.currentTimeMillis();
            System.out.println("API 호출 실패: 액세스 토큰 생성 (" + (endTime - startTime) + "ms)");
            throw e;
        }
    }

    // 리프레시 토큰 생성 및 Redis 저장
    public String generateRefreshToken(String userId) {
        // API 호출 시작 로그
        long startTime = System.currentTimeMillis();
        System.out.println("API 호출 시작: 리프레시 토큰 생성");

        try {
            Date expirationDate = new Date(System.currentTimeMillis() + (refreshTokenExpiration * 1000));

            String token = Jwts.builder()
                    .subject(userId)
                    .claim("type", "refresh")
                    .issuedAt(new Date())
                    .expiration(expirationDate)
                    .signWith(secretKey)
                    .compact();

            // Redis에 리프레시 토큰 저장
            String redisKey = "RT:" + userId;
            redisTemplate.opsForValue().set(redisKey, token, refreshTokenExpiration, TimeUnit.SECONDS);

            // API 호출 완료 로그
            long endTime = System.currentTimeMillis();
            System.out.println("API 호출 완료: 리프레시 토큰 생성 (" + (endTime - startTime) + "ms)");

            return token;
        } catch (Exception e) {
            // API 호출 실패 로그
            long endTime = System.currentTimeMillis();
            System.out.println("API 호출 실패: 리프레시 토큰 생성 (" + (endTime - startTime) + "ms)");
            throw e;
        }
    }

    // 토큰 유효성 검증
    public boolean validateToken(String token) {
        // API 호출 시작 로그
        long startTime = System.currentTimeMillis();
        System.out.println("API 호출 시작: 토큰 유효성 검증");

        try {
            Jwts.parser()
                    .verifyWith(secretKey)
                    .build()
                    .parseSignedClaims(token);

            // API 호출 완료 로그
            long endTime = System.currentTimeMillis();
            System.out.println("API 호출 완료: 토큰 유효성 검증 (" + (endTime - startTime) + "ms)");

            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // API 호출 실패 로그
            long endTime = System.currentTimeMillis();
            System.out.println("API 호출 실패: 토큰 유효성 검증 (" + (endTime - startTime) + "ms)");
            return false;
        }
    }

    // 토큰에서 사용자 ID 추출
    public String getUserIdFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        return claims.getSubject();
    }

    // 리프레시 토큰으로 새 액세스 토큰 생성
    public String refreshAccessToken(String refreshToken, String email, String name) {
        // API 호출 시작 로그
        long startTime = System.currentTimeMillis();
        System.out.println("API 호출 시작: 액세스 토큰 갱신");

        try {
            if (!validateToken(refreshToken)) {
                throw new IllegalArgumentException("유효하지 않은 리프레시 토큰입니다");
            }

            String userId = getUserIdFromToken(refreshToken);
            String redisKey = "RT:" + userId;
            String storedToken = redisTemplate.opsForValue().get(redisKey);

            if (storedToken == null || !storedToken.equals(refreshToken)) {
                throw new IllegalArgumentException("리프레시 토큰이 존재하지 않거나 일치하지 않습니다");
            }

            String newAccessToken = generateAccessToken(userId, email, name);

            // API 호출 완료 로그
            long endTime = System.currentTimeMillis();
            System.out.println("API 호출 완료: 액세스 토큰 갱신 (" + (endTime - startTime) + "ms)");

            return newAccessToken;
        } catch (Exception e) {
            // API 호출 실패 로그
            long endTime = System.currentTimeMillis();
            System.out.println("API 호출 실패: 액세스 토큰 갱신 (" + (endTime - startTime) + "ms)");
            throw e;
        }
    }

    // 리프레시 토큰 삭제 (로그아웃)
    public void deleteRefreshToken(String userId) {
        // API 호출 시작 로그
        long startTime = System.currentTimeMillis();
        System.out.println("API 호출 시작: 리프레시 토큰 삭제");

        try {
            String redisKey = "RT:" + userId;
            redisTemplate.delete(redisKey);

            // API 호출 완료 로그
            long endTime = System.currentTimeMillis();
            System.out.println("API 호출 완료: 리프레시 토큰 삭제 (" + (endTime - startTime) + "ms)");
        } catch (Exception e) {
            // API 호출 실패 로그
            long endTime = System.currentTimeMillis();
            System.out.println("API 호출 실패: 리프레시 토큰 삭제 (" + (endTime - startTime) + "ms)");
            throw e;
        }
    }
}