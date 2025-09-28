package com.ddp.tcs.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

// 음주운전 위반자 목록 응답 DTO
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
public class DuiSubjectResponse {

    // 조회 성공 여부
    private boolean success;

    // 전체 위반자 수
    private int totalCount;

    // 위반자 목록
    private List<DuiSubject> subjects;

    // 오류 메시지 (조회 실패 시)
    private String errorMessage;

    // 음주운전 위반자 정보
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @Getter
    public static class DuiSubject {
        // 면허번호
        private String licenseNumber;
        
        // 성명
        private String name;
        
        // 생년월일
        private LocalDate birthDate;
        
        // 주소
        private String address;
        
        // 전화번호
        private String phoneNumber;
        
        // 위반 횟수
        private int violationCount;
        
        // 최근 위반일
        private LocalDate lastViolationDate;
    }

    // 성공 응답 생성
    public static DuiSubjectResponse success(List<DuiSubject> subjects) {
        return DuiSubjectResponse.builder()
                .success(true)
                .totalCount(subjects.size())
                .subjects(subjects)
                .build();
    }

    // 실패 응답 생성
    public static DuiSubjectResponse failure(String errorMessage) {
        return DuiSubjectResponse.builder()
                .success(false)
                .errorMessage(errorMessage)
                .build();
    }
}