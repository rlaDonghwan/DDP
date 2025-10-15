package com.ddp.company.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 업체 상세 조회 응답 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyDetailResponse {

    private boolean success;
    private CompanyDetailDto company;

    // 성공 응답 생성
    public static CompanyDetailResponse success(CompanyDetailDto company) {
        return CompanyDetailResponse.builder()
            .success(true)
            .company(company)
            .build();
    }

    // 실패 응답 생성
    public static CompanyDetailResponse failure() {
        return CompanyDetailResponse.builder()
            .success(false)
            .company(null)
            .build();
    }
}
