package com.ddp.auth.service;

import com.ddp.auth.constants.RedisKeyConstants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;

// 서버 시작 시 토큰 정리 서비스
@Service
@RequiredArgsConstructor
@Slf4j
public class TokenCleanupService {

    private final RedisTemplate<String, String> redisTemplate;

    // 서버 시작 시 기존 토큰들 정리
    @EventListener(ApplicationReadyEvent.class)
    public void cleanupTokensOnStartup() {
        log.info("서버 시작: 기존 토큰 정리 작업 시작");
        
        long startTime = System.currentTimeMillis();
        int totalCleaned = 0;
        
        try {
            // 1. 모든 리프레시 토큰 정리
            int refreshTokensCleaned = cleanupRefreshTokens();
            totalCleaned += refreshTokensCleaned;
            
            // 2. 사용자별 토큰 목록 정리
            int userTokensCleaned = cleanupUserTokens();
            totalCleaned += userTokensCleaned;
            
            // 3. 액세스 토큰 블랙리스트 정리
            int accessBlacklistCleaned = cleanupAccessBlacklist();
            totalCleaned += accessBlacklistCleaned;

            // 4. 사용자 블랙리스트 정리
            int userBlacklistCleaned = cleanupUserBlacklist();
            totalCleaned += userBlacklistCleaned;
            
            log.info("서버 시작: 토큰 정리 완료 - 총 {}개 항목 정리 ({}ms)", 
                    totalCleaned, System.currentTimeMillis() - startTime);
                    
        } catch (Exception e) {
            log.error("서버 시작: 토큰 정리 중 오류 발생: {}", e.getMessage(), e);
        }
    }
    
    // 리프레시 토큰 정리
    private int cleanupRefreshTokens() {
        try {
            Set<String> keys = redisTemplate.keys(RedisKeyConstants.REFRESH_TOKEN_KEY_PREFIX + "*");
            if (keys != null && !keys.isEmpty()) {
                redisTemplate.delete(keys);
                log.info("리프레시 토큰 정리: {}개", keys.size());
                return keys.size();
            }
            return 0;
        } catch (Exception e) {
            log.error("리프레시 토큰 정리 중 오류: {}", e.getMessage());
            return 0;
        }
    }
    
    // 사용자별 토큰 목록 정리
    private int cleanupUserTokens() {
        try {
            Set<String> keys = redisTemplate.keys(RedisKeyConstants.USER_TOKENS_KEY_PREFIX + "*");
            if (keys != null && !keys.isEmpty()) {
                redisTemplate.delete(keys);
                log.info("사용자 토큰 목록 정리: {}개", keys.size());
                return keys.size();
            }
            return 0;
        } catch (Exception e) {
            log.error("사용자 토큰 목록 정리 중 오류: {}", e.getMessage());
            return 0;
        }
    }
    
    // 액세스 토큰 블랙리스트 정리
    private int cleanupAccessBlacklist() {
        try {
            Set<String> keys = redisTemplate.keys(RedisKeyConstants.ACCESS_BLACKLIST_KEY_PREFIX + "*");
            if (keys != null && !keys.isEmpty()) {
                redisTemplate.delete(keys);
                log.info("액세스 토큰 블랙리스트 정리: {}개", keys.size());
                return keys.size();
            }
            return 0;
        } catch (Exception e) {
            log.error("액세스 토큰 블랙리스트 정리 중 오류: {}", e.getMessage());
            return 0;
        }
    }
    
    // 사용자 블랙리스트 정리
    private int cleanupUserBlacklist() {
        try {
            Set<String> keys = redisTemplate.keys(RedisKeyConstants.USER_BLACKLIST_KEY_PREFIX + "*");
            if (keys != null && !keys.isEmpty()) {
                redisTemplate.delete(keys);
                log.info("사용자 블랙리스트 정리: {}개", keys.size());
                return keys.size();
            }
            return 0;
        } catch (Exception e) {
            log.error("사용자 블랙리스트 정리 중 오류: {}", e.getMessage());
            return 0;
        }
    }
    
    // 수동 토큰 정리 (필요 시 호출)
    public void manualCleanup() {
        log.info("수동 토큰 정리 요청됨");
        cleanupTokensOnStartup();
    }
}