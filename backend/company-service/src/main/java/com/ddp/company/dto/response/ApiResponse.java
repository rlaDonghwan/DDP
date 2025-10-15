package com.ddp.company.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 공통 API 응답 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ApiResponse {

    private boolean success;
    private String message;

    // 성공 응답 생성
    public static ApiResponse success(String message) {
        return ApiResponse.builder()
            .success(true)
            .message(message)
            .build();
    }

    // 실패 응답 생성
    public static ApiResponse failure(String message) {
        return ApiResponse.builder()
            .success(false)
            .message(message)
            .build();
    }
}
