package com.ddp.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 계정 존재 여부 확인 응답 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "계정 존재 여부 확인 응답")
public class AccountCheckResponse {

    @Schema(description = "계정 존재 여부", example = "true")
    private boolean exists;

    @Schema(description = "계정 상태 (PENDING, ACTIVE, null)", example = "PENDING")
    private String accountStatus;

    // 계정 존재 응답 생성
    public static AccountCheckResponse exists(String accountStatus) {
        return AccountCheckResponse.builder()
                .exists(true)
                .accountStatus(accountStatus)
                .build();
    }

    // 계정 미존재 응답 생성
    public static AccountCheckResponse notExists() {
        return AccountCheckResponse.builder()
                .exists(false)
                .accountStatus(null)
                .build();
    }
}
