package com.ddp.company.dto.response;

import com.ddp.company.entity.Customer;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 고객 정보 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerDto {

    private String id;
    private String name;
    private String phone;
    private String deviceSerialNumber;
    private String lastServiceDate;

    // Entity에서 DTO로 변환하는 정적 팩토리 메서드
    public static CustomerDto fromEntity(Customer customer) {
        return CustomerDto.builder()
            .id(String.valueOf(customer.getId()))
            .name(customer.getName())
            .phone(customer.getPhone())
            .deviceSerialNumber(customer.getDeviceSerialNumber())
            .lastServiceDate(customer.getLastServiceDate() != null ? customer.getLastServiceDate().toString() : null)
            .build();
    }
}
