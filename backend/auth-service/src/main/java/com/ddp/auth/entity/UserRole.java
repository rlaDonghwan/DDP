package com.ddp.auth.entity;

// 사용자 역할을 정의하는 ENUM 클래스
public enum UserRole {
    // 일반 사용자 (장치 이용자)
    USER("user", "일반 사용자"),
    
    // 업체 (제조업체/수리업체)
    COMPANY("company", "업체"),
    
    // 관리자 (공단관리자)
    ADMIN("admin", "관리자");

    private final String code;
    private final String description;

    // 생성자
    UserRole(String code, String description) {
        this.code = code;
        this.description = description;
    }

    // 코드 값 반환
    public String getCode() {
        return code;
    }

    // 설명 반환
    public String getDescription() {
        return description;
    }

    // 코드 값으로 UserRole 찾기
    public static UserRole fromCode(String code) {
        for (UserRole role : UserRole.values()) {
            if (role.getCode().equals(code)) {
                return role;
            }
        }
        throw new IllegalArgumentException("유효하지 않은 역할 코드: " + code);
    }

    // 문자열로 UserRole 찾기
    public static UserRole fromString(String value) {
        if (value == null || value.trim().isEmpty()) {
            throw new IllegalArgumentException("역할 값이 null이거나 비어있습니다");
        }
        
        // 대소문자 구분 없이 매칭
        String upperValue = value.toUpperCase();
        
        try {
            return UserRole.valueOf(upperValue);
        } catch (IllegalArgumentException e) {
            // 코드 값으로도 시도
            for (UserRole role : UserRole.values()) {
                if (role.getCode().equalsIgnoreCase(value)) {
                    return role;
                }
            }
            throw new IllegalArgumentException("유효하지 않은 역할: " + value + ". 가능한 값: USER, COMPANY, ADMIN");
        }
    }

    // 기본값 반환 (USER)
    public static UserRole getDefault() {
        return USER;
    }
}