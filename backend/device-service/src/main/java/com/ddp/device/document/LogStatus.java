package com.ddp.device.document;

/**
 * 운행기록 로그 상태
 */
public enum LogStatus {
    SUBMITTED,      // 제출됨
    UNDER_REVIEW,   // 검토 중
    APPROVED,       // 승인됨
    REJECTED,       // 반려됨
    FLAGGED         // 이상 징후 발견
}
