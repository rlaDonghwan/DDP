package com.ddp.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Date;

// JWT 토큰 블랙리스트 관리 서비스
@Service
@RequiredArgsConstructor
@Slf4j
public class BlacklistService {

    private final RedisTemplate<String, String> redisTemplate;
    
    // Redis 키 패턴
    private static final String ACCESS_BLACKLIST_KEY_PREFIX = "blacklist:access:";
    private static final String REFRESH_BLACKLIST_KEY_PREFIX = "blacklist:refresh:";
    
    // 액세스 토큰을 블랙리스트에 추가
    public void addAccessTokenToBlacklist(String jti, Date expiration) {
        log.info("API 호출 시작: 액세스 토큰 블랙리스트 추가 - JTI: {}", jti);
        
        long startTime = System.currentTimeMillis();
        
        try {
            String key = ACCESS_BLACKLIST_KEY_PREFIX + jti;
            
            // 토큰 만료 시간까지만 블랙리스트에 보관
            long ttl = expiration.getTime() - System.currentTimeMillis();
            if (ttl > 0) {
                redisTemplate.opsForValue().set(key, "blacklisted", Duration.ofMillis(ttl));
                
                log.info("API 호출 완료: 액세스 토큰 블랙리스트 추가 - JTI: {}, TTL: {}ms ({}ms)", 
                        jti, ttl, System.currentTimeMillis() - startTime);
            } else {
                log.warn("이미 만료된 토큰은 블랙리스트에 추가하지 않음 - JTI: {}", jti);
            }
            
        } catch (Exception e) {
            log.error("액세스 토큰 블랙리스트 추가 중 오류 발생: {}", e.getMessage(), e);
        }
    }
    
    // 리프레시 토큰을 블랙리스트에 추가
    public void addRefreshTokenToBlacklist(String refreshToken) {
        log.info("API 호출 시작: 리프레시 토큰 블랙리스트 추가");
        
        long startTime = System.currentTimeMillis();
        
        try {
            if (!refreshToken.startsWith("refresh_")) {
                log.warn("잘못된 리프레시 토큰 형식: {}", refreshToken);
                return;
            }
            
            String tokenId = refreshToken.substring(8); // "refresh_" 제거
            String key = REFRESH_BLACKLIST_KEY_PREFIX + tokenId;
            
            // 리프레시 토큰은 7일간 블랙리스트에 보관
            redisTemplate.opsForValue().set(key, "blacklisted", Duration.ofDays(7));
            
            log.info("API 호출 완료: 리프레시 토큰 블랙리스트 추가 - 토큰 ID: {} ({}ms)", 
                    tokenId, System.currentTimeMillis() - startTime);
            
        } catch (Exception e) {
            log.error("리프레시 토큰 블랙리스트 추가 중 오류 발생: {}", e.getMessage(), e);
        }
    }
    
    // 액세스 토큰이 블랙리스트에 있는지 확인
    public boolean isAccessTokenBlacklisted(String jti) {
        try {
            String key = ACCESS_BLACKLIST_KEY_PREFIX + jti;
            return Boolean.TRUE.equals(redisTemplate.hasKey(key));
        } catch (Exception e) {
            log.error("액세스 토큰 블랙리스트 확인 중 오류 발생: {}", e.getMessage(), e);
            // 오류 발생 시 안전하게 블랙리스트로 처리
            return true;
        }
    }
    
    // 리프레시 토큰이 블랙리스트에 있는지 확인
    public boolean isRefreshTokenBlacklisted(String refreshToken) {
        try {
            if (!refreshToken.startsWith("refresh_")) {
                return true; // 잘못된 형식은 블랙리스트로 처리
            }
            
            String tokenId = refreshToken.substring(8);
            String key = REFRESH_BLACKLIST_KEY_PREFIX + tokenId;
            return Boolean.TRUE.equals(redisTemplate.hasKey(key));
        } catch (Exception e) {
            log.error("리프레시 토큰 블랙리스트 확인 중 오류 발생: {}", e.getMessage(), e);
            // 오류 발생 시 안전하게 블랙리스트로 처리
            return true;
        }
    }
    
    // 사용자의 모든 토큰을 블랙리스트에 추가 (전체 로그아웃 시 사용)
    public void blacklistAllUserTokens(Long userId, Date currentTokenExpiration) {
        log.info("API 호출 시작: 사용자 모든 토큰 블랙리스트 추가 - 사용자 ID: {}", userId);
        
        long startTime = System.currentTimeMillis();
        
        try {
            // 사용자별 블랙리스트 키 (현재 시간 이전에 발급된 모든 토큰 무효화)
            String userBlacklistKey = "blacklist:user:" + userId;
            long currentTime = System.currentTimeMillis();
            
            // 토큰 만료 시간까지만 블랙리스트에 보관
            long ttl = currentTokenExpiration.getTime() - currentTime;
            if (ttl > 0) {
                redisTemplate.opsForValue().set(userBlacklistKey, String.valueOf(currentTime), Duration.ofMillis(ttl));
                
                log.info("API 호출 완료: 사용자 모든 토큰 블랙리스트 추가 - 사용자 ID: {}, 기준 시간: {} ({}ms)", 
                        userId, currentTime, System.currentTimeMillis() - startTime);
            }
            
        } catch (Exception e) {
            log.error("사용자 모든 토큰 블랙리스트 추가 중 오류 발생: {}", e.getMessage(), e);
        }
    }
    
    // 특정 시간 이전에 발급된 사용자 토큰이 블랙리스트에 있는지 확인
    public boolean isUserTokenBlacklistedBefore(Long userId, Date tokenIssuedAt) {
        try {
            String userBlacklistKey = "blacklist:user:" + userId;
            String blacklistTimeStr = redisTemplate.opsForValue().get(userBlacklistKey);
            
            if (blacklistTimeStr != null) {
                long blacklistTime = Long.parseLong(blacklistTimeStr);
                return tokenIssuedAt.getTime() <= blacklistTime;
            }
            
            return false;
        } catch (Exception e) {
            log.error("사용자 토큰 블랙리스트 시간 확인 중 오류 발생: {}", e.getMessage(), e);
            // 오류 발생 시 안전하게 블랙리스트로 처리하지 않음 (정상 토큰일 가능성)
            return false;
        }
    }
    
    // 블랙리스트 통계 조회 (모니터링용)
    public long getBlacklistCount() {
        try {
            long accessCount = redisTemplate.keys(ACCESS_BLACKLIST_KEY_PREFIX + "*").size();
            long refreshCount = redisTemplate.keys(REFRESH_BLACKLIST_KEY_PREFIX + "*").size();
            return accessCount + refreshCount;
        } catch (Exception e) {
            log.error("블랙리스트 통계 조회 중 오류 발생: {}", e.getMessage(), e);
            return 0;
        }
    }
}