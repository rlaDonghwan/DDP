package com.ddp.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

// JWT 토큰에서 추출한 사용자 정보 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JwtUserInfo {

    // 사용자 ID
    private Long userId;

    // 사용자 이메일
    private String email;

    // 사용자 이름
    private String name;

    // 사용자 역할
    private String role;

    // 업체 ID (COMPANY 역할 전용)
    private Long companyId;

    // JWT ID (블랙리스트용)
    private String jti;

    // 토큰 발급 시간
    private Date issuedAt;

    // 토큰 만료 시간
    private Date expiration;
}
