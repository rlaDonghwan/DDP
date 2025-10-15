package com.ddp.company.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// 업체 목록 조회 응답 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyListResponse {

    private boolean success;
    private int totalCount;
    private List<CompanyDto> companies;

    // 성공 응답 생성
    public static CompanyListResponse success(int totalCount, List<CompanyDto> companies) {
        return CompanyListResponse.builder()
            .success(true)
            .totalCount(totalCount)
            .companies(companies)
            .build();
    }

    // 실패 응답 생성
    public static CompanyListResponse failure() {
        return CompanyListResponse.builder()
            .success(false)
            .totalCount(0)
            .companies(List.of())
            .build();
    }
}
