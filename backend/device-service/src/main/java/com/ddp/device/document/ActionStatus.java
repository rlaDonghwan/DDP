package com.ddp.device.document;

/**
 * 관리자 조치 상태
 */
public enum ActionStatus {
    /**
     * 대기 중
     * 조치가 생성되었으나 아직 실행되지 않음
     */
    PENDING,
    
    /**
     * 진행 중
     * 조치가 실행 중
     */
    IN_PROGRESS,
    
    /**
     * 완료
     * 조치가 성공적으로 완료됨
     */
    COMPLETED,
    
    /**
     * 실패
     * 조치 실행 중 오류 발생
     */
    FAILED,
    
    /**
     * 취소됨
     * 관리자가 조치를 취소함
     */
    CANCELLED
}
