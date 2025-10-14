package com.ddp.auth.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// SMS 인증 응답 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "SMS 인증 응답")
public class SmsVerificationResponse {

    @Schema(description = "성공 여부", example = "true")
    private boolean success;

    @Schema(description = "응답 메시지", example = "인증번호가 발송되었습니다")
    private String message;

    @Schema(description = "만료 시간 (초)", example = "180")
    private Integer expiresIn;

    @Schema(description = "인증 토큰 (인증 완료 시)")
    private String verificationToken;

    @Schema(description = "사용자 이름 (인증 완료 시)")
    private String name;

    @Schema(description = "마스킹된 운전면허 번호 (인증 완료 시)")
    private String licenseNumber;

    // SMS 발송 성공 응답
    public static SmsVerificationResponse sendSuccess(int expiresIn) {
        return SmsVerificationResponse.builder()
                .success(true)
                .message("인증번호가 발송되었습니다")
                .expiresIn(expiresIn)
                .build();
    }

    // 인증 확인 성공 응답
    public static SmsVerificationResponse verifySuccess(String verificationToken, String name, String licenseNumber) {
        return SmsVerificationResponse.builder()
                .success(true)
                .message("인증되었습니다")
                .verificationToken(verificationToken)
                .name(name)
                .licenseNumber(licenseNumber)
                .build();
    }

    // 실패 응답
    public static SmsVerificationResponse failure(String message) {
        return SmsVerificationResponse.builder()
                .success(false)
                .message(message)
                .build();
    }
}
