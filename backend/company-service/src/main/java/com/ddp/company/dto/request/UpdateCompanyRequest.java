package com.ddp.company.dto.request;

import com.ddp.company.entity.CompanyStatus;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 업체 수정 요청 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateCompanyRequest {

    // 업체명
    private String name;

    // 이메일
    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String email;

    // 전화번호
    private String phone;

    // 주소
    private String address;

    // 지역
    private String region;

    // 업체 상태
    private CompanyStatus status;
}
