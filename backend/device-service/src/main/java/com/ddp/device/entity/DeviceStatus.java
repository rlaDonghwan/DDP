package com.ddp.device.entity;

// 장치 상태 Enum
public enum DeviceStatus {
    AVAILABLE,          // 사용 가능 (재고)
    INSTALLED,          // 설치됨
    UNDER_MAINTENANCE,  // 정비 중
    DEACTIVATED        // 사용 중지
}
