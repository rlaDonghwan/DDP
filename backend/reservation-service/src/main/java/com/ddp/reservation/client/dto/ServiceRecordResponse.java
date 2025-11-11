package com.ddp.reservation.client.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Company Service - 서비스 이력 응답 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceRecordResponse {

    private String id;
    private String type;
    private String subjectId;
    private String subjectName;
    private String deviceId;
    private String deviceSerialNumber;
    private String description;
    private String performedAt;
    private String performedBy;
    private BigDecimal cost;
}
