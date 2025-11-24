package com.ddp.device.dto.log;

import com.ddp.device.document.AnomalyType;
import com.ddp.device.document.DrivingLog;
import com.ddp.device.document.LogStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 운행기록 로그 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DrivingLogResponse {

    private String logId;
    private Long deviceId;
    private Long userId;
    private LocalDateTime submitDate;
    private LocalDate periodStart;
    private LocalDate periodEnd;

    // 파일 정보
    private String fileName;
    private Long fileSize;
    private String fileType;
    private String filePath;

    // 상태 및 분석
    private LogStatus status;
    private AnomalyType anomalyType;
    private String anomalyDetails;
    private String analysisResult;

    // 통계 정보
    private LogStatisticsResponse statistics;

    // 검토 정보
    private Long reviewedBy;
    private LocalDateTime reviewedAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * DrivingLog 엔티티를 DTO로 변환
     */
    public static DrivingLogResponse from(DrivingLog log) {
        DrivingLogResponseBuilder builder = DrivingLogResponse.builder()
                .logId(log.getLogId())
                .deviceId(log.getDeviceId())
                .userId(log.getUserId())
                .submitDate(log.getSubmitDate())
                .periodStart(log.getPeriodStart())
                .periodEnd(log.getPeriodEnd())
                .fileName(log.getFileName())
                .fileSize(log.getFileSize())
                .fileType(log.getFileType())
                .filePath(log.getFilePath())
                .status(log.getStatus())
                .anomalyType(log.getAnomalyType())
                .anomalyDetails(log.getAnomalyDetails())
                .analysisResult(log.getAnalysisResult())
                .reviewedBy(log.getReviewedBy())
                .reviewedAt(log.getReviewedAt())
                .createdAt(log.getCreatedAt())
                .updatedAt(log.getUpdatedAt());

        // 통계 정보가 있으면 변환
        if (log.getStatistics() != null) {
            builder.statistics(LogStatisticsResponse.from(log.getStatistics()));
        }

        return builder.build();
    }

    /**
     * 로그 통계 응답 DTO
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LogStatisticsResponse {
        private Integer totalTests;
        private Integer passedTests;
        private Integer failedTests;
        private Integer skippedTests;
        private Double averageBAC;
        private Double maxBAC;
        private Integer tamperingAttempts;

        public static LogStatisticsResponse from(DrivingLog.LogStatistics stats) {
            return LogStatisticsResponse.builder()
                    .totalTests(stats.getTotalTests())
                    .passedTests(stats.getPassedTests())
                    .failedTests(stats.getFailedTests())
                    .skippedTests(stats.getSkippedTests())
                    .averageBAC(stats.getAverageBAC())
                    .maxBAC(stats.getMaxBAC())
                    .tamperingAttempts(stats.getTamperingAttempts())
                    .build();
        }
    }
}
