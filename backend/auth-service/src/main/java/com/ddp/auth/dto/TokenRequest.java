package com.ddp.auth.dto;

import jakarta.validation.constraints.NotBlank;

// 토큰 생성 요청 DTO
public record TokenRequest(
    // 사용자 ID
    @NotBlank(message = "사용자 ID는 필수입니다")
    String userId,
    
    // 사용자 이메일
    @NotBlank(message = "이메일은 필수입니다")
    String email,
    
    // 사용자 이름
    @NotBlank(message = "이름은 필수입니다")
    String name
) {}