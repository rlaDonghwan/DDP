package com.ddp.reservation.client.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Company Service - 서비스 이력 생성 요청 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateServiceRecordRequest {

    // 서비스 유형 (INSTALLATION, INSPECTION, REPAIR, REPLACEMENT)
    private String type;

    // 대상자 ID (사용자 ID)
    private Long subjectId;

    // 대상자 이름
    private String subjectName;

    // 장치 ID
    private Long deviceId;

    // 장치 시리얼 번호
    private String deviceSerialNumber;

    // 서비스 설명
    private String description;

    // 서비스 수행 일시
    private LocalDateTime performedAt;

    // 담당자 이름 (업체 담당자)
    private String performedBy;

    // 비용
    private BigDecimal cost;

    // 업체 ID
    private Long companyId;
}
