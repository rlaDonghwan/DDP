package com.ddp.device.service;

import com.ddp.device.document.AnomalyType;
import com.ddp.device.document.DrivingLog;
import com.ddp.device.document.LogStatus;
import com.ddp.device.dto.log.DrivingLogResponse;
import com.ddp.device.dto.log.ReviewLogRequest;
import com.ddp.device.dto.log.SubmitLogRequest;
import com.ddp.device.repository.mongo.DrivingLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

/**
 * 운행기록 로그 서비스
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class DrivingLogService {

    private final DrivingLogRepository drivingLogRepository;
    private final FileStorageService fileStorageService;
    private final LogAnalysisService logAnalysisService;

    /**
     * 로그 제출
     * @param request 로그 제출 요청
     * @param file 로그 파일
     * @return 생성된 로그 응답
     */
    public DrivingLogResponse submitLog(SubmitLogRequest request, MultipartFile file) {
        log.info("API 호출 시작: 로그 제출 - 사용자 ID: {}, 장치 ID: {}",
                request.getUserId(), request.getDeviceId());

        long startTime = System.currentTimeMillis();

        try {
            // 파일 검증
            if (file == null || file.isEmpty()) {
                throw new IllegalArgumentException("로그 파일은 필수입니다");
            }

            // 파일 저장
            String filePath = fileStorageService.storeFile(file, request.getDeviceId(), request.getUserId());

            // CSV 파일 파싱 및 통계 계산
            DrivingLog.LogStatistics statistics;
            try {
                statistics = logAnalysisService.parseLogFile(filePath);
            } catch (Exception e) {
                log.warn("CSV 파일 파싱 실패, 기본 통계 사용: {}", e.getMessage());
                statistics = DrivingLog.LogStatistics.builder()
                        .totalTests(0)
                        .passedTests(0)
                        .failedTests(0)
                        .skippedTests(0)
                        .averageBAC(0.0)
                        .maxBAC(0.0)
                        .tamperingAttempts(0)
                        .build();
            }

            // 이상 징후 탐지
            AnomalyType anomalyType = logAnalysisService.detectAnomalies(
                    statistics,
                    request.getPeriodStart(),
                    request.getPeriodEnd(),
                    file.getSize()
            );

            // 위험도 평가
            com.ddp.device.document.RiskLevel riskLevel = logAnalysisService.assessRiskLevel(
                    anomalyType,
                    statistics
            );

            // 분석 결과 텍스트 생성
            String analysisResult = logAnalysisService.generateAnalysisResult(statistics, anomalyType);

            // 상태 결정 (이상 징후 있으면 FLAGGED)
            LogStatus status = (anomalyType != AnomalyType.NORMAL) ?
                    LogStatus.FLAGGED : LogStatus.SUBMITTED;

            // DrivingLog 엔티티 생성
            DrivingLog drivingLog = DrivingLog.builder()
                    .deviceId(request.getDeviceId())
                    .userId(request.getUserId())
                    .submitDate(LocalDateTime.now())
                    .periodStart(request.getPeriodStart())
                    .periodEnd(request.getPeriodEnd())
                    .filePath(filePath)
                    .fileSize(file.getSize())
                    .fileName(file.getOriginalFilename())
                    .fileType(file.getContentType())
                    .status(status)
                    .anomalyType(anomalyType)
                    .riskLevel(riskLevel) // 위험도 추가
                    .statistics(statistics)
                    .analysisResult(analysisResult)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();

            // MongoDB에 저장
            DrivingLog savedLog = drivingLogRepository.save(drivingLog);

            log.info("API 호출 완료: 로그 제출 - 로그 ID: {}, 상태: {} ({}ms)",
                    savedLog.getLogId(), savedLog.getStatus(), System.currentTimeMillis() - startTime);

            return DrivingLogResponse.from(savedLog);

        } catch (IllegalArgumentException e) {
            log.error("로그 제출 실패: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("로그 제출 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("로그 제출에 실패했습니다", e);
        }
    }

    /**
     * 로그 상세 조회
     */
    @Transactional(readOnly = true)
    public DrivingLogResponse getLog(String logId) {
        log.info("API 호출 시작: 로그 조회 - 로그 ID: {}", logId);

        long startTime = System.currentTimeMillis();

        DrivingLog drivingLog = drivingLogRepository.findById(logId)
                .orElseThrow(() -> new IllegalArgumentException("로그를 찾을 수 없습니다: " + logId));

        log.info("API 호출 완료: 로그 조회 ({}ms)", System.currentTimeMillis() - startTime);

        return DrivingLogResponse.from(drivingLog);
    }

    /**
     * 장치별 로그 목록 조회
     */
    @Transactional(readOnly = true)
    public Page<DrivingLogResponse> getLogsByDevice(Long deviceId, Pageable pageable) {
        log.info("API 호출 시작: 장치별 로그 목록 조회 - 장치 ID: {}", deviceId);

        long startTime = System.currentTimeMillis();

        Page<DrivingLog> logs = drivingLogRepository.findByDeviceId(deviceId, pageable);

        log.info("API 호출 완료: 장치별 로그 목록 조회 - {} 건 ({}ms)",
                logs.getTotalElements(), System.currentTimeMillis() - startTime);

        return logs.map(DrivingLogResponse::from);
    }

    /**
     * 사용자별 로그 목록 조회
     */
    @Transactional(readOnly = true)
    public Page<DrivingLogResponse> getLogsByUser(Long userId, Pageable pageable) {
        log.info("API 호출 시작: 사용자별 로그 목록 조회 - 사용자 ID: {}", userId);

        long startTime = System.currentTimeMillis();

        Page<DrivingLog> logs = drivingLogRepository.findByUserId(userId, pageable);

        log.info("API 호출 완료: 사용자별 로그 목록 조회 - {} 건 ({}ms)",
                logs.getTotalElements(), System.currentTimeMillis() - startTime);

        return logs.map(DrivingLogResponse::from);
    }

    /**
     * 전체 로그 목록 조회 (관리자용)
     */
    @Transactional(readOnly = true)
    public Page<DrivingLogResponse> getAllLogs(Pageable pageable) {
        log.info("API 호출 시작: 전체 로그 목록 조회 (관리자)");

        long startTime = System.currentTimeMillis();

        Page<DrivingLog> logs = drivingLogRepository.findAll(pageable);

        log.info("API 호출 완료: 전체 로그 목록 조회 - {} 건 ({}ms)",
                logs.getTotalElements(), System.currentTimeMillis() - startTime);

        return logs.map(DrivingLogResponse::from);
    }

    /**
     * 이상 징후 로그 목록 조회 (관리자용)
     */
    @Transactional(readOnly = true)
    public Page<DrivingLogResponse> getFlaggedLogs(Pageable pageable) {
        log.info("API 호출 시작: 이상 징후 로그 목록 조회");

        long startTime = System.currentTimeMillis();

        Page<DrivingLog> logs = drivingLogRepository.findByAnomalyTypeNot(AnomalyType.NORMAL, pageable);

        log.info("API 호출 완료: 이상 징후 로그 목록 조회 - {} 건 ({}ms)",
                logs.getTotalElements(), System.currentTimeMillis() - startTime);

        return logs.map(DrivingLogResponse::from);
    }

    /**
     * 검토 대기 중인 로그 목록 조회 (관리자용)
     */
    @Transactional(readOnly = true)
    public Page<DrivingLogResponse> getPendingReviewLogs(Pageable pageable) {
        log.info("API 호출 시작: 검토 대기 로그 목록 조회");

        long startTime = System.currentTimeMillis();

        List<LogStatus> pendingStatuses = Arrays.asList(LogStatus.FLAGGED, LogStatus.UNDER_REVIEW);
        Page<DrivingLog> logs = drivingLogRepository.findByStatusIn(pendingStatuses, pageable);

        log.info("API 호출 완료: 검토 대기 로그 목록 조회 - {} 건 ({}ms)",
                logs.getTotalElements(), System.currentTimeMillis() - startTime);

        return logs.map(DrivingLogResponse::from);
    }

    /**
     * 로그 검토 (관리자용)
     */
    public DrivingLogResponse reviewLog(String logId, ReviewLogRequest request) {
        log.info("API 호출 시작: 로그 검토 - 로그 ID: {}, 검토자 ID: {}",
                logId, request.getReviewerId());

        long startTime = System.currentTimeMillis();

        try {
            DrivingLog drivingLog = drivingLogRepository.findById(logId)
                    .orElseThrow(() -> new IllegalArgumentException("로그를 찾을 수 없습니다: " + logId));

            // 검토 정보 업데이트
            drivingLog.setStatus(request.getStatus());
            drivingLog.setReviewedBy(request.getReviewerId());
            drivingLog.setReviewedAt(LocalDateTime.now());
            drivingLog.setReviewNotes(request.getReviewNotes());
            drivingLog.setUpdatedAt(LocalDateTime.now());

            DrivingLog savedLog = drivingLogRepository.save(drivingLog);

            log.info("API 호출 완료: 로그 검토 - 로그 ID: {}, 상태: {} ({}ms)",
                    logId, request.getStatus(), System.currentTimeMillis() - startTime);

            return DrivingLogResponse.from(savedLog);

        } catch (IllegalArgumentException e) {
            log.error("로그 검토 실패: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("로그 검토 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("로그 검토에 실패했습니다", e);
        }
    }

    /**
     * 장치의 최근 로그 조회
     */
    @Transactional(readOnly = true)
    public DrivingLogResponse getLatestLogByDevice(Long deviceId) {
        log.debug("장치의 최근 로그 조회 - 장치 ID: {}", deviceId);

        DrivingLog latestLog = drivingLogRepository.findFirstByDeviceIdOrderBySubmitDateDesc(deviceId);

        if (latestLog == null) {
            return null;
        }

        return DrivingLogResponse.from(latestLog);
    }

    /**
     * 장치의 로그 개수 조회
     */
    @Transactional(readOnly = true)
    public long countLogsByDevice(Long deviceId) {
        return drivingLogRepository.countByDeviceId(deviceId);
    }
}
