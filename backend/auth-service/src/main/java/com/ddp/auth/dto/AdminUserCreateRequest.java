package com.ddp.auth.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

// 관리자용 사용자 생성 요청 DTO (TCS 연동)
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class AdminUserCreateRequest {

    // 면허번호 (필수)
    @NotBlank(message = "면허번호는 필수입니다")
    @Pattern(regexp = "^[0-9]{2}-[0-9]{2}-[0-9]{6}-[0-9]{2}$", 
             message = "면허번호 형식이 올바르지 않습니다 (예: 11-22-123456-78)")
    private String licenseNumber;

    // 생년월일 (YYMMDD 형식, 선택사항 - TCS 조회 시 검증용)
    @Pattern(regexp = "^[0-9]{6}$", message = "생년월일은 YYMMDD 형식이어야 합니다")
    private String birthDate;

    // 임시 비밀번호 (선택사항 - 없으면 시스템에서 생성)
    private String tempPassword;
}