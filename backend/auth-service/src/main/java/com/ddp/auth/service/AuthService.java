package com.ddp.auth.service;

import com.ddp.auth.dto.TokenResponse;
import com.ddp.auth.dto.UserLoginRequest;
import com.ddp.auth.entity.User;
import com.ddp.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

            // JWT 토큰 생성
            String token = jwtService.generateToken(user);

            log.info("API 호출 완료: 사용자 로그인 - 사용자 ID: {} ({}ms)",
                    user.getUserId(), System.currentTimeMillis() - startTime);

            return TokenResponse.success(token, user.getUserId(), user.getEmail(),
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

            // 토큰에서 사용자 정보 추출
            String userEmail = jwtService.getUserEmailFromToken(token);
            Long userId = jwtService.getUserIdFromToken(token);
            String role = jwtService.getUserRoleFromToken(token);

            // 사용자 존재 확인
            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            if (userOpt.isEmpty()) {
                log.warn("토큰의 사용자가 존재하지 않음: {}", userEmail);
                return TokenResponse.failure("사용자를 찾을 수 없습니다.");
            }

            User user = userOpt.get();

            log.info("API 호출 완료: 토큰 검증 - 사용자 ID: {} ({}ms)",
                    userId, System.currentTimeMillis() - startTime);

            return TokenResponse.success(token, user.getUserId(), user.getEmail(),
                    user.getName(), user.getRole().name());

        } catch (Exception e) {
            log.error("토큰 검증 중 오류 발생: {}", e.getMessage(), e);
            return TokenResponse.failure("토큰 검증 중 오류가 발생했습니다.");
        }
    }
}