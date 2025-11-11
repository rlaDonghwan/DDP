package com.ddp.device.dto.response;

import com.ddp.device.entity.Device;
import com.ddp.device.entity.DeviceStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

// 장치 응답 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "장치 응답")
public class DeviceResponse {

    @Schema(description = "장치 ID", example = "1")
    private Long deviceId;

    @Schema(description = "장치 시리얼 번호", example = "DDP-2025-001")
    private String serialNumber;

    @Schema(description = "모델명", example = "DDP-X100")
    private String modelName;

    @Schema(description = "제조업체 ID", example = "1")
    private Long manufacturerId;

    @Schema(description = "사용자 ID", example = "123")
    private Long userId;

    @Schema(description = "업체 ID", example = "5")
    private Long companyId;

    @Schema(description = "장치 상태", example = "INSTALLED")
    private DeviceStatus status;

    @Schema(description = "설치일", example = "2025-01-15")
    private LocalDate installDate;

    @Schema(description = "마지막 검·교정일", example = "2025-01-15")
    private LocalDate lastInspectionDate;

    @Schema(description = "다음 검·교정 예정일", example = "2025-07-15")
    private LocalDate nextInspectionDate;

    @Schema(description = "보증 종료일", example = "2026-01-15")
    private LocalDate warrantyEndDate;

    @Schema(description = "생성 일시", example = "2025-01-15T10:30:00")
    private LocalDateTime createdAt;

    @Schema(description = "수정 일시", example = "2025-01-15T10:30:00")
    private LocalDateTime updatedAt;

    // Device 엔티티를 DeviceResponse로 변환
    public static DeviceResponse from(Device device) {
        return DeviceResponse.builder()
                .deviceId(device.getDeviceId())
                .serialNumber(device.getSerialNumber())
                .modelName(device.getModelName())
                .manufacturerId(device.getManufacturerId())
                .userId(device.getUserId())
                .companyId(device.getCompanyId())
                .status(device.getStatus())
                .installDate(device.getInstallDate())
                .lastInspectionDate(device.getLastInspectionDate())
                .nextInspectionDate(device.getNextInspectionDate())
                .warrantyEndDate(device.getWarrantyEndDate())
                .createdAt(device.getCreatedAt())
                .updatedAt(device.getUpdatedAt())
                .build();
    }
}
