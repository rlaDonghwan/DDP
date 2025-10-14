package com.ddp.auth.service;

import com.ddp.auth.dto.request.ChangePasswordRequest;
import com.ddp.auth.dto.request.UpdateProfileRequest;
import com.ddp.auth.dto.response.UpdateProfileResponse;
import com.ddp.auth.dto.response.UserProfileResponse;
import com.ddp.auth.entity.User;
import com.ddp.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

/**
 * 사용자 프로필 관리 서비스
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class UserProfileService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 사용자 프로필 조회
     */
    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(Long userId) {
        log.info("API 호출 시작: 사용자 프로필 조회 - 사용자 ID: {}", userId);
        long startTime = System.currentTimeMillis();

        try {
            // 사용자 조회
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                log.warn("존재하지 않는 사용자: {}", userId);
                throw new IllegalArgumentException("사용자를 찾을 수 없습니다.");
            }

            User user = userOpt.get();

            // 프로필 응답 생성 (면허번호 마스킹 처리)
            UserProfileResponse response = UserProfileResponse.builder()
                    .id(String.valueOf(user.getUserId()))
                    .email(user.getEmail())
                    .name(user.getName())
                    .phone(user.getPhone())
                    .address(user.getAddress())
                    .licenseNumber(UserProfileResponse.maskLicenseNumber(user.getLicenseNumber()))
                    .deviceId(null) // TODO: 장치 정보 연동 시 구현
                    .createdAt(user.getCreatedAt())
                    .updatedAt(user.getUpdatedAt())
                    .build();

            log.info("API 호출 완료: 사용자 프로필 조회 - 사용자 ID: {} ({}ms)",
                    userId, System.currentTimeMillis() - startTime);

            return response;

        } catch (Exception e) {
            log.error("API 호출 실패: 사용자 프로필 조회 - 사용자 ID: {} ({}ms), 오류: {}",
                    userId, System.currentTimeMillis() - startTime, e.getMessage());
            throw e;
        }
    }

    /**
     * 사용자 프로필 수정
     */
    public UpdateProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        log.info("API 호출 시작: 사용자 프로필 수정 - 사용자 ID: {}", userId);
        long startTime = System.currentTimeMillis();

        try {
            // 사용자 조회
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                log.warn("존재하지 않는 사용자: {}", userId);
                return UpdateProfileResponse.failure("사용자를 찾을 수 없습니다.");
            }

            User user = userOpt.get();

            // 전화번호 중복 체크 (본인 제외)
            if (request.getPhone() != null && !request.getPhone().isEmpty()) {
                Optional<User> duplicatePhone = userRepository.findByPhone(request.getPhone());
                if (duplicatePhone.isPresent() && !duplicatePhone.get().getUserId().equals(userId)) {
                    log.warn("중복된 전화번호: {}", request.getPhone());
                    return UpdateProfileResponse.failure("이미 사용 중인 전화번호입니다.");
                }
            }

            // 프로필 업데이트
            user.updateProfile(request.getPhone(), request.getAddress());
            userRepository.save(user);

            // 업데이트된 프로필 조회
            UserProfileResponse profileResponse = getProfile(userId);

            log.info("API 호출 완료: 사용자 프로필 수정 - 사용자 ID: {} ({}ms)",
                    userId, System.currentTimeMillis() - startTime);

            return UpdateProfileResponse.success("프로필이 성공적으로 수정되었습니다.", profileResponse);

        } catch (Exception e) {
            log.error("API 호출 실패: 사용자 프로필 수정 - 사용자 ID: {} ({}ms), 오류: {}",
                    userId, System.currentTimeMillis() - startTime, e.getMessage());
            return UpdateProfileResponse.failure("프로필 수정 중 오류가 발생했습니다.");
        }
    }

    /**
     * 비밀번호 변경
     */
    public UpdateProfileResponse changePassword(Long userId, ChangePasswordRequest request) {
        log.info("API 호출 시작: 비밀번호 변경 - 사용자 ID: {}", userId);
        long startTime = System.currentTimeMillis();

        try {
            // 새 비밀번호와 확인 비밀번호 일치 검증
            if (!request.getNewPassword().equals(request.getConfirmPassword())) {
                log.warn("새 비밀번호 불일치 - 사용자 ID: {}", userId);
                return UpdateProfileResponse.failure("새 비밀번호가 일치하지 않습니다.");
            }

            // 사용자 조회
            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                log.warn("존재하지 않는 사용자: {}", userId);
                return UpdateProfileResponse.failure("사용자를 찾을 수 없습니다.");
            }

            User user = userOpt.get();

            // 현재 비밀번호 검증
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
                log.warn("현재 비밀번호 불일치 - 사용자 ID: {}", userId);
                return UpdateProfileResponse.failure("현재 비밀번호가 올바르지 않습니다.");
            }

            // 새 비밀번호가 현재 비밀번호와 동일한지 확인
            if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
                log.warn("새 비밀번호가 현재 비밀번호와 동일 - 사용자 ID: {}", userId);
                return UpdateProfileResponse.failure("새 비밀번호는 현재 비밀번호와 달라야 합니다.");
            }

            // 비밀번호 업데이트
            String newPasswordHash = passwordEncoder.encode(request.getNewPassword());
            user.updatePassword(newPasswordHash);
            userRepository.save(user);

            log.info("API 호출 완료: 비밀번호 변경 - 사용자 ID: {} ({}ms)",
                    userId, System.currentTimeMillis() - startTime);

            return UpdateProfileResponse.success("비밀번호가 성공적으로 변경되었습니다.", null);

        } catch (Exception e) {
            log.error("API 호출 실패: 비밀번호 변경 - 사용자 ID: {} ({}ms), 오류: {}",
                    userId, System.currentTimeMillis() - startTime, e.getMessage());
            return UpdateProfileResponse.failure("비밀번호 변경 중 오류가 발생했습니다.");
        }
    }
}
