package com.ddp.device.service;

import com.ddp.device.document.AnomalyType;
import com.ddp.device.document.DrivingLog;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

/**
 * 로그 분석 서비스
 * CSV 파일을 파싱하고 이상 징후를 탐지
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LogAnalysisService {

    @Value("${file.upload.dir:./uploads/logs}")
    private String uploadDir;

    /**
     * CSV 로그 파일 파싱 및 통계 계산
     */
    public DrivingLog.LogStatistics parseLogFile(String filePath) throws IOException {
        long startTime = System.currentTimeMillis();
        log.info("API 호출 시작: 로그 파일 파싱 - {}", filePath);

        Path fullPath = Paths.get(uploadDir, filePath);

        if (!Files.exists(fullPath)) {
            log.error("파일을 찾을 수 없습니다: {}", fullPath);
            throw new IOException("파일을 찾을 수 없습니다: " + filePath);
        }

        try (BufferedReader reader = Files.newBufferedReader(fullPath);
             CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT
                     .withFirstRecordAsHeader()
                     .withIgnoreHeaderCase()
                     .withTrim())) {

            int totalTests = 0;
            int passedTests = 0;
            int failedTests = 0;
            int skippedTests = 0;
            int tamperingAttempts = 0;

            List<Double> bacValues = new ArrayList<>();

            // CSV 레코드 순회
            for (CSVRecord record : csvParser) {
                totalTests++;

                // 측정 결과
                String testResult = record.get("testResult");
                if ("PASS".equalsIgnoreCase(testResult)) {
                    passedTests++;
                } else if ("FAIL".equalsIgnoreCase(testResult)) {
                    failedTests++;
                } else if ("SKIP".equalsIgnoreCase(testResult)) {
                    skippedTests++;
                }

                // 장치 상태
                String deviceStatus = record.get("deviceStatus");
                if ("TAMPERING".equalsIgnoreCase(deviceStatus) || "BYPASS".equalsIgnoreCase(deviceStatus)) {
                    tamperingAttempts++;
                }

                // 알코올 농도
                String alcoholLevelStr = record.get("alcoholLevel");
                try {
                    double alcoholLevel = Double.parseDouble(alcoholLevelStr);
                    bacValues.add(alcoholLevel);
                } catch (NumberFormatException e) {
                    log.warn("알코올 농도 파싱 실패: {}", alcoholLevelStr);
                }
            }

            // 평균 BAC 계산
            double averageBAC = bacValues.isEmpty() ? 0.0 :
                    bacValues.stream()
                            .mapToDouble(Double::doubleValue)
                            .average()
                            .orElse(0.0);

            // 최대 BAC
            double maxBAC = bacValues.stream()
                    .max(Double::compareTo)
                    .orElse(0.0);

            DrivingLog.LogStatistics statistics = DrivingLog.LogStatistics.builder()
                    .totalTests(totalTests)
                    .passedTests(passedTests)
                    .failedTests(failedTests)
                    .skippedTests(skippedTests)
                    .averageBAC(BigDecimal.valueOf(averageBAC).setScale(4, RoundingMode.HALF_UP).doubleValue())
                    .maxBAC(BigDecimal.valueOf(maxBAC).setScale(4, RoundingMode.HALF_UP).doubleValue())
                    .tamperingAttempts(tamperingAttempts)
                    .build();

            long endTime = System.currentTimeMillis();
            log.info("API 호출 완료: 로그 파일 파싱 ({}ms) - 총 {}개 레코드", endTime - startTime, totalTests);

            return statistics;

        } catch (Exception e) {
            long endTime = System.currentTimeMillis();
            log.error("API 호출 실패: 로그 파일 파싱 ({}ms) - {}", endTime - startTime, e.getMessage());
            throw new IOException("로그 파일 파싱 중 오류 발생: " + e.getMessage(), e);
        }
    }

    /**
     * 로그 자동 분석 및 이상 징후 탐지
     */
    public AnomalyType detectAnomalies(
            DrivingLog.LogStatistics statistics,
            LocalDate periodStart,
            LocalDate periodEnd,
            long fileSize
    ) {
        long startTime = System.currentTimeMillis();
        log.info("API 호출 시작: 이상 징후 탐지");

        try {
            // 1. 조작 시도 탐지 (3회 이상)
            if (statistics.getTamperingAttempts() != null && statistics.getTamperingAttempts() >= 3) {
                log.warn("[경고] 조작 시도 탐지: {}회", statistics.getTamperingAttempts());
                return AnomalyType.TAMPERING_ATTEMPT;
            }

            // 2. 과도한 실패율 (50% 이상)
            if (statistics.getTotalTests() != null && statistics.getTotalTests() > 0) {
                double failureRate = (double) statistics.getFailedTests() / statistics.getTotalTests();
                if (failureRate >= 0.5) {
                    log.warn("[경고] 과도한 실패율: {}", String.format("%.2f%%", failureRate * 100));
                    return AnomalyType.EXCESSIVE_FAILURES;
                }
            }

            // 3. 측정 횟수 부족 (한 달에 30회 미만)
            long daysBetween = ChronoUnit.DAYS.between(periodStart, periodEnd) + 1;
            int minimumTests = (int) daysBetween; // 하루 1회 최소

            if (statistics.getTotalTests() != null && statistics.getTotalTests() < minimumTests) {
                log.warn("[경고] 측정 횟수 부족: {}회 (최소 {}회)", statistics.getTotalTests(), minimumTests);
                return AnomalyType.DATA_INCONSISTENCY;
            }

            // 4. 파일 크기 이상 (100 bytes 미만)
            if (fileSize < 100) {
                log.warn("[경고] 파일 크기 이상: {}bytes", fileSize);
                return AnomalyType.DATA_INCONSISTENCY;
            }

            // 5. 기간 이상 (60일 초과)
            if (daysBetween > 60) {
                log.warn("[경고] 기간 이상: {}일", daysBetween);
                return AnomalyType.DATA_INCONSISTENCY;
            }

            // 6. 평균 BAC 비정상 (0.1 이상)
            if (statistics.getAverageBAC() != null && statistics.getAverageBAC() > 0.1) {
                log.warn("[경고] 평균 BAC 비정상: {}", statistics.getAverageBAC());
                return AnomalyType.EXCESSIVE_FAILURES;
            }

            // 정상
            log.info("[정상] 이상 없음");
            return AnomalyType.NORMAL;

        } finally {
            long endTime = System.currentTimeMillis();
            log.info("API 호출 완료: 이상 징후 탐지 ({}ms)", endTime - startTime);
        }
    }

    /**
     * 분석 결과 텍스트 생성
     */
    public String generateAnalysisResult(DrivingLog.LogStatistics statistics, AnomalyType anomalyType) {
        StringBuilder sb = new StringBuilder();
        sb.append("자동 분석 완료\n");
        sb.append(String.format("총 측정 횟수: %d\n", statistics.getTotalTests()));
        sb.append(String.format("통과: %d, 실패: %d, 건너뜀: %d\n",
                statistics.getPassedTests(), statistics.getFailedTests(), statistics.getSkippedTests()));
        sb.append(String.format("평균 BAC: %.4f, 최대 BAC: %.4f\n",
                statistics.getAverageBAC(), statistics.getMaxBAC()));

        if (statistics.getTamperingAttempts() != null && statistics.getTamperingAttempts() > 0) {
            sb.append(String.format("조작 시도: %d회\n", statistics.getTamperingAttempts()));
        }

        // 이상 징후
        if (anomalyType != AnomalyType.NORMAL) {
            sb.append("\n[경고] 이상 징후 발견: ");
            switch (anomalyType) {
                case TAMPERING_ATTEMPT:
                    sb.append("조작 시도 감지");
                    break;
                case BYPASS_ATTEMPT:
                    sb.append("우회 시도 감지");
                    break;
                case EXCESSIVE_FAILURES:
                    sb.append("과도한 실패율");
                    break;
                case DATA_INCONSISTENCY:
                    sb.append("데이터 불일치");
                    break;
                case DEVICE_MALFUNCTION:
                    sb.append("장치 오작동");
                    break;
            }
        } else {
            sb.append("\n[정상] 이상 없음");
        }

        return sb.toString();
    }
}
