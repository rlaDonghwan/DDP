package com.ddp.reservation.client.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 장치 응답 DTO (device-service 응답용)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DeviceResponse {

    // 장치 ID
    private Long deviceId;

    // 장치 시리얼 번호
    private String serialNumber;

    // 모델명
    private String modelName;

    // 제조업체 ID
    private Long manufacturerId;

    // 사용자 ID
    private Long userId;

    // 업체 ID
    private Long companyId;

    // 장치 상태
    private String status;

    // 설치일
    private LocalDate installDate;

    // 마지막 검·교정일
    private LocalDate lastInspectionDate;

    // 다음 검·교정 예정일
    private LocalDate nextInspectionDate;

    // 보증 종료일
    private LocalDate warrantyEndDate;

    // 생성 일시
    private LocalDateTime createdAt;

    // 수정 일시
    private LocalDateTime updatedAt;
}
