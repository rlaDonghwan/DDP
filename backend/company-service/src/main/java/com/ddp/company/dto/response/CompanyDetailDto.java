package com.ddp.company.dto.response;

import com.ddp.company.entity.Company;
import com.ddp.company.entity.CompanyStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.stream.Collectors;

// 업체 상세 정보 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyDetailDto {

    private String id;
    private String name;
    private String businessNumber;
    private String representativeName;
    private String email;
    private String phone;
    private String address;
    private String region;
    private String status;
    private String approvedAt;
    private String rejectedReason;
    private Integer deviceCount;
    private Integer customerCount;
    private String createdAt;
    private String updatedAt;
    private List<ServiceRecordDto> serviceHistory;
    private List<ManagedDeviceDto> managedDevices;
    private List<CustomerDto> customers;

    // Entity에서 DTO로 변환하는 정적 팩토리 메서드
    public static CompanyDetailDto fromEntity(Company company) {
        return CompanyDetailDto.builder()
            .id(String.valueOf(company.getId()))
            .name(company.getName())
            .businessNumber(company.getBusinessNumber())
            .representativeName(company.getRepresentativeName())
            .email(company.getEmail())
            .phone(company.getPhone())
            .address(company.getAddress())
            .region(company.getRegion())
            .status(mapStatusToString(company.getStatus()))
            .approvedAt(company.getApprovedAt() != null ? company.getApprovedAt().toString() : null)
            .rejectedReason(company.getRejectedReason())
            .deviceCount(company.getDeviceCount())
            .customerCount(company.getCustomerCount())
            .createdAt(company.getCreatedAt().toString())
            .updatedAt(company.getUpdatedAt().toString())
            .serviceHistory(company.getServiceHistory().stream()
                .map(ServiceRecordDto::fromEntity)
                .collect(Collectors.toList()))
            .managedDevices(company.getManagedDevices().stream()
                .map(ManagedDeviceDto::fromEntity)
                .collect(Collectors.toList()))
            .customers(company.getCustomers().stream()
                .map(CustomerDto::fromEntity)
                .collect(Collectors.toList()))
            .build();
    }

    // CompanyStatus Enum을 프론트엔드 문자열로 변환
    private static String mapStatusToString(CompanyStatus status) {
        return switch (status) {
            case APPROVED -> "approved";
            case PENDING -> "pending";
            case REJECTED -> "rejected";
            case SUSPENDED -> "suspended";
        };
    }
}
