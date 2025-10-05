package com.ddp.auth.service;

import com.ddp.auth.dto.JwtUserInfo;
import com.ddp.auth.dto.TokenResponse;
import com.ddp.auth.dto.UserLoginRequest;
import com.ddp.auth.entity.User;
import com.ddp.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.Optional;

// 인증 서비스
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final TokenService tokenService;
    private final BlacklistService blacklistService;

    // 로그인 처리
    public TokenResponse login(UserLoginRequest request) {
        log.info("API 호출 시작: 사용자 로그인 - 이메일: {}", request.getEmail());

        long startTime = System.currentTimeMillis();

        try {
            // 사용자 조회
            Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
            if (userOpt.isEmpty()) {
                log.warn("존재하지 않는 사용자: {}", request.getEmail());
                return TokenResponse.failure("이메일 또는 비밀번호가 올바르지 않습니다.");
            }

            User user = userOpt.get();

            // 비밀번호 검증
            if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                log.warn("비밀번호 불일치: {}", request.getEmail());
                return TokenResponse.failure("이메일 또는 비밀번호가 올바르지 않습니다.");
            }

            // JWT 액세스 토큰 생성
            String accessToken = jwtService.generateToken(user);
            
            // 리프레시 토큰 생성
            String refreshToken = tokenService.generateRefreshToken(user.getUserId());

            log.info("API 호출 완료: 사용자 로그인 - 사용자 ID: {}, 액세스+리프레시 토큰 발급 완료 ({}ms)",
                    user.getUserId(), System.currentTimeMillis() - startTime);

            return TokenResponse.success(accessToken, refreshToken, user.getUserId(), user.getEmail(),
                    user.getName(), user.getRole().name());

        } catch (Exception e) {
            log.error("로그인 처리 중 오류 발생: {}", e.getMessage(), e);
            return TokenResponse.failure("로그인 처리 중 오류가 발생했습니다.");
        }
    }

    // 토큰 검증
    public TokenResponse validateToken(String token) {
        log.info("API 호출 시작: 토큰 검증");

        long startTime = System.currentTimeMillis();

        try {
            // 토큰 유효성 검증
            if (!jwtService.validateToken(token)) {
                log.warn("유효하지 않은 토큰");
                return TokenResponse.failure("유효하지 않은 토큰입니다.");
            }

            // 토큰에서 사용자 정보 추출 (최적화: 1회 파싱으로 모든 정보 추출)
            JwtUserInfo userInfo = jwtService.extractUserInfo(token);

            log.info("API 호출 완료: 토큰 검증 - 사용자 ID: {} ({}ms)",
                    userInfo.getUserId(), System.currentTimeMillis() - startTime);

            return TokenResponse.successValidation(token, userInfo.getUserId(), userInfo.getEmail(),
                    userInfo.getName(), userInfo.getRole());

        } catch (Exception e) {
            log.error("토큰 검증 중 오류 발생: {}", e.getMessage(), e);
            return TokenResponse.failure("토큰 검증 중 오류가 발생했습니다.");
        }
    }
    
    // 로그아웃 처리
    public TokenResponse logout(String token) {
        log.info("API 호출 시작: 사용자 로그아웃");

        long startTime = System.currentTimeMillis();

        try {
            // 토큰 유효성 검증
            if (!jwtService.validateToken(token)) {
                log.warn("유효하지 않은 토큰으로 로그아웃 시도");
                return TokenResponse.failure("유효하지 않은 토큰입니다.");
            }

            // 토큰에서 정보 추출 (최적화: 1회 파싱으로 모든 정보 추출)
            JwtUserInfo userInfo = jwtService.extractUserInfo(token);

            // 액세스 토큰을 블랙리스트에 추가
            blacklistService.addAccessTokenToBlacklist(userInfo.getJti(), userInfo.getExpiration());

            // 사용자의 모든 리프레시 토큰 무효화
            tokenService.revokeAllRefreshTokens(userInfo.getUserId());

            log.info("API 호출 완료: 사용자 로그아웃 - 사용자 ID: {} ({}ms)",
                    userInfo.getUserId(), System.currentTimeMillis() - startTime);

            return TokenResponse.success(null, null, null, null, "로그아웃이 완료되었습니다.", null);

        } catch (Exception e) {
            log.error("로그아웃 처리 중 오류 발생: {}", e.getMessage(), e);
            return TokenResponse.failure("로그아웃 처리 중 오류가 발생했습니다.");
        }
    }
    
    // 토큰 갱신 처리
    public TokenResponse refreshToken(String refreshToken) {
        log.info("API 호출 시작: 토큰 갱신");
        
        long startTime = System.currentTimeMillis();
        
        try {
            // 리프레시 토큰 검증 및 사용자 ID 추출
            Long userId = tokenService.validateRefreshToken(refreshToken);
            if (userId == null) {
                log.warn("유효하지 않은 리프레시 토큰");
                return TokenResponse.failure("유효하지 않은 리프레시 토큰입니다.");
            }
            
            // 사용자 조회
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                log.warn("토큰의 사용자가 존재하지 않음: {}", userId);
                return TokenResponse.failure("사용자를 찾을 수 없습니다.");
            }
            
            User user = userOpt.get();
            
            // 새로운 액세스 토큰 생성
            String newAccessToken = jwtService.generateToken(user);
            
            // 새로운 리프레시 토큰 생성
            String newRefreshToken = tokenService.generateRefreshToken(user.getUserId());
            
            // 기존 리프레시 토큰 무효화
            tokenService.revokeRefreshToken(refreshToken);
            
            log.info("API 호출 완료: 토큰 갱신 - 사용자 ID: {} ({}ms)",
                    userId, System.currentTimeMillis() - startTime);
            
            return TokenResponse.successRefresh(newAccessToken, newRefreshToken, 
                    user.getUserId(), user.getEmail(), user.getName(), user.getRole().name());
            
        } catch (Exception e) {
            log.error("토큰 갱신 중 오류 발생: {}", e.getMessage(), e);
            return TokenResponse.failure("토큰 갱신 중 오류가 발생했습니다.");
        }
    }
    
    // 전체 로그아웃 처리 (모든 기기에서 로그아웃)
    public TokenResponse logoutAll(String token) {
        log.info("API 호출 시작: 전체 로그아웃");

        long startTime = System.currentTimeMillis();

        try {
            // 토큰 유효성 검증
            if (!jwtService.validateToken(token)) {
                log.warn("유효하지 않은 토큰으로 전체 로그아웃 시도");
                return TokenResponse.failure("유효하지 않은 토큰입니다.");
            }

            // 토큰에서 정보 추출 (최적화: 1회 파싱으로 모든 정보 추출)
            JwtUserInfo userInfo = jwtService.extractUserInfo(token);

            // 현재 액세스 토큰을 블랙리스트에 추가
            blacklistService.addAccessTokenToBlacklist(userInfo.getJti(), userInfo.getExpiration());

            // 사용자의 모든 토큰 무효화 (현재 시간 이전에 발급된 모든 토큰)
            blacklistService.blacklistAllUserTokens(userInfo.getUserId(), userInfo.getExpiration());

            // 사용자의 모든 리프레시 토큰 무효화
            tokenService.revokeAllRefreshTokens(userInfo.getUserId());

            log.info("API 호출 완료: 전체 로그아웃 - 사용자 ID: {} ({}ms)",
                    userInfo.getUserId(), System.currentTimeMillis() - startTime);

            return TokenResponse.success(null, null, null, null, "모든 기기에서 로그아웃이 완료되었습니다.", null);

        } catch (Exception e) {
            log.error("전체 로그아웃 처리 중 오류 발생: {}", e.getMessage(), e);
            return TokenResponse.failure("전체 로그아웃 처리 중 오류가 발생했습니다.");
        }
    }
}