package com.ddp.device.controller;

import com.ddp.device.dto.request.RegisterDeviceRequest;
import com.ddp.device.dto.request.RegisterInspectionRequest;
import com.ddp.device.dto.request.RegisterRepairRequest;
import com.ddp.device.dto.response.DeviceResponse;
import com.ddp.device.dto.response.DeviceWithLogStatsResponse;
import com.ddp.device.dto.response.InspectionRecordResponse;
import com.ddp.device.dto.response.RepairRecordResponse;
import com.ddp.device.entity.Device;
import com.ddp.device.service.DeviceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

// 장치 컨트롤러
@RestController
@RequestMapping("/api/v1/devices")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Device", description = "장치 API")
public class DeviceController {

    private final DeviceService deviceService;

    // 장치 등록 (예약 완료 시 호출)
    @PostMapping
    @Operation(summary = "장치 등록", description = "새로운 장치를 등록합니다 (예약 완료 시 자동 호출)")
    public ResponseEntity<DeviceResponse> registerDevice(
            @Valid @RequestBody RegisterDeviceRequest request
    ) {
        log.info("장치 등록 요청 - 시리얼 번호: {}", request.getSerialNumber());

        try {
            // 장치 등록
            Device device = deviceService.registerDevice(request);

            // 응답 변환
            DeviceResponse response = DeviceResponse.from(device);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.error("장치 등록 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("장치 등록 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    // 장치 상세 조회
    @GetMapping("/{id}")
    @Operation(summary = "장치 상세 조회", description = "장치 ID로 장치 상세 정보를 조회합니다")
    public ResponseEntity<DeviceResponse> getDevice(
            @PathVariable Long id
    ) {
        log.info("장치 상세 조회 - 장치 ID: {}", id);

        try {
            Device device = deviceService.findById(id)
                    .orElse(null);

            if (device == null) {
                log.warn("장치를 찾을 수 없음: {}", id);
                return ResponseEntity.notFound().build();
            }

            DeviceResponse response = DeviceResponse.from(device);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("장치 상세 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    // 사용자의 장치 목록 조회
    @GetMapping("/user/{userId}")
    @Operation(summary = "사용자 장치 목록 조회", description = "사용자 ID로 장치 목록을 조회합니다")
    public ResponseEntity<List<DeviceResponse>> getUserDevices(
            @PathVariable Long userId
    ) {
        log.info("사용자 장치 목록 조회 - 사용자 ID: {}", userId);

        try {
            List<Device> devices = deviceService.findByUserId(userId);

            List<DeviceResponse> responses = devices.stream()
                    .map(DeviceResponse::from)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(responses);

        } catch (Exception e) {
            log.error("사용자 장치 목록 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    // 업체의 장치 목록 조회
    @GetMapping("/company/{companyId}")
    @Operation(summary = "업체 장치 목록 조회", description = "업체 ID로 장치 목록을 조회합니다")
    public ResponseEntity<List<DeviceResponse>> getCompanyDevices(
            @PathVariable Long companyId
    ) {
        log.info("업체 장치 목록 조회 - 업체 ID: {}", companyId);

        try {
            List<Device> devices = deviceService.findByCompanyId(companyId);

            List<DeviceResponse> responses = devices.stream()
                    .map(DeviceResponse::from)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(responses);

        } catch (Exception e) {
            log.error("업체 장치 목록 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    // 전체 장치 목록 조회 (관리자용)
    @GetMapping
    @Operation(summary = "전체 장치 목록 조회", description = "모든 장치 목록을 조회합니다 (관리자용)")
    public ResponseEntity<List<DeviceResponse>> getAllDevices() {
        log.info("전체 장치 목록 조회 (관리자)");

        try {
            List<Device> devices = deviceService.findAll();

            List<DeviceResponse> responses = devices.stream()
                    .map(DeviceResponse::from)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(responses);

        } catch (Exception e) {
            log.error("전체 장치 목록 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    // 장치 상세 + 로그 통계 조회
    @GetMapping("/{id}/with-stats")
    @Operation(summary = "장치 상세 + 로그 통계 조회", description = "장치 정보와 로그 통계를 함께 조회합니다")
    public ResponseEntity<DeviceWithLogStatsResponse> getDeviceWithStats(
            @PathVariable Long id
    ) {
        log.info("장치 상세 + 로그 통계 조회 - 장치 ID: {}", id);

        try {
            DeviceWithLogStatsResponse response = deviceService.getDeviceWithLogStats(id);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.error("장치 조회 실패: {}", e.getMessage());
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("장치 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }
}
