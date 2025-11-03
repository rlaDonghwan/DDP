package com.ddp.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

// 사용자 정보 DTO (auth-service에서 가져온 데이터)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDto {

    // 사용자 고유 ID
    private String id;

    // 이메일 주소
    private String email;

    // 사용자 이름
    private String name;

    // 전화번호
    private String phone;

    // 주소
    private String address;
}
