package com.ddp.auth.entity;

// 계정 상태 열거형
public enum AccountStatus {
    PENDING,    // 관리자가 생성, 사용자 미완성 (이메일/비밀번호 미설정)
    ACTIVE,     // 사용자가 회원가입 완료, 정상 활성화
    SUSPENDED,  // 정지된 계정
    DELETED,     // 삭제된 계정
    DEACTIVATED
}
