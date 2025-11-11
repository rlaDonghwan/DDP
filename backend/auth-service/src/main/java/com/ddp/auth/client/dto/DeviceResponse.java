package com.ddp.auth.client.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

// Device Service로부터 받는 장치 응답 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceResponse {

    private Long deviceId;
    private String serialNumber;
    private String modelName;
    private Long manufacturerId;
    private Long userId;
    private Long companyId;
    private String status; // DeviceStatus enum의 문자열 값
    private LocalDate installDate;
    private LocalDate lastInspectionDate;
    private LocalDate nextInspectionDate;
    private LocalDate warrantyEndDate;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
