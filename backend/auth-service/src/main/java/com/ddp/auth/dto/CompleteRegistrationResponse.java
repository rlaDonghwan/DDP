package com.ddp.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 회원가입 완료 응답 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "회원가입 완료 응답")
public class CompleteRegistrationResponse {

    @Schema(description = "성공 여부", example = "true")
    private boolean success;

    @Schema(description = "응답 메시지", example = "회원가입이 완료되었습니다")
    private String message;

    @Schema(description = "사용자 ID")
    private Long userId;

    @Schema(description = "이메일")
    private String email;

    @Schema(description = "사용자 이름")
    private String name;

    // 성공 응답 생성
    public static CompleteRegistrationResponse success(Long userId, String email, String name) {
        return CompleteRegistrationResponse.builder()
                .success(true)
                .message("회원가입이 완료되었습니다. 이제 로그인할 수 있습니다.")
                .userId(userId)
                .email(email)
                .name(name)
                .build();
    }

    // 실패 응답 생성
    public static CompleteRegistrationResponse failure(String message) {
        return CompleteRegistrationResponse.builder()
                .success(false)
                .message(message)
                .build();
    }
}
