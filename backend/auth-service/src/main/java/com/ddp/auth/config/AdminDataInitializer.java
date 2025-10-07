package com.ddp.auth.config;

import com.ddp.auth.entity.AccountStatus;
import com.ddp.auth.entity.User;
import com.ddp.auth.entity.UserRole;
import com.ddp.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

// 기본 관리자 계정 자동 생성
@Component
@RequiredArgsConstructor
@Slf4j
public class AdminDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        createDefaultAdminIfNotExists();
    }

    private void createDefaultAdminIfNotExists() {
        String adminEmail = "admin@naver.com";
        
        // 이미 관리자 계정이 있는지 확인
        if (userRepository.existsByEmail(adminEmail)) {
            log.info("기본 관리자 계정이 이미 존재합니다: {}", adminEmail);
            return;
        }

        // 기본 관리자 계정 생성
        User adminUser = User.builder()
                .email(adminEmail)
                .passwordHash(passwordEncoder.encode("admin123"))
                .name("시스템관리자")
                .phone("010-0000-0000")
                .address("서울특별시 중구 세종대로 110")
                .role(UserRole.ADMIN)
                .accountStatus(AccountStatus.ACTIVE)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        userRepository.save(adminUser);
        
        log.info("기본 관리자 계정이 생성되었습니다:");
        log.info("- 이메일: {}", adminEmail);
        log.info("- 비밀번호: admin123");
        log.info("- 이름: {}", adminUser.getName());
        log.info("- 역할: {}", adminUser.getRole());
    }
}