package com.ddp.company.dto.response;

import com.ddp.company.entity.Company;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// 공개용 업체(Operator) 정보 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OperatorDto {

    private String id;
    private String name;
    private String businessNumber;
    private String address;
    private String phone;
    private String email;
    private Double latitude;
    private Double longitude;
    private String businessHours;
    private String certificationStatus;
    private Double rating;
    private Integer reviewCount;
    private List<String> services; // 제공 서비스 목록
    private String description;
    private String createdAt;
    private String updatedAt;
    private Double distance; // 사용자 위치로부터의 거리 (km)

    // Entity에서 DTO로 변환하는 정적 팩토리 메서드
    public static OperatorDto fromEntity(Company company) {
        return OperatorDto.builder()
            .id(String.valueOf(company.getId()))
            .name(company.getName())
            .businessNumber(company.getBusinessNumber())
            .address(company.getAddress())
            .phone(company.getPhone())
            .email(company.getEmail())
            .latitude(company.getLatitude())
            .longitude(company.getLongitude())
            .businessHours(company.getBusinessHours())
            .certificationStatus(mapStatusToString(company.getStatus()))
            .rating(company.getRating())
            .reviewCount(company.getReviewCount())
            .services(List.of("INSTALL", "REPAIR", "INSPECTION")) // 기본값 (추후 확장 가능)
            .description(company.getDescription())
            .createdAt(company.getCreatedAt().toString())
            .updatedAt(company.getUpdatedAt().toString())
            .distance(null) // 거리는 별도로 계산하여 설정
            .build();
    }

    // Entity에서 DTO로 변환 (거리 포함)
    public static OperatorDto fromEntityWithDistance(Company company, Double distance) {
        OperatorDto dto = fromEntity(company);
        dto.setDistance(distance);
        return dto;
    }

    // CompanyStatus를 문자열로 변환
    private static String mapStatusToString(com.ddp.company.entity.CompanyStatus status) {
        return switch (status) {
            case APPROVED -> "APPROVED";
            case PENDING -> "PENDING";
            case REJECTED -> "REJECTED";
            case SUSPENDED -> "SUSPENDED";
        };
    }
}
