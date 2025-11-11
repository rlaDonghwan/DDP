package com.ddp.reservation.client.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * 장치 등록 요청 DTO (device-service 호출용)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterDeviceRequest {

    // 장치 시리얼 번호
    private String serialNumber;

    // 모델명
    private String modelName;

    // 제조업체 ID
    private Long manufacturerId;

    // 사용자 ID (설치 시)
    private Long userId;

    // 업체 ID
    private Long companyId;

    // 설치일
    private LocalDate installDate;

    // 보증 종료일
    private LocalDate warrantyEndDate;
}
