package com.ddp.company.controller;

import com.ddp.company.dto.request.CreateServiceRecordRequest;
import com.ddp.company.dto.response.ServiceRecordDto;
import com.ddp.company.service.ServiceRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 서비스 이력 관리 컨트롤러
 */
@RestController
@RequestMapping("/api/v1/company/service-records")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "ServiceRecord", description = "서비스 이력 API")
public class ServiceRecordController {

    private final ServiceRecordService serviceRecordService;

    /**
     * 서비스 이력 생성 (내부 API - Reservation Service에서 호출)
     */
    @PostMapping
    @Operation(summary = "서비스 이력 생성", description = "새로운 서비스 이력을 생성합니다 (내부 API)")
    public ResponseEntity<ServiceRecordDto> createServiceRecord(
            @Valid @RequestBody CreateServiceRecordRequest request
    ) {
        log.info("서비스 이력 생성 요청 - 업체 ID: {}, 타입: {}", request.getCompanyId(), request.getType());

        try {
            ServiceRecordDto response = serviceRecordService.createServiceRecord(request);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.error("서비스 이력 생성 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("서비스 이력 생성 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * 업체의 서비스 이력 목록 조회
     */
    @GetMapping("/company/{companyId}")
    @Operation(summary = "업체 서비스 이력 조회", description = "업체의 모든 서비스 이력을 조회합니다")
    public ResponseEntity<List<ServiceRecordDto>> getCompanyServiceRecords(
            @PathVariable Long companyId
    ) {
        log.info("업체 서비스 이력 조회 - 업체 ID: {}", companyId);

        try {
            List<ServiceRecordDto> records = serviceRecordService.getCompanyServiceRecords(companyId);
            return ResponseEntity.ok(records);

        } catch (Exception e) {
            log.error("업체 서비스 이력 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * 서비스 이력 상세 조회
     */
    @GetMapping("/{id}")
    @Operation(summary = "서비스 이력 상세 조회", description = "서비스 이력 상세 정보를 조회합니다")
    public ResponseEntity<ServiceRecordDto> getServiceRecord(
            @PathVariable Long id
    ) {
        log.info("서비스 이력 상세 조회 - 이력 ID: {}", id);

        try {
            ServiceRecordDto record = serviceRecordService.getServiceRecord(id);
            return ResponseEntity.ok(record);

        } catch (IllegalArgumentException e) {
            log.error("서비스 이력 조회 실패: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("서비스 이력 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * 전체 서비스 이력 조회 (관리자용)
     */
    @GetMapping("/admin/all")
    @Operation(summary = "전체 서비스 이력 조회", description = "모든 서비스 이력을 조회합니다 (관리자용)")
    public ResponseEntity<List<ServiceRecordDto>> getAllServiceRecords() {
        log.info("전체 서비스 이력 조회 (관리자)");

        try {
            List<ServiceRecordDto> records = serviceRecordService.getAllServiceRecords();
            return ResponseEntity.ok(records);

        } catch (Exception e) {
            log.error("전체 서비스 이력 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * 사용자별 서비스 이력 조회
     */
    @GetMapping("/user/{subjectId}")
    @Operation(summary = "사용자 서비스 이력 조회", description = "특정 사용자의 서비스 이력을 조회합니다")
    public ResponseEntity<List<ServiceRecordDto>> getUserServiceRecords(
            @PathVariable String subjectId
    ) {
        log.info("사용자 서비스 이력 조회 - 사용자 ID: {}", subjectId);

        try {
            List<ServiceRecordDto> records = serviceRecordService.getUserServiceRecords(subjectId);
            return ResponseEntity.ok(records);

        } catch (Exception e) {
            log.error("사용자 서비스 이력 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * 장치별 서비스 이력 조회
     */
    @GetMapping("/device/{deviceId}")
    @Operation(summary = "장치 서비스 이력 조회", description = "특정 장치의 서비스 이력을 조회합니다")
    public ResponseEntity<List<ServiceRecordDto>> getDeviceServiceRecords(
            @PathVariable String deviceId
    ) {
        log.info("장치 서비스 이력 조회 - 장치 ID: {}", deviceId);

        try {
            List<ServiceRecordDto> records = serviceRecordService.getDeviceServiceRecords(deviceId);
            return ResponseEntity.ok(records);

        } catch (Exception e) {
            log.error("장치 서비스 이력 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }
}
