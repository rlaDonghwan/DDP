package com.ddp.auth.client.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// Company Service로부터 받는 업체명 응답 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyNameResponse {

    private Long companyId; // 업체 ID
    private String name; // 업체명
}
