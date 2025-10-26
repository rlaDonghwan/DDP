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
    private String certificationStatus;
    private Double rating;
    private List<String> services; // 제공 서비스 목록
    private String createdAt;
    private String updatedAt;

    // Entity에서 DTO로 변환하는 정적 팩토리 메서드
    public static OperatorDto fromEntity(Company company) {
        return OperatorDto.builder()
            .id(String.valueOf(company.getId()))
            .name(company.getName())
            .businessNumber(company.getBusinessNumber())
            .address(company.getAddress())
            .phone(company.getPhone())
            .email(company.getEmail())
            .certificationStatus(mapStatusToString(company.getStatus()))
            .rating(company.getRating())
            .services(List.of("INSTALL", "REPAIR", "INSPECTION")) // 기본값 (추후 확장 가능)
            .createdAt(company.getCreatedAt().toString())
            .updatedAt(company.getUpdatedAt().toString())
            .build();
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
