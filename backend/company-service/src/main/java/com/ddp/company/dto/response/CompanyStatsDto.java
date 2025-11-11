package com.ddp.company.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * 업체 통계 정보 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyStatsDto {

    // 총 서비스 건수
    private Long totalServiceCount;

    // 서비스 타입별 건수
    private Long installationCount;
    private Long inspectionCount;
    private Long repairCount;
    private Long maintenanceCount;

    // 총 매출
    private BigDecimal totalRevenue;

    // 이번 달 서비스 건수
    private Long thisMonthServiceCount;

    // 이번 달 매출
    private BigDecimal thisMonthRevenue;

    // 평균 서비스 비용
    private BigDecimal averageServiceCost;
}
