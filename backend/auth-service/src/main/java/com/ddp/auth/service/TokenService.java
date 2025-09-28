package com.ddp.auth.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Set;
import java.util.UUID;

// 리프레시 토큰 관리 서비스
@Service
@RequiredArgsConstructor
@Slf4j
public class TokenService {

    private final RedisTemplate<String, String> redisTemplate;
    
    // Redis 키 패턴
    private static final String REFRESH_TOKEN_KEY_PREFIX = "refresh_token:";
    private static final String USER_TOKENS_KEY_PREFIX = "user_tokens:";
    
    // 리프레시 토큰 생성 및 저장
    public String generateRefreshToken(Long userId) {
        log.info("API 호출 시작: 리프레시 토큰 생성 - 사용자 ID: {}", userId);
        
        long startTime = System.currentTimeMillis();
        
        try {
            // 고유한 토큰 ID 생성
            String tokenId = UUID.randomUUID().toString();
            String refreshToken = "refresh_" + tokenId;
            
            // Redis에 리프레시 토큰 저장 (7일 만료)
            String tokenKey = REFRESH_TOKEN_KEY_PREFIX + tokenId;
            redisTemplate.opsForValue().set(tokenKey, userId.toString(), Duration.ofDays(7));
            
            // 사용자별 토큰 목록에 추가 (사용자의 모든 토큰 관리용)
            String userTokensKey = USER_TOKENS_KEY_PREFIX + userId;
            redisTemplate.opsForSet().add(userTokensKey, tokenId);
            redisTemplate.expire(userTokensKey, Duration.ofDays(7));
            
            log.info("API 호출 완료: 리프레시 토큰 생성 - 사용자 ID: {}, 리프레시 토큰 ID: {}, Redis 키: {} ({}ms)", 
                    userId, tokenId, tokenKey, System.currentTimeMillis() - startTime);
            
            return refreshToken;
            
        } catch (Exception e) {
            log.error("리프레시 토큰 생성 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("리프레시 토큰 생성에 실패했습니다.", e);
        }
    }
    
    // 리프레시 토큰 검증
    public Long validateRefreshToken(String refreshToken) {
        log.info("API 호출 시작: 리프레시 토큰 검증");
        
        long startTime = System.currentTimeMillis();
        
        try {
            // 토큰 형식 검증
            if (!refreshToken.startsWith("refresh_")) {
                log.warn("잘못된 리프레시 토큰 형식: {}", refreshToken);
                return null;
            }
            
            // 토큰 ID 추출
            String tokenId = refreshToken.substring(8); // "refresh_" 제거
            String tokenKey = REFRESH_TOKEN_KEY_PREFIX + tokenId;
            
            // Redis에서 토큰 조회
            String userIdStr = redisTemplate.opsForValue().get(tokenKey);
            if (userIdStr == null) {
                log.warn("존재하지 않거나 만료된 리프레시 토큰: {}", tokenId);
                return null;
            }
            
            Long userId = Long.parseLong(userIdStr);
            
            log.info("API 호출 완료: 리프레시 토큰 검증 - 사용자 ID: {} ({}ms)", 
                    userId, System.currentTimeMillis() - startTime);
            
            return userId;
            
        } catch (Exception e) {
            log.error("리프레시 토큰 검증 중 오류 발생: {}", e.getMessage(), e);
            return null;
        }
    }
    
    // 리프레시 토큰 삭제 (단일 토큰)
    public void revokeRefreshToken(String refreshToken) {
        log.info("API 호출 시작: 리프레시 토큰 삭제");
        
        long startTime = System.currentTimeMillis();
        
        try {
            if (!refreshToken.startsWith("refresh_")) {
                log.warn("잘못된 리프레시 토큰 형식: {}", refreshToken);
                return;
            }
            
            String tokenId = refreshToken.substring(8);
            String tokenKey = REFRESH_TOKEN_KEY_PREFIX + tokenId;
            
            // 사용자 ID 조회
            String userIdStr = redisTemplate.opsForValue().get(tokenKey);
            if (userIdStr != null) {
                Long userId = Long.parseLong(userIdStr);
                
                // 사용자 토큰 목록에서 제거
                String userTokensKey = USER_TOKENS_KEY_PREFIX + userId;
                redisTemplate.opsForSet().remove(userTokensKey, tokenId);
            }
            
            // 토큰 삭제
            redisTemplate.delete(tokenKey);
            
            log.info("API 호출 완료: 리프레시 토큰 삭제 ({}ms)", 
                    System.currentTimeMillis() - startTime);
            
        } catch (Exception e) {
            log.error("리프레시 토큰 삭제 중 오류 발생: {}", e.getMessage(), e);
        }
    }
    
    // 사용자의 모든 리프레시 토큰 삭제 (전체 로그아웃)
    public void revokeAllRefreshTokens(Long userId) {
        log.info("API 호출 시작: 사용자 모든 리프레시 토큰 삭제 - 사용자 ID: {}", userId);
        
        long startTime = System.currentTimeMillis();
        
        try {
            String userTokensKey = USER_TOKENS_KEY_PREFIX + userId;
            
            // 사용자의 모든 토큰 ID 조회
            Set<String> tokenIds = redisTemplate.opsForSet().members(userTokensKey);
            
            if (tokenIds != null && !tokenIds.isEmpty()) {
                // 각 토큰 삭제
                for (String tokenId : tokenIds) {
                    String tokenKey = REFRESH_TOKEN_KEY_PREFIX + tokenId;
                    redisTemplate.delete(tokenKey);
                }
                
                // 사용자 토큰 목록 삭제
                redisTemplate.delete(userTokensKey);
                
                log.info("API 호출 완료: 사용자 모든 리프레시 토큰 삭제 - 사용자 ID: {}, 삭제된 토큰 수: {} ({}ms)", 
                        userId, tokenIds.size(), System.currentTimeMillis() - startTime);
            } else {
                log.info("API 호출 완료: 삭제할 리프레시 토큰이 없음 - 사용자 ID: {} ({}ms)", 
                        userId, System.currentTimeMillis() - startTime);
            }
            
        } catch (Exception e) {
            log.error("사용자 모든 리프레시 토큰 삭제 중 오류 발생: {}", e.getMessage(), e);
        }
    }
    
    // 사용자의 활성 토큰 개수 조회
    public long getActiveTokenCount(Long userId) {
        try {
            String userTokensKey = USER_TOKENS_KEY_PREFIX + userId;
            Long count = redisTemplate.opsForSet().size(userTokensKey);
            return count != null ? count : 0;
        } catch (Exception e) {
            log.error("활성 토큰 개수 조회 중 오류 발생: {}", e.getMessage(), e);
            return 0;
        }
    }
}