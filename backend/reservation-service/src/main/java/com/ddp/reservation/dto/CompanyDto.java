package com.ddp.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 업체 정보 DTO (company-service에서 가져온 데이터)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompanyDto {

    // 업체 고유 ID
    private String id;

    // 업체명
    private String name;

    // 사업자등록번호
    private String businessNumber;

    // 대표자명
    private String representativeName;

    // 이메일
    private String email;

    // 전화번호
    private String phone;

    // 주소
    private String address;

    // 지역
    private String region;

    // 상태
    private String status;
}
