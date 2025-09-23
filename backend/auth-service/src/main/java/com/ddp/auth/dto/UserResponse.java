package com.ddp.auth.dto;

import com.ddp.auth.entity.User;

import java.time.LocalDateTime;

// 사용자 정보 응답 DTO
public record UserResponse(
    // 사용자 ID
    Long userId,
    
    // 이메일 주소
    String email,
    
    // 사용자 이름
    String name,
    
    // 전화번호
    String phone,
    
    // 주소
    String address,
    
    // 생성 시간
    LocalDateTime createdAt,
    
    // 수정 시간
    LocalDateTime updatedAt
) {
    // User 엔티티로부터 UserResponse 생성
    public static UserResponse from(User user) {
        return new UserResponse(
            user.getUserId(),
            user.getEmail(),
            user.getName(),
            user.getPhone(),
            user.getAddress(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}