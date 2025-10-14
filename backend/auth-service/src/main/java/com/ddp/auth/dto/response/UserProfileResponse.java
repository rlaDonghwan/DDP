package com.ddp.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 사용자 프로필 조회 응답 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileResponse {

    // 사용자 고유 ID
    private String id;

    // 이메일 주소
    private String email;

    // 사용자 이름
    private String name;

    // 전화번호
    private String phone;

    // 주소
    private String address;

    // 마스킹된 운전면허 번호
    private String licenseNumber;

    // 장치 ID (있는 경우)
    private String deviceId;

    // 생성 시간
    private LocalDateTime createdAt;

    // 수정 시간
    private LocalDateTime updatedAt;

    /**
     * 면허번호 마스킹 처리 메서드
     * 예: 12-34-567890-12 -> 12-**-******-**
     */
    public static String maskLicenseNumber(String licenseNumber) {
        if (licenseNumber == null || licenseNumber.isEmpty()) {
            return null;
        }

        // 면허번호 형식: XX-XX-XXXXXX-XX
        String[] parts = licenseNumber.split("-");
        if (parts.length == 4) {
            return parts[0] + "-**-******-**";
        }

        // 형식이 다른 경우 전체 마스킹
        return "************";
    }
}
