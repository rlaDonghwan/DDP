package com.ddp.auth.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 업체 계정 생성 요청 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCompanyAccountRequest {

    // 업체 ID (company-service의 Company ID)
    @NotBlank(message = "업체 ID는 필수입니다")
    private String companyId;

    // 업체명
    @NotBlank(message = "업체명은 필수입니다")
    private String companyName;

    // 이메일 (로그인 ID)
    @NotBlank(message = "이메일은 필수입니다")
    @Email(message = "올바른 이메일 형식이 아닙니다")
    private String email;

    // 초기 비밀번호
    @NotBlank(message = "비밀번호는 필수입니다")
    private String password;

    // 전화번호
    @NotBlank(message = "전화번호는 필수입니다")
    private String phone;
}
