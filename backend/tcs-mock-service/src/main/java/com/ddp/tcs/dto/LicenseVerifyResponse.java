package com.ddp.tcs.dto;

import com.ddp.tcs.entity.LicenseStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

// 면허 조회 응답 DTO
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class LicenseVerifyResponse {

    // 조회 성공 여부
    private boolean success;

    // 면허번호
    private String licenseNumber;

    // 성명
    private String name;

    // 생년월일
    private LocalDate birthDate;

    // 주소
    private String address;

    // 면허 발급일
    private LocalDate issueDate;

    // 면허 만료일
    private LocalDate expiryDate;

    // 면허 종류
    private String licenseType;

    // 면허 상태
    private LicenseStatus status;

    // 음주운전 위반 여부
    private boolean isDuiViolator;

    // 위반 횟수
    private int violationCount;

    // 오류 메시지 (조회 실패 시)
    private String errorMessage;

    // 성공 응답 생성
    public static LicenseVerifyResponse success(String licenseNumber, String name, 
                                              LocalDate birthDate, String address,
                                              LocalDate issueDate, LocalDate expiryDate,
                                              String licenseType, LicenseStatus status,
                                              boolean isDuiViolator, int violationCount) {
        return LicenseVerifyResponse.builder()
                .success(true)
                .licenseNumber(licenseNumber)
                .name(name)
                .birthDate(birthDate)
                .address(address)
                .issueDate(issueDate)
                .expiryDate(expiryDate)
                .licenseType(licenseType)
                .status(status)
                .isDuiViolator(isDuiViolator)
                .violationCount(violationCount)
                .build();
    }

    // 실패 응답 생성
    public static LicenseVerifyResponse failure(String errorMessage) {
        return LicenseVerifyResponse.builder()
                .success(false)
                .errorMessage(errorMessage)
                .build();
    }
}