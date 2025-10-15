package com.ddp.company.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 업체 계정 생성 응답 DTO (auth-service로부터 받음)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCompanyAccountResponse {

    private boolean success;
    private String message;
    private Long userId;
    private String email;
}
