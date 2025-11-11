package com.ddp.device.service;

import com.ddp.device.document.AnomalyType;
import com.ddp.device.document.DrivingLog;
import com.ddp.device.document.LogStatus;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

/**
 * 로그 분석 서비스
 * 운행기록 로그를 분석하여 이상 징후를 탐지
 */
@Service
@Slf4j
public class LogAnalysisService {

    /**
     * 로그 분석 수행
     * @param drivingLog 분석할 로그
     * @param fileSize 파일 크기
     */
    public void analyzeLog(DrivingLog drivingLog, Long fileSize) {
        log.info("로그 분석 시작 - 로그 ID: {}, 장치 ID: {}", drivingLog.getLogId(), drivingLog.getDeviceId());

        // 기본 통계 생성 (실제로는 파일 파싱이 필요하지만, 여기서는 기본값 설정)
        DrivingLog.LogStatistics statistics = createBasicStatistics();
        drivingLog.setStatistics(statistics);

        // 이상 징후 탐지
        AnomalyType anomalyType = detectAnomaly(drivingLog, fileSize, statistics);
        drivingLog.setAnomalyType(anomalyType);

        // 이상 징후가 있으면 FLAGGED 상태로 변경
        if (anomalyType != AnomalyType.NORMAL) {
            drivingLog.setStatus(LogStatus.FLAGGED);
            drivingLog.setAnomalyDetails(getAnomalyDescription(anomalyType));
            log.info("이상 징후 발견 - 로그 ID: {}, 유형: {}", drivingLog.getLogId(), anomalyType);
        } else {
            drivingLog.setStatus(LogStatus.SUBMITTED);
            log.info("로그 정상 - 로그 ID: {}", drivingLog.getLogId());
        }

        // 분석 결과 저장
        StringBuilder analysisResult = new StringBuilder();
        analysisResult.append("자동 분석 완료\n");
        analysisResult.append("총 측정 횟수: ").append(statistics.getTotalTests()).append("\n");
        analysisResult.append("측정 통과: ").append(statistics.getPassedTests()).append("\n");
        analysisResult.append("측정 실패: ").append(statistics.getFailedTests()).append("\n");
        analysisResult.append("이상 징후: ").append(anomalyType).append("\n");

        drivingLog.setAnalysisResult(analysisResult.toString());
    }

    /**
     * 기본 통계 생성 (실제로는 파일 파싱 필요)
     */
    private DrivingLog.LogStatistics createBasicStatistics() {
        // TODO: 실제 파일 파싱 로직 구현
        // 현재는 기본값만 설정
        return DrivingLog.LogStatistics.builder()
                .totalTests(0)
                .passedTests(0)
                .failedTests(0)
                .skippedTests(0)
                .averageBAC(0.0)
                .maxBAC(0.0)
                .tamperingAttempts(0)
                .build();
    }

    /**
     * 이상 징후 탐지
     */
    private AnomalyType detectAnomaly(DrivingLog drivingLog, Long fileSize, DrivingLog.LogStatistics statistics) {
        // 규칙 1: 파일 크기 이상 (너무 작거나 너무 큼)
        if (fileSize < 100) { // 100 bytes 미만
            return AnomalyType.DATA_INCONSISTENCY;
        }

        // 규칙 2: 기간 이상 (미래 날짜 또는 너무 긴 기간)
        LocalDate now = LocalDate.now();
        if (drivingLog.getPeriodEnd().isAfter(now)) {
            return AnomalyType.DATA_INCONSISTENCY;
        }

        long daysBetween = ChronoUnit.DAYS.between(drivingLog.getPeriodStart(), drivingLog.getPeriodEnd());
        if (daysBetween > 60) { // 60일 초과
            return AnomalyType.DATA_INCONSISTENCY;
        }

        // 규칙 3: 조작 시도 횟수 이상
        if (statistics.getTamperingAttempts() != null && statistics.getTamperingAttempts() > 3) {
            return AnomalyType.TAMPERING_ATTEMPT;
        }

        // 규칙 4: 과도한 측정 실패
        if (statistics.getTotalTests() != null && statistics.getFailedTests() != null) {
            if (statistics.getTotalTests() > 0) {
                double failureRate = (double) statistics.getFailedTests() / statistics.getTotalTests();
                if (failureRate > 0.5) { // 50% 이상 실패
                    return AnomalyType.EXCESSIVE_FAILURES;
                }
            }
        }

        // 규칙 5: 측정 횟수가 비정상적으로 적음 (한 달에 최소 30회 이상 측정 필요)
        if (statistics.getTotalTests() != null && daysBetween >= 30) {
            if (statistics.getTotalTests() < 30) {
                return AnomalyType.BYPASS_ATTEMPT;
            }
        }

        // 규칙 6: 평균 BAC가 비정상적으로 높음
        if (statistics.getAverageBAC() != null && statistics.getAverageBAC() > 0.1) {
            return AnomalyType.DEVICE_MALFUNCTION;
        }

        return AnomalyType.NORMAL;
    }

    /**
     * 이상 징후 설명 반환
     */
    private String getAnomalyDescription(AnomalyType type) {
        return switch (type) {
            case TAMPERING_ATTEMPT -> "장치 조작 시도가 감지되었습니다. 관리자 검토가 필요합니다.";
            case BYPASS_ATTEMPT -> "우회 시도 의심. 측정 횟수가 비정상적으로 적습니다.";
            case EXCESSIVE_FAILURES -> "측정 실패율이 비정상적으로 높습니다. 장치 점검이 필요할 수 있습니다.";
            case DEVICE_MALFUNCTION -> "장치 오작동 의심. 비정상적인 측정값이 발견되었습니다.";
            case DATA_INCONSISTENCY -> "데이터 불일치가 발견되었습니다. 파일 내용을 확인해주세요.";
            default -> "";
        };
    }
}
