package com.ddp.device.document;

/**
 * 이상 징후 유형
 */
public enum AnomalyType {
    NORMAL,                 // 정상
    TAMPERING_ATTEMPT,      // 장치 조작 시도
    BYPASS_ATTEMPT,         // 우회 시도
    EXCESSIVE_FAILURES,     // 과도한 측정 실패
    DEVICE_MALFUNCTION,     // 장치 오작동
    DATA_INCONSISTENCY      // 데이터 불일치
}
