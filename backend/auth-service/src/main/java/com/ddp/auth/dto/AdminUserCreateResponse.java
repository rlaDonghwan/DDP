package com.ddp.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

// 관리자용 사용자 생성 응답 DTO
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class AdminUserCreateResponse {

    // 생성 성공 여부
    private boolean success;

    // 생성된 사용자 ID
    private Long userId;

    // 생성된 사용자 이메일
    private String email;

    // 사용자 이름
    private String name;

    // 임시 비밀번호 (최초 로그인용)
    private String tempPassword;

    // 생성 시간
    private LocalDateTime createdAt;

    // 오류 메시지 (생성 실패 시)
    private String errorMessage;

    // 성공 응답 생성
    public static AdminUserCreateResponse success(Long userId, String email, String name, 
                                                String tempPassword, LocalDateTime createdAt) {
        return AdminUserCreateResponse.builder()
                .success(true)
                .userId(userId)
                .email(email)
                .name(name)
                .tempPassword(tempPassword)
                .createdAt(createdAt)
                .build();
    }

    // 실패 응답 생성
    public static AdminUserCreateResponse failure(String errorMessage) {
        return AdminUserCreateResponse.builder()
                .success(false)
                .errorMessage(errorMessage)
                .build();
    }
}