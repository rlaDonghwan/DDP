package com.ddp.auth.controller;

import com.ddp.auth.client.CompanyServiceClient;
import com.ddp.auth.client.DeviceServiceClient;
import com.ddp.auth.client.dto.DeviceResponse;
import com.ddp.auth.dto.request.ChangePasswordRequest;
import com.ddp.auth.dto.request.UpdateProfileRequest;
import com.ddp.auth.dto.response.AssignedDeviceResponse;
import com.ddp.auth.dto.response.UpdateProfileResponse;
import com.ddp.auth.dto.response.UserProfileResponse;
import com.ddp.auth.service.CookieService;
import com.ddp.auth.service.JwtService;
import com.ddp.auth.service.UserProfileService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 사용자 프로필 관리 컨트롤러
@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
@Validated
public class UserProfileController {

    private final UserProfileService userProfileService;
    private final CookieService cookieService;
    private final JwtService jwtService;
    private final DeviceServiceClient deviceServiceClient;
    private final CompanyServiceClient companyServiceClient;

    /**
     * 사용자 프로필 조회 (자신의 프로필)
     * GET /api/v1/users/profile
     */
    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(HttpServletRequest request) {
        log.debug("사용자 프로필 조회 요청");

        try {
            // JWT 토큰에서 사용자 ID 추출
            Long userId = getUserIdFromToken(request);
            if (userId == null) {
                log.warn("토큰에서 사용자 ID를 추출할 수 없습니다");
                return ResponseEntity.status(401).build();
            }

            // 프로필 조회
            UserProfileResponse profile = userProfileService.getProfile(userId);
            return ResponseEntity.ok(profile);

        } catch (IllegalArgumentException e) {
            log.warn("프로필 조회 실패: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("프로필 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 사용자 프로필 조회 (ID로 조회, 내부 서비스 호출용)
     * GET /api/v1/users/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserProfileResponse> getUserById(@PathVariable Long id) {
        log.debug("사용자 ID로 프로필 조회 요청: userId={}", id);

        try {
            // 프로필 조회
            UserProfileResponse profile = userProfileService.getProfile(id);
            return ResponseEntity.ok(profile);

        } catch (IllegalArgumentException e) {
            log.warn("프로필 조회 실패: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("프로필 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * 사용자 프로필 수정
     * PATCH /api/v1/users/profile
     */
    @PatchMapping("/profile")
    public ResponseEntity<UpdateProfileResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest updateRequest,
            HttpServletRequest request) {

        log.debug("사용자 프로필 수정 요청");

        try {
            // JWT 토큰에서 사용자 ID 추출
            Long userId = getUserIdFromToken(request);
            if (userId == null) {
                log.warn("토큰에서 사용자 ID를 추출할 수 없습니다");
                return ResponseEntity.status(401)
                        .body(UpdateProfileResponse.failure("인증이 필요합니다."));
            }

            // 프로필 수정
            UpdateProfileResponse response = userProfileService.updateProfile(userId, updateRequest);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            log.error("프로필 수정 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(UpdateProfileResponse.failure("프로필 수정 중 오류가 발생했습니다."));
        }
    }

    /**
     * 비밀번호 변경
     * POST /api/v1/users/password
     */
    @PostMapping("/password")
    public ResponseEntity<UpdateProfileResponse> changePassword(
            @Valid @RequestBody ChangePasswordRequest passwordRequest,
            HttpServletRequest request) {

        log.debug("비밀번호 변경 요청");

        try {
            // JWT 토큰에서 사용자 ID 추출
            Long userId = getUserIdFromToken(request);
            if (userId == null) {
                log.warn("토큰에서 사용자 ID를 추출할 수 없습니다");
                return ResponseEntity.status(401)
                        .body(UpdateProfileResponse.failure("인증이 필요합니다."));
            }

            // 비밀번호 변경
            UpdateProfileResponse response = userProfileService.changePassword(userId, passwordRequest);

            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }

        } catch (Exception e) {
            log.error("비밀번호 변경 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError()
                    .body(UpdateProfileResponse.failure("비밀번호 변경 중 오류가 발생했습니다."));
        }
    }

    /**
     * 사용자에게 할당된 장치 정보 조회
     * GET /api/v1/users/device
     */
    @GetMapping("/device")
    public ResponseEntity<AssignedDeviceResponse> getAssignedDevice(HttpServletRequest request) {
        log.debug("사용자 할당 장치 조회 요청");

        try {
            // JWT 토큰에서 사용자 ID 추출
            Long userId = getUserIdFromToken(request);
            if (userId == null) {
                log.warn("토큰에서 사용자 ID를 추출할 수 없습니다");
                return ResponseEntity.status(401).build();
            }

            // device-service로부터 사용자의 장치 목록 조회
            List<DeviceResponse> devices = deviceServiceClient.getUserDevices(userId);

            // 장치가 없으면 204 No Content 반환
            if (devices == null || devices.isEmpty()) {
                log.info("사용자 ID {}에게 할당된 장치가 없습니다", userId);
                return ResponseEntity.noContent().build();
            }

            // 첫 번째 장치를 반환 (사용자는 일반적으로 하나의 장치만 할당됨)
            DeviceResponse device = devices.get(0);
            AssignedDeviceResponse response = AssignedDeviceResponse.from(device, companyServiceClient);

            log.info("사용자 ID {}의 장치 정보 조회 완료: 장치 ID {}", userId, device.getDeviceId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("장치 정보 조회 중 오류 발생: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }

    /**
     * Request에서 JWT 토큰을 추출하여 사용자 ID 반환
     * 쿠키에서 Access Token을 추출하고 JWT에서 userId를 가져옵니다
     */
    private Long getUserIdFromToken(HttpServletRequest request) {
        try {
            // 쿠키에서 Access Token 추출
            String token = cookieService.extractAccessToken(request);
            if (token == null) {
                log.warn("Access Token을 찾을 수 없습니다");
                return null;
            }

            // JWT 토큰 유효성 검증
            if (!jwtService.validateToken(token)) {
                log.warn("유효하지 않은 JWT 토큰입니다");
                return null;
            }

            // 토큰에서 사용자 ID 추출
            return jwtService.getUserIdFromToken(token);

        } catch (Exception e) {
            log.error("사용자 ID 추출 중 오류 발생: {}", e.getMessage(), e);
            return null;
        }
    }
}
