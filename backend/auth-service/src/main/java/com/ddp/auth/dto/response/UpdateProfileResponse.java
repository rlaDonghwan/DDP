package com.ddp.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 사용자 프로필 수정 응답 DTO
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProfileResponse {

    // 성공 여부
    private boolean success;

    // 메시지
    private String message;

    // 업데이트된 사용자 정보
    private UserProfileResponse user;

    /**
     * 성공 응답 생성
     */
    public static UpdateProfileResponse success(String message, UserProfileResponse user) {
        return UpdateProfileResponse.builder()
                .success(true)
                .message(message)
                .user(user)
                .build();
    }

    /**
     * 실패 응답 생성
     */
    public static UpdateProfileResponse failure(String message) {
        return UpdateProfileResponse.builder()
                .success(false)
                .message(message)
                .user(null)
                .build();
    }
}
