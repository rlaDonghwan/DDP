package com.ddp.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 업체 계정 생성 응답 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCompanyAccountResponse {

    private boolean success;
    private String message;
    private Long userId;
    private String email;

    // 성공 응답 생성
    public static CreateCompanyAccountResponse success(Long userId, String email) {
        return CreateCompanyAccountResponse.builder()
            .success(true)
            .message("업체 계정이 성공적으로 생성되었습니다.")
            .userId(userId)
            .email(email)
            .build();
    }

    // 실패 응답 생성
    public static CreateCompanyAccountResponse failure(String message) {
        return CreateCompanyAccountResponse.builder()
            .success(false)
            .message(message)
            .userId(null)
            .email(null)
            .build();
    }
}
