package com.ddp.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// TCS 운전면허 검증 응답 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "TCS 운전면허 검증 응답")
public class TcsVerificationResponse {

    @Schema(description = "검증 성공 여부", example = "true")
    private boolean success;

    @Schema(description = "응답 메시지", example = "검증 성공")
    private String message;

    @Schema(description = "운전면허 번호", example = "23-45-678901-22")
    private String licenseNumber;

    @Schema(description = "운전자 이름", example = "홍길동")
    private String name;

    @Schema(description = "운전자 전화번호", example = "010-1234-5678")
    private String phone;

    @Schema(description = "음주운전 적발 횟수", example = "2")
    private Integer violationCount;

    // 성공 응답 생성
    public static TcsVerificationResponse success(String licenseNumber, String name, String phone, Integer violationCount) {
        return TcsVerificationResponse.builder()
                .success(true)
                .message("검증 성공")
                .licenseNumber(licenseNumber)
                .name(name)
                .phone(phone)
                .violationCount(violationCount)
                .build();
    }

    // 실패 응답 생성
    public static TcsVerificationResponse failure(String message) {
        return TcsVerificationResponse.builder()
                .success(false)
                .message(message)
                .build();
    }
}
