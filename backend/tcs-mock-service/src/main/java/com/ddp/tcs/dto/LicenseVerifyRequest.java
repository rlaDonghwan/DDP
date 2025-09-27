package com.ddp.tcs.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

// 면허 조회 요청 DTO
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class LicenseVerifyRequest {

    // 면허번호 (필수)
    @NotBlank(message = "면허번호는 필수입니다")
    @Pattern(regexp = "^[0-9]{2}-[0-9]{2}-[0-9]{6}-[0-9]{2}$", 
             message = "면허번호 형식이 올바르지 않습니다 (예: 11-22-123456-78)")
    private String licenseNumber;

    // 생년월일 (YYMMDD 형식, 선택사항)
    @Pattern(regexp = "^[0-9]{6}$", message = "생년월일은 YYMMDD 형식이어야 합니다")
    private String birthDate;
}