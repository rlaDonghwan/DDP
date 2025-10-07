package com.ddp.auth.service;

import com.ddp.auth.dto.AdminCreateAccountResponse;
import com.ddp.auth.dto.TcsVerificationResponse;
import com.ddp.auth.entity.AccountStatus;
import com.ddp.auth.entity.User;
import com.ddp.auth.entity.UserRole;
import com.ddp.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

// 관리자 계정 생성 서비스
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class AdminAccountService {

    private final UserRepository userRepository;
    private final TcsService tcsService;

    // 관리자가 미완성 계정 생성
    public AdminCreateAccountResponse createPendingAccount(String licenseNumber) {
        log.info("API 호출 시작: 관리자 계정 생성 - 운전면허 번호: {}", maskLicenseNumber(licenseNumber));

        long startTime = System.currentTimeMillis();

        try {
            // 1. 이미 존재하는 계정인지 확인
            Optional<User> existingUser = userRepository.findByLicenseNumber(licenseNumber);
            if (existingUser.isPresent()) {
                log.warn("이미 존재하는 계정 - 운전면허 번호: {}", maskLicenseNumber(licenseNumber));
                return AdminCreateAccountResponse.failure("이미 계정이 생성되었습니다.");
            }

            // 2. TCS API 호출하여 운전면허 검증
            TcsVerificationResponse tcsResponse = tcsService.verifyLicense(licenseNumber);

            if (!tcsResponse.isSuccess()) {
                log.warn("TCS 검증 실패 - 운전면허 번호: {}, 메시지: {}",
                        maskLicenseNumber(licenseNumber), tcsResponse.getMessage());
                return AdminCreateAccountResponse.failure(tcsResponse.getMessage());
            }

            // 3. 전화번호 중복 확인
            Optional<User> existingPhone = userRepository.findByPhone(tcsResponse.getPhone());
            if (existingPhone.isPresent()) {
                log.warn("이미 등록된 전화번호 - 전화번호: {}", maskPhone(tcsResponse.getPhone()));
                return AdminCreateAccountResponse.failure("이미 등록된 전화번호입니다.");
            }

            // 4. 미완성 계정 생성 (email, passwordHash는 null)
            User pendingUser = User.builder()
                    .licenseNumber(licenseNumber)
                    .name(tcsResponse.getName())
                    .phone(tcsResponse.getPhone())
                    .address(tcsResponse.getAddress())
                    .role(UserRole.USER)  // 기본 역할: USER
                    .accountStatus(AccountStatus.PENDING)  // 미완성 상태
                    .build();

            User savedUser = userRepository.save(pendingUser);

            log.info("API 호출 완료: 관리자 계정 생성 - 사용자 ID: {}, 이름: {}, 전화번호: {} ({}ms)",
                    savedUser.getUserId(), savedUser.getName(), maskPhone(savedUser.getPhone()),
                    System.currentTimeMillis() - startTime);

            // 5. 정부 통보 메시지 전송 (Mock)
            sendGovernmentNotification(savedUser);

            return AdminCreateAccountResponse.success(
                    savedUser.getUserId(),
                    savedUser.getName(),
                    savedUser.getPhone(),
                    savedUser.getLicenseNumber()
            );

        } catch (Exception e) {
            log.error("관리자 계정 생성 중 오류 발생: {}", e.getMessage(), e);
            return AdminCreateAccountResponse.failure("계정 생성 중 오류가 발생했습니다.");
        }
    }

    // 정부 통보 메시지 전송 (Mock)
    private void sendGovernmentNotification(User user) {
        log.info("[정부 통보 (Mock)] 음주운전 방지 프로그램 참여 안내");
        log.info("  대상자: {} ({})", user.getName(), maskPhone(user.getPhone()));
        log.info("  운전면허: {}", maskLicenseNumber(user.getLicenseNumber()));
        log.info("  안내: 휴대폰 인증을 통해 프로그램 참여 계정을 완성하실 수 있습니다.");

        // TODO: 실제 프로덕션 환경에서는 SMS 또는 공문 발송
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

    // 계정 존재 여부 확인
    public boolean checkAccountExists(String licenseNumber) {
        log.debug("계정 존재 여부 확인 - 운전면허 번호: {}", maskLicenseNumber(licenseNumber));
        return userRepository.findByLicenseNumber(licenseNumber).isPresent();
    }

    // 계정 상태 조회
    public String getAccountStatus(String licenseNumber) {
        log.debug("계정 상태 조회 - 운전면허 번호: {}", maskLicenseNumber(licenseNumber));

        Optional<User> user = userRepository.findByLicenseNumber(licenseNumber);

        if (user.isEmpty()) {
            return null;
        }

        return user.get().getAccountStatus().name();
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
}
