package com.ddp.company.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 업체명 응답 DTO (간단한 조회용)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyNameResponse {

    private Long companyId; // 업체 ID
    private String name; // 업체명
}
