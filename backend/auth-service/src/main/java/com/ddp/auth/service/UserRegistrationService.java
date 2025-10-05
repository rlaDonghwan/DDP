package com.ddp.auth.service;

import com.ddp.auth.dto.CompleteRegistrationResponse;
import com.ddp.auth.dto.SmsVerificationResponse;
import com.ddp.auth.entity.AccountStatus;
import com.ddp.auth.entity.User;
import com.ddp.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

// 사용자 회원가입 서비스
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserRegistrationService {

    private final UserRepository userRepository;
    private final SmsService smsService;
    private final PasswordEncoder passwordEncoder;

    // Step 1: SMS 인증번호 발송
    public SmsVerificationResponse sendVerificationCode(String phone) {
        log.info("API 호출 시작: SMS 인증번호 발송 - 전화번호: {}", maskPhone(phone));

        long startTime = System.currentTimeMillis();

        try {
            // 1. PENDING 상태의 계정이 존재하는지 확인
            Optional<User> pendingUser = userRepository.findByPhone(phone);

            if (pendingUser.isEmpty()) {
                log.warn("전화번호에 해당하는 미완성 계정이 없음 - 전화번호: {}", maskPhone(phone));
                return SmsVerificationResponse.failure("등록된 전화번호가 아닙니다. 관리자에게 문의하세요.");
            }

            User user = pendingUser.get();

            // 2. 이미 ACTIVE 상태인 계정인지 확인
            if (user.getAccountStatus() == AccountStatus.ACTIVE) {
                log.warn("이미 활성화된 계정 - 전화번호: {}", maskPhone(phone));
                return SmsVerificationResponse.failure("이미 회원가입이 완료된 계정입니다. 로그인해주세요.");
            }

            // 3. PENDING 상태가 아닌 경우
            if (user.getAccountStatus() != AccountStatus.PENDING) {
                log.warn("정상적이지 않은 계정 상태 - 전화번호: {}, 상태: {}", maskPhone(phone), user.getAccountStatus());
                return SmsVerificationResponse.failure("계정 상태가 정상적이지 않습니다. 관리자에게 문의하세요.");
            }

            // 4. SMS 인증번호 발송
            String code = smsService.sendVerificationCode(phone);

            log.info("API 호출 완료: SMS 인증번호 발송 - 전화번호: {} ({}ms)",
                    maskPhone(phone), System.currentTimeMillis() - startTime);

            return SmsVerificationResponse.sendSuccess(180); // 3분

        } catch (Exception e) {
            log.error("SMS 인증번호 발송 중 오류 발생: {}", e.getMessage(), e);
            return SmsVerificationResponse.failure("SMS 발송 중 오류가 발생했습니다.");
        }
    }

    // Step 2: SMS 인증번호 확인
    public SmsVerificationResponse verifyCode(String phone, String code) {
        log.info("API 호출 시작: SMS 인증번호 확인 - 전화번호: {}", maskPhone(phone));

        long startTime = System.currentTimeMillis();

        try {
            // 1. 인증번호 확인
            boolean isValid = smsService.verifyCode(phone, code);

            if (!isValid) {
                log.warn("SMS 인증 실패 - 전화번호: {}", maskPhone(phone));
                return SmsVerificationResponse.failure("인증번호가 일치하지 않거나 만료되었습니다.");
            }

            // 2. 사용자 정보 조회
            Optional<User> userOpt = userRepository.findByPhone(phone);

            if (userOpt.isEmpty()) {
                log.error("인증 성공 후 사용자 조회 실패 - 전화번호: {}", maskPhone(phone));
                return SmsVerificationResponse.failure("사용자 정보를 찾을 수 없습니다.");
            }

            User user = userOpt.get();

            // 3. 인증 토큰 생성
            String verificationToken = smsService.generateVerificationToken(phone);

            log.info("API 호출 완료: SMS 인증 성공 - 전화번호: {}, 사용자: {} ({}ms)",
                    maskPhone(phone), user.getName(), System.currentTimeMillis() - startTime);

            // 4. 마스킹된 운전면허 번호 반환
            String maskedLicense = maskLicenseNumber(user.getLicenseNumber());

            return SmsVerificationResponse.verifySuccess(verificationToken, user.getName(), maskedLicense);

        } catch (Exception e) {
            log.error("SMS 인증 확인 중 오류 발생: {}", e.getMessage(), e);
            return SmsVerificationResponse.failure("인증 확인 중 오류가 발생했습니다.");
        }
    }

    // Step 3: 회원가입 완료 (이메일/비밀번호 설정)
    public CompleteRegistrationResponse completeRegistration(String verificationToken, String email, String password) {
        log.info("API 호출 시작: 회원가입 완료");

        long startTime = System.currentTimeMillis();

        try {
            // 1. 인증 토큰 검증
            String phone = smsService.validateVerificationToken(verificationToken);

            if (phone == null) {
                log.warn("유효하지 않은 인증 토큰");
                return CompleteRegistrationResponse.failure("인증 토큰이 만료되었거나 유효하지 않습니다.");
            }

            // 2. 사용자 조회
            Optional<User> userOpt = userRepository.findByPhone(phone);

            if (userOpt.isEmpty()) {
                log.error("인증 토큰에 해당하는 사용자 없음 - 전화번호: {}", maskPhone(phone));
                return CompleteRegistrationResponse.failure("사용자 정보를 찾을 수 없습니다.");
            }

            User user = userOpt.get();

            // 3. 이메일 중복 확인
            if (userRepository.existsByEmail(email)) {
                log.warn("이미 사용 중인 이메일 - 이메일: {}", email);
                return CompleteRegistrationResponse.failure("이미 사용 중인 이메일입니다.");
            }

            // 4. 비밀번호 암호화 및 계정 활성화
            String encodedPassword = passwordEncoder.encode(password);

            User updatedUser = User.builder()
                    .userId(user.getUserId())
                    .email(email)
                    .passwordHash(encodedPassword)
                    .name(user.getName())
                    .phone(user.getPhone())
                    .address(user.getAddress())
                    .licenseNumber(user.getLicenseNumber())
                    .role(user.getRole())
                    .accountStatus(AccountStatus.ACTIVE)  // 활성화
                    .createdAt(user.getCreatedAt())
                    .build();

            User savedUser = userRepository.save(updatedUser);

            // 5. 인증 토큰 삭제
            smsService.revokeVerificationToken(verificationToken);

            log.info("API 호출 완료: 회원가입 완료 - 사용자 ID: {}, 이메일: {} ({}ms)",
                    savedUser.getUserId(), savedUser.getEmail(), System.currentTimeMillis() - startTime);

            return CompleteRegistrationResponse.success(
                    savedUser.getUserId(),
                    savedUser.getEmail(),
                    savedUser.getName()
            );

        } catch (Exception e) {
            log.error("회원가입 완료 중 오류 발생: {}", e.getMessage(), e);
            return CompleteRegistrationResponse.failure("회원가입 중 오류가 발생했습니다.");
        }
    }

    // 전화번호 마스킹
    private String maskPhone(String phone) {
        if (phone == null || phone.length() < 10) {
            return "***";
        }
        int firstDash = phone.indexOf('-');
        int lastDash = phone.lastIndexOf('-');

        if (firstDash > 0 && lastDash > firstDash) {
            return phone.substring(0, firstDash + 1) +
                    "****" +
                    phone.substring(lastDash);
        }

        return phone;
    }

    // 운전면허 번호 마스킹
    private String maskLicenseNumber(String licenseNumber) {
        if (licenseNumber == null || licenseNumber.length() < 10) {
            return "***";
        }
        int maskStart = licenseNumber.indexOf('-', 6);
        int maskEnd = licenseNumber.lastIndexOf('-');

        if (maskStart > 0 && maskEnd > maskStart) {
            return licenseNumber.substring(0, maskStart + 1) +
                    "***" +
                    licenseNumber.substring(maskEnd - 3);
        }

        return licenseNumber;
    }
}
