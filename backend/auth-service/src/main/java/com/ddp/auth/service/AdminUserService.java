package com.ddp.auth.service;

import com.ddp.auth.dto.AdminUserCreateRequest;
import com.ddp.auth.dto.AdminUserCreateResponse;
import com.ddp.auth.dto.TcsLicenseVerifyResponse;
import com.ddp.auth.entity.User;
import com.ddp.auth.entity.UserRole;
import com.ddp.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

// 관리자용 사용자 관리 서비스
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AdminUserService {

    private final UserRepository userRepository;
    private final TcsIntegrationService tcsIntegrationService;
    private final PasswordEncoder passwordEncoder;

    // 관리자용 사용자 생성 (TCS 연동)
    public AdminUserCreateResponse createUserFromTcs(AdminUserCreateRequest request) {
        log.info("API 호출 시작: 관리자용 사용자 생성 - 면허번호: {}", request.getLicenseNumber());
        
        long startTime = System.currentTimeMillis();
        
        try {
            // 1. TCS API를 통한 면허 정보 조회
            TcsLicenseVerifyResponse tcsResponse = tcsIntegrationService.verifyLicense(
                    request.getLicenseNumber(), request.getBirthDate());
            
            if (!tcsResponse.isSuccess()) {
                log.warn("TCS 면허 조회 실패: {}", tcsResponse.getErrorMessage());
                return AdminUserCreateResponse.failure("면허 정보 조회 실패: " + tcsResponse.getErrorMessage());
            }
            
            // 2. 음주운전 위반자인지 확인
            if (!tcsResponse.isDuiViolator()) {
                log.warn("음주운전 위반자가 아님: {}", request.getLicenseNumber());
                return AdminUserCreateResponse.failure("음주운전 위반자만 계정을 생성할 수 있습니다.");
            }
            
            // 3. 이메일 생성 (면허번호 기반)
            String email = generateEmailFromLicense(request.getLicenseNumber());
            
            // 4. 이미 등록된 사용자인지 확인
            Optional<User> existingUser = userRepository.findByEmail(email);
            if (existingUser.isPresent()) {
                log.warn("이미 등록된 사용자: {}", email);
                return AdminUserCreateResponse.failure("이미 등록된 사용자입니다.");
            }
            
            // 5. 임시 비밀번호 생성
            String tempPassword = request.getTempPassword() != null ? 
                    request.getTempPassword() : generateTempPassword();
            
            // 6. 사용자 엔티티 생성
            User user = User.builder()
                    .email(email)
                    .passwordHash(passwordEncoder.encode(tempPassword))
                    .name(tcsResponse.getName())
                    .phone(null)
                    .address(tcsResponse.getAddress())
                    .role(UserRole.USER)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
            
            // 7. 사용자 저장
            User savedUser = userRepository.save(user);
            
            log.info("API 호출 완료: 관리자용 사용자 생성 - 사용자 ID: {} ({}ms)", 
                    savedUser.getUserId(), System.currentTimeMillis() - startTime);
            
            return AdminUserCreateResponse.success(
                    savedUser.getUserId(),
                    savedUser.getEmail(),
                    savedUser.getName(),
                    tempPassword,
                    savedUser.getCreatedAt()
            );
            
        } catch (Exception e) {
            log.error("사용자 생성 중 오류 발생: {}", e.getMessage(), e);
            return AdminUserCreateResponse.failure("사용자 생성 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 면허번호를 기반으로 이메일 생성
    private String generateEmailFromLicense(String licenseNumber) {
        // 면허번호에서 하이픈 제거하고 @ddp-system.kr 도메인 추가
        String cleanLicense = licenseNumber.replace("-", "");
        return cleanLicense + "@ddp-system.kr";
    }

    // 임시 비밀번호 생성
    private String generateTempPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder();
        
        // 8자리 임시 비밀번호 생성
        for (int i = 0; i < 8; i++) {
            password.append(chars.charAt(random.nextInt(chars.length())));
        }
        
        return password.toString();
    }
}