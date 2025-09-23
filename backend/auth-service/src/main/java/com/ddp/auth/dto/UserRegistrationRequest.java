package com.ddp.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

// 사용자 등록 요청 DTO
public record UserRegistrationRequest(
    // 이메일 주소
    @Email(message = "올바른 이메일 형식이 아닙니다")
    @NotBlank(message = "이메일은 필수입니다")
    String email,
    
    // 비밀번호
    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다")
    String password,
    
    // 사용자 이름
    @NotBlank(message = "이름은 필수입니다")
    @Size(max = 100, message = "이름은 100자를 초과할 수 없습니다")
    String name,
    
    // 전화번호 (선택사항)
    String phone,
    
    // 주소 (선택사항)
    String address
) {}