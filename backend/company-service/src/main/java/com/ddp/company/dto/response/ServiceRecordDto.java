package com.ddp.company.dto.response;

import com.ddp.company.entity.ServiceRecord;
import com.ddp.company.entity.ServiceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

// 서비스 이력 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceRecordDto {

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

    // Entity에서 DTO로 변환하는 정적 팩토리 메서드
    public static ServiceRecordDto fromEntity(ServiceRecord record) {
        return ServiceRecordDto.builder()
            .id(String.valueOf(record.getId()))
            .type(mapTypeToString(record.getType()))
            .subjectId(record.getSubjectId())
            .subjectName(record.getSubjectName())
            .deviceId(record.getDeviceId())
            .deviceSerialNumber(record.getDeviceSerialNumber())
            .description(record.getDescription())
            .performedAt(record.getPerformedAt().toString())
            .performedBy(record.getPerformedBy())
            .cost(record.getCost())
            .build();
    }

    // ServiceType Enum을 프론트엔드 문자열로 변환
    private static String mapTypeToString(ServiceType type) {
        return switch (type) {
            case INSTALLATION -> "installation";
            case REPAIR -> "repair";
            case INSPECTION -> "inspection";
            case MAINTENANCE -> "maintenance";
        };
    }
}
