package com.ddp.tcs.entity;

// 운전면허 상태를 정의하는 ENUM
public enum LicenseStatus {
    // 정상 상태
    NORMAL("정상"),
    
    // 취소된 면허
    CANCELED("취소"),
    
    // 정지된 면허
    SUSPENDED("정지"),
    
    // 만료된 면허
    EXPIRED("만료");

    private final String description;

    LicenseStatus(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}