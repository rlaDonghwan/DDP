package com.ddp.company.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// 업체 목록 조회 응답 DTO (공개용)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OperatorListResponse {

    private boolean success;
    private int totalCount;
    private List<OperatorDto> operators;

    // 성공 응답 생성
    public static OperatorListResponse success(int totalCount, List<OperatorDto> operators) {
        return OperatorListResponse.builder()
            .success(true)
            .totalCount(totalCount)
            .operators(operators)
            .build();
    }

    // 실패 응답 생성
    public static OperatorListResponse failure() {
        return OperatorListResponse.builder()
            .success(false)
            .totalCount(0)
            .operators(List.of())
            .build();
    }
}
