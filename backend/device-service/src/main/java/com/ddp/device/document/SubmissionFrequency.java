package com.ddp.device.document;

import lombok.Getter;

/**
 * 로그 제출 주기
 */
@Getter
public enum SubmissionFrequency {
    /**
     * 주간 (7일)
     */
    WEEKLY(7),
    
    /**
     * 격주 (14일)
     */
    BIWEEKLY(14),
    
    /**
     * 월간 (30일)
     */
    MONTHLY(30),
    
    /**
     * 분기 (90일)
     */
    QUARTERLY(90);
    
    private final int days;
    
    SubmissionFrequency(int days) {
        this.days = days;
    }
}
