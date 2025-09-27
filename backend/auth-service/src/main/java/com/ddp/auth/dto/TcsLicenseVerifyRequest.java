package com.ddp.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

// TCS API 면허 조회 요청 DTO
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class TcsLicenseVerifyRequest {

    // 면허번호
    private String licenseNumber;

    // 생년월일 (YYMMDD 형식)
    private String birthDate;
}