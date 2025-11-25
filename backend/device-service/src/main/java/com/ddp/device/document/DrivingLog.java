package com.ddp.device.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 운행기록 로그 문서 (MongoDB)
 * 음주운전 방지장치의 운행 기록 및 측정 데이터를 저장
 */
@Document(collection = "driving_logs")
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class DrivingLog {

    @Id
    private String logId; // MongoDB ObjectId

    @Indexed
    private Long deviceId; // 장치 ID (Device 테이블 참조)

    @Indexed
    private Long userId; // 사용자 ID

    @Indexed
    private LocalDateTime submitDate; // 제출일시

    private LocalDate periodStart; // 운행기록 시작일
    private LocalDate periodEnd; // 운행기록 종료일

    // 파일 정보
    private String filePath; // 파일 저장 경로 (S3/MinIO)
    private Long fileSize; // 파일 크기 (bytes)
    private String fileName; // 원본 파일명
    private String fileType; // 파일 타입 (예: application/octet-stream)

    // 로그 상태 및 분석 결과
    @Indexed
    private LogStatus status; // 로그 상태

    private String analysisResult; // 분석 결과 상세 (JSON 또는 텍스트)

    @Indexed
    private AnomalyType anomalyType; // 이상 징후 유형

    @Indexed
    private RiskLevel riskLevel; // 위험도 등급 (HIGH/MEDIUM/LOW)

    private String anomalyDetails; // 이상 징후 상세 설명

    // 검토 정보
    private Long reviewedBy; // 검토자 ID (관리자)
    private LocalDateTime reviewedAt; // 검토일시
    private String reviewNotes; // 검토 메모
    
    // 조치 정보
    private Boolean actionTaken; // 조치 취해짐 여부
    private String actionId; // 관련 조치 ID


    // 메타데이터
    private LocalDateTime createdAt; // 생성일시
    private LocalDateTime updatedAt; // 수정일시

    // 통계 정보 (로그 분석 시 추출)
    private LogStatistics statistics;

    /**
     * 로그 통계 정보 (내장 문서)
     */
    @Getter
    @Setter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LogStatistics {
        private Integer totalTests; // 총 측정 횟수
        private Integer passedTests; // 측정 통과 횟수
        private Integer failedTests; // 측정 실패 횟수
        private Integer skippedTests; // 측정 건너뛴 횟수
        private Double averageBAC; // 평균 혈중알코올농도
        private Double maxBAC; // 최대 혈중알코올농도
        private Integer tamperingAttempts; // 조작 시도 횟수
    }
}
