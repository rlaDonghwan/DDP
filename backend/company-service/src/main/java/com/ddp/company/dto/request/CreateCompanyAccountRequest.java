package com.ddp.company.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 업체 계정 생성 요청 DTO (auth-service 호출용)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCompanyAccountRequest {

    private String companyId;
    private String companyName;
    private String accountId;  // 로그인 계정 ID (사용자 입력)
    private String email;
    private String password;
    private String phone;
}
