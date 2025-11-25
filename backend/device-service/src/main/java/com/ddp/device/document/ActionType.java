package com.ddp.device.document;

/**
 * 관리자 조치 유형
 * 이상 징후 발생 시 관리자가 취할 수 있는 조치 유형
 */
public enum ActionType {
    // 경고 조치
    /**
     * 경고 통보
     * 사용자 대시보드에 표시
     */
    WARNING_NOTIFICATION,
    
    // 추가 요구 조치
    /**
     * 추가 검사 요구
     * 장치 이상 징후 발생 시
     */
    ADDITIONAL_INSPECTION_REQUIRED,
    
    /**
     * 교육 이수 명령
     * 음주 측정 실패 반복 시
     */
    EDUCATION_REQUIRED,
    
    /**
     * 로그 제출 주기 변경
     * 제출 지연 반복 시
     */
    LOG_SUBMISSION_FREQUENCY_CHANGE,
    
    // 긴급 조치
    /**
     * 장치 재설치 명령
     * 장치 오작동 또는 탈거 시
     */
    DEVICE_REINSTALLATION_REQUIRED,
    
    /**
     * 긴급 연락 필요
     * 사용자 대시보드에 표시
     */
    EMERGENCY_CONTACT,
    
    // 면허 관련 조치 (TCS 연동)
    /**
     * 면허 상태 변경
     * TCS 연동 필요
     */
    LICENSE_STATUS_CHANGE,
    
    /**
     * 면허 정지
     * TCS 연동 필요
     */
    LICENSE_SUSPENSION,
    
    /**
     * 면허 취소
     * TCS 연동 필요
     */
    LICENSE_REVOCATION,
    
    // 법적 조치
    /**
     * 법적 조치 검토
     * 중대한 위반 사항 발생 시
     */
    LEGAL_ACTION_REVIEW,
    
    /**
     * 경찰 신고
     * 범죄 혐의 발견 시
     */
    POLICE_REPORT
}
