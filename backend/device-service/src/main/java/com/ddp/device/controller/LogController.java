package com.ddp.device.controller;

import com.ddp.device.dto.log.DrivingLogResponse;
import com.ddp.device.dto.log.ReviewLogRequest;
import com.ddp.device.dto.log.SubmitLogRequest;
import com.ddp.device.service.DrivingLogService;
import com.ddp.device.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * 운행기록 로그 컨트롤러
 */
@RestController
@RequestMapping("/api/v1/logs")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Log", description = "운행기록 로그 관리 API")
public class LogController {

    private final DrivingLogService drivingLogService;
    private final FileStorageService fileStorageService;

    /**
     * 로그 제출 (사용자)
     */
    @PostMapping(value = "/submit", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "운행기록 로그 제출", description = "사용자가 운행기록 로그 파일을 제출합니다")
    public ResponseEntity<DrivingLogResponse> submitLog(
            @Valid @RequestPart("request") SubmitLogRequest request,
            @RequestPart("file") MultipartFile file) {

        log.info("로그 제출 요청 - 사용자 ID: {}, 장치 ID: {}", request.getUserId(), request.getDeviceId());

        DrivingLogResponse response = drivingLogService.submitLog(request, file);
        return ResponseEntity.ok(response);
    }

    /**
     * 로그 상세 조회
     */
    @GetMapping("/{logId}")
    @Operation(summary = "로그 상세 조회", description = "로그 ID로 상세 정보를 조회합니다")
    public ResponseEntity<DrivingLogResponse> getLog(@PathVariable String logId) {
        DrivingLogResponse response = drivingLogService.getLog(logId);
        return ResponseEntity.ok(response);
    }

    /**
     * 장치별 로그 목록 조회
     */
    @GetMapping("/device/{deviceId}")
    @Operation(summary = "장치별 로그 목록 조회", description = "특정 장치의 로그 목록을 조회합니다")
    public ResponseEntity<Page<DrivingLogResponse>> getLogsByDevice(
            @PathVariable Long deviceId,
            @PageableDefault(size = 20, sort = "submitDate", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<DrivingLogResponse> logs = drivingLogService.getLogsByDevice(deviceId, pageable);
        return ResponseEntity.ok(logs);
    }

    /**
     * 사용자별 로그 목록 조회
     */
    @GetMapping("/user/{userId}")
    @Operation(summary = "사용자별 로그 목록 조회", description = "특정 사용자의 로그 목록을 조회합니다")
    public ResponseEntity<Page<DrivingLogResponse>> getLogsByUser(
            @PathVariable Long userId,
            @PageableDefault(size = 20, sort = "submitDate", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<DrivingLogResponse> logs = drivingLogService.getLogsByUser(userId, pageable);
        return ResponseEntity.ok(logs);
    }

    /**
     * 전체 로그 목록 조회 (관리자용)
     */
    @GetMapping("/admin/all")
    @Operation(summary = "전체 로그 목록 조회", description = "관리자가 전체 로그 목록을 조회합니다")
    public ResponseEntity<Page<DrivingLogResponse>> getAllLogs(
            @PageableDefault(size = 20, sort = "submitDate", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<DrivingLogResponse> logs = drivingLogService.getAllLogs(pageable);
        return ResponseEntity.ok(logs);
    }

    /**
     * 이상 징후 로그 목록 조회 (관리자용)
     */
    @GetMapping("/admin/flagged")
    @Operation(summary = "이상 징후 로그 목록 조회", description = "관리자가 이상 징후가 있는 로그 목록을 조회합니다")
    public ResponseEntity<Page<DrivingLogResponse>> getFlaggedLogs(
            @PageableDefault(size = 20, sort = "submitDate", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<DrivingLogResponse> logs = drivingLogService.getFlaggedLogs(pageable);
        return ResponseEntity.ok(logs);
    }

    /**
     * 검토 대기 로그 목록 조회 (관리자용)
     */
    @GetMapping("/admin/pending-review")
    @Operation(summary = "검토 대기 로그 목록 조회", description = "관리자가 검토가 필요한 로그 목록을 조회합니다")
    public ResponseEntity<Page<DrivingLogResponse>> getPendingReviewLogs(
            @PageableDefault(size = 20, sort = "submitDate", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<DrivingLogResponse> logs = drivingLogService.getPendingReviewLogs(pageable);
        return ResponseEntity.ok(logs);
    }

    /**
     * 로그 검토 (관리자용)
     */
    @PatchMapping("/admin/{logId}/review")
    @Operation(summary = "로그 검토", description = "관리자가 로그를 검토하고 승인/반려합니다")
    public ResponseEntity<DrivingLogResponse> reviewLog(
            @PathVariable String logId,
            @Valid @RequestBody ReviewLogRequest request) {

        log.info("로그 검토 요청 - 로그 ID: {}, 검토자 ID: {}", logId, request.getReviewerId());

        DrivingLogResponse response = drivingLogService.reviewLog(logId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * 장치의 최근 로그 조회
     */
    @GetMapping("/device/{deviceId}/latest")
    @Operation(summary = "장치의 최근 로그 조회", description = "장치의 가장 최근 제출된 로그를 조회합니다")
    public ResponseEntity<DrivingLogResponse> getLatestLogByDevice(@PathVariable Long deviceId) {
        DrivingLogResponse response = drivingLogService.getLatestLogByDevice(deviceId);
        if (response == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(response);
    }

    /**
     * 로그 파일 다운로드
     */
    @GetMapping("/{logId}/download")
    @Operation(summary = "로그 파일 다운로드", description = "로그 파일을 다운로드합니다")
    public ResponseEntity<Resource> downloadLogFile(
            @PathVariable String logId,
            @RequestHeader(value = "X-User-Id", required = false) Long userId,
            @RequestHeader(value = "X-User-Role", required = false) String userRole) {

        long startTime = System.currentTimeMillis();
        log.info("API 호출 시작: 로그 파일 다운로드 - logId: {}", logId);

        try {
            // 로그 조회
            DrivingLogResponse drivingLog = drivingLogService.getLog(logId);

            // 권한 검증 (본인 또는 관리자)
            if (userId != null && !drivingLog.getUserId().equals(userId) && !"ADMIN".equals(userRole)) {
                log.warn("로그 파일 다운로드 권한 없음 - userId: {}, logUserId: {}, role: {}",
                        userId, drivingLog.getUserId(), userRole);
                return ResponseEntity.status(403).build();
            }

            // 파일 로드
            Resource resource = fileStorageService.loadFileAsResource(drivingLog.getFilePath());

            // Content-Disposition 헤더 설정
            String contentDisposition = "attachment; filename=\"" + drivingLog.getFileName() + "\"";

            long endTime = System.currentTimeMillis();
            log.info("API 호출 완료: 로그 파일 다운로드 ({}ms)", endTime - startTime);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                    .body(resource);

        } catch (Exception e) {
            long endTime = System.currentTimeMillis();
            log.error("API 호출 실패: 로그 파일 다운로드 ({}ms) - {}", endTime - startTime, e.getMessage());
            return ResponseEntity.status(500).build();
        }
    }
}
