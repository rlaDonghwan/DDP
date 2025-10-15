package com.ddp.company.dto.response;

import com.ddp.company.entity.ManagedDevice;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 관리 장치 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ManagedDeviceDto {

    private String id;
    private String serialNumber;
    private String modelName;
    private String status;
    private String assignedSubjectName;

    // Entity에서 DTO로 변환하는 정적 팩토리 메서드
    public static ManagedDeviceDto fromEntity(ManagedDevice device) {
        return ManagedDeviceDto.builder()
            .id(String.valueOf(device.getId()))
            .serialNumber(device.getSerialNumber())
            .modelName(device.getModelName())
            .status(device.getStatus())
            .assignedSubjectName(device.getAssignedSubjectName())
            .build();
    }
}
