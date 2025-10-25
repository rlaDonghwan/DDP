package com.ddp.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

// 공통 API 응답 DTO
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse {

    // 성공 여부
    private boolean success;

    // 응답 메시지
    private String message;

    /**
     * 성공 응답 생성
     */
    public static ApiResponse success(String message) {
        return ApiResponse.builder()
            .success(true)
            .message(message)
            .build();
    }

    /**
     * 실패 응답 생성
     */
    public static ApiResponse failure(String message) {
        return ApiResponse.builder()
            .success(false)
            .message(message)
            .build();
    }
}
