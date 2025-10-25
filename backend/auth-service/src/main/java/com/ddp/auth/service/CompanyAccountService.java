package com.ddp.auth.service;

import com.ddp.auth.dto.response.ApiResponse;
import com.ddp.auth.dto.response.CreateCompanyAccountResponse;
import com.ddp.auth.entity.AccountStatus;
import com.ddp.auth.entity.User;
import com.ddp.auth.entity.UserRole;
import com.ddp.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

// 업체 계정 생성 서비스
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CompanyAccountService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 업체 계정 생성 (company-service에서 호출)
     */
    public CreateCompanyAccountResponse createCompanyAccount(
        String companyId,
        String companyName,
        String email,
        String password,
        String phone
    ) {
        log.info("API 호출 시작: 업체 계정 생성 - 업체 ID: {}, 이메일: {}", companyId, email);
        long startTime = System.currentTimeMillis();

        try {
            // 1. 이메일 중복 확인
            Optional<User> existingUser = userRepository.findByEmail(email);
            if (existingUser.isPresent()) {
                log.warn("업체 계정 생성 실패: 이미 존재하는 이메일 - {}", email);
                return CreateCompanyAccountResponse.failure("이미 사용 중인 이메일입니다.");
            }

            // 2. 전화번호 중복 확인
            Optional<User> existingPhone = userRepository.findByPhone(phone);
            if (existingPhone.isPresent()) {
                log.warn("업체 계정 생성 실패: 이미 존재하는 전화번호 - {}", maskPhone(phone));
                return CreateCompanyAccountResponse.failure("이미 등록된 전화번호입니다.");
            }

            // 3. 비밀번호 암호화
            String encodedPassword = passwordEncoder.encode(password);

            // 4. 업체 계정 생성
            User companyUser = User.builder()
                .email(email)
                .passwordHash(encodedPassword)
                .name(companyName)
                .phone(phone)
                .address(null) // 업체 주소는 company-service에서 관리
                .companyId(Long.parseLong(companyId)) // company ID를 companyId 필드에 저장
                .licenseNumber(null) // 업체는 운전면허 없음
                .role(UserRole.COMPANY)
                .accountStatus(AccountStatus.ACTIVE)
                .build();

            User savedUser = userRepository.save(companyUser);

            log.info("API 호출 완료: 업체 계정 생성 - 사용자 ID: {}, 이메일: {} ({}ms)",
                savedUser.getUserId(), savedUser.getEmail(), System.currentTimeMillis() - startTime);

            return CreateCompanyAccountResponse.success(savedUser.getUserId(), savedUser.getEmail());

        } catch (Exception e) {
            log.error("API 호출 실패: 업체 계정 생성 - 업체 ID: {}, 오류: {}", companyId, e.getMessage(), e);
            return CreateCompanyAccountResponse.failure("업체 계정 생성 중 오류가 발생했습니다.");
        }
    }

    /**
     * 업체 계정 비활성화 (company-service에서 업체 삭제 시 호출)
     */
    public ApiResponse deactivateCompanyAccount(Long companyId) {
        log.info("API 호출 시작: 업체 계정 비활성화 - 업체 ID: {}", companyId);
        long startTime = System.currentTimeMillis();

        try {
            // 1. 업체 ID와 COMPANY 역할로 사용자 조회
            Optional<User> companyUser = userRepository.findByCompanyIdAndRole(companyId, UserRole.COMPANY);

            if (companyUser.isEmpty()) {
                log.warn("업체 계정 비활성화 실패: 업체 계정을 찾을 수 없음 - 업체 ID: {}", companyId);
                return ApiResponse.failure("업체 계정을 찾을 수 없습니다.");
            }

            User user = companyUser.get();

            // 2. 계정 상태를 DEACTIVATED로 변경
            user.updateAccountStatus(AccountStatus.DEACTIVATED);
            userRepository.save(user);

            log.info("API 호출 완료: 업체 계정 비활성화 - 사용자 ID: {}, 업체 ID: {} ({}ms)",
                user.getUserId(), companyId, System.currentTimeMillis() - startTime);

            return ApiResponse.success("업체 계정이 비활성화되었습니다.");

        } catch (Exception e) {
            log.error("API 호출 실패: 업체 계정 비활성화 - 업체 ID: {}, 오류: {}", companyId, e.getMessage(), e);
            return ApiResponse.failure("업체 계정 비활성화 중 오류가 발생했습니다.");
        }
    }

    /**
     * 전화번호 마스킹
     */
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
