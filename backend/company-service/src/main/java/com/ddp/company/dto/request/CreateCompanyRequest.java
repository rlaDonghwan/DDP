package com.ddp.company.dto.request;

import com.ddp.company.entity.ContractStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 업체 등록 요청 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCompanyRequest {

    // 업체명
    @NotBlank(message = "업체명은 필수입니다")
    private String name;

    // 사업자등록번호
    @NotBlank(message = "사업자등록번호는 필수입니다")
    private String businessNumber;

    // 대표자명
    @NotBlank(message = "대표자명은 필수입니다")
    private String representativeName;

    // 이메일
    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String email;

    // 전화번호
    @NotBlank(message = "전화번호는 필수입니다")
    private String phone;

    // 주소
    @NotBlank(message = "주소는 필수입니다")
    private String address;

    // 지역
    @NotBlank(message = "지역은 필수입니다")
    private String region;

    // 인증 유효 기간 (ISO 날짜)
    @NotBlank(message = "인증 유효 기간은 필수입니다")
    private String certificationValidUntil;

    // 계약 상태
    @NotNull(message = "계약 상태는 필수입니다")
    private ContractStatus contractStatus;

    // 사업자등록증 번호
    private String businessRegistrationNumber;

    // 직인 정보
    private String sealInfo;

    // 초기 계정 ID
    @NotBlank(message = "초기 계정 ID는 필수입니다")
    private String initialAccountId;

    // 초기 비밀번호
    @NotBlank(message = "초기 비밀번호는 필수입니다")
    private String initialPassword;
}
