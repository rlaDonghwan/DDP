package com.ddp.device.service;

import com.ddp.device.document.AnomalyType;
import com.ddp.device.document.DrivingLog;
import com.ddp.device.dto.request.RegisterDeviceRequest;
import com.ddp.device.dto.response.DeviceResponse;
import com.ddp.device.dto.response.DeviceWithLogStatsResponse;
import com.ddp.device.entity.Device;
import com.ddp.device.entity.DeviceStatus;
import com.ddp.device.repository.jpa.DeviceRepository;
import com.ddp.device.repository.mongo.DrivingLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

// 장치 서비스
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final DrivingLogRepository drivingLogRepository;

    // 장치 등록 (예약 완료 시 호출)
    public Device registerDevice(RegisterDeviceRequest request) {
        log.info("API 호출 시작: 장치 등록 - 시리얼 번호: {}", request.getSerialNumber());

        long startTime = System.currentTimeMillis();

        try {
            // 시리얼 번호 중복 확인
            if (deviceRepository.existsBySerialNumber(request.getSerialNumber())) {
                throw new IllegalArgumentException("이미 등록된 시리얼 번호입니다: " + request.getSerialNumber());
            }

            // 장치 엔티티 생성
            Device device = Device.builder()
                    .serialNumber(request.getSerialNumber())
                    .modelName(request.getModelName())
                    .manufacturerId(request.getManufacturerId())
                    .userId(request.getUserId())
                    .companyId(request.getCompanyId())
                    .status(request.getUserId() != null ? DeviceStatus.INSTALLED : DeviceStatus.AVAILABLE)
                    .installDate(request.getInstallDate())
                    .warrantyEndDate(request.getWarrantyEndDate())
                    .build();

            // 설치일이 있고 userId가 있으면 다음 검·교정 예정일 자동 계산 (6개월 후)
            if (request.getInstallDate() != null && request.getUserId() != null) {
                device.setLastInspectionDate(request.getInstallDate());
                device.setNextInspectionDate(request.getInstallDate().plusMonths(6));
            }

            // 장치 저장
            Device savedDevice = deviceRepository.save(device);

            log.info("API 호출 완료: 장치 등록 - 장치 ID: {} ({}ms)",
                    savedDevice.getDeviceId(), System.currentTimeMillis() - startTime);

            return savedDevice;

        } catch (IllegalArgumentException e) {
            log.error("장치 등록 실패: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("장치 등록 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("장치 등록에 실패했습니다.", e);
        }
    }

    // 장치 조회 (ID로)
    @Transactional(readOnly = true)
    public Optional<Device> findById(Long deviceId) {
        log.debug("장치 조회 - 장치 ID: {}", deviceId);
        return deviceRepository.findById(deviceId);
    }

    // 사용자의 장치 목록 조회
    @Transactional(readOnly = true)
    public List<Device> findByUserId(Long userId) {
        log.info("API 호출 시작: 사용자 장치 목록 조회 - 사용자 ID: {}", userId);

        long startTime = System.currentTimeMillis();

        List<Device> devices = deviceRepository.findByUserId(userId);

        log.info("API 호출 완료: 사용자 장치 목록 조회 - {} 건 ({}ms)",
                devices.size(), System.currentTimeMillis() - startTime);

        return devices;
    }

    // 업체의 장치 목록 조회
    @Transactional(readOnly = true)
    public List<Device> findByCompanyId(Long companyId) {
        log.info("API 호출 시작: 업체 장치 목록 조회 - 업체 ID: {}", companyId);

        long startTime = System.currentTimeMillis();

        List<Device> devices = deviceRepository.findByCompanyId(companyId);

        log.info("API 호출 완료: 업체 장치 목록 조회 - {} 건 ({}ms)",
                devices.size(), System.currentTimeMillis() - startTime);

        return devices;
    }

    // 전체 장치 목록 조회 (관리자용)
    @Transactional(readOnly = true)
    public List<Device> findAll() {
        log.info("API 호출 시작: 전체 장치 목록 조회 (관리자)");

        long startTime = System.currentTimeMillis();

        List<Device> devices = deviceRepository.findAll();

        log.info("API 호출 완료: 전체 장치 목록 조회 - {} 건 ({}ms)",
                devices.size(), System.currentTimeMillis() - startTime);

        return devices;
    }

    // 장치 상태 업데이트
    public Device updateStatus(Long deviceId, DeviceStatus newStatus) {
        log.info("API 호출 시작: 장치 상태 업데이트 - 장치 ID: {}, 새 상태: {}", deviceId, newStatus);

        long startTime = System.currentTimeMillis();

        try {
            Device device = deviceRepository.findById(deviceId)
                    .orElseThrow(() -> new IllegalArgumentException("장치를 찾을 수 없습니다: " + deviceId));

            device.setStatus(newStatus);

            Device savedDevice = deviceRepository.save(device);

            log.info("API 호출 완료: 장치 상태 업데이트 - 장치 ID: {} ({}ms)",
                    deviceId, System.currentTimeMillis() - startTime);

            return savedDevice;

        } catch (IllegalArgumentException e) {
            log.error("장치 상태 업데이트 실패: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("장치 상태 업데이트 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("장치 상태 업데이트에 실패했습니다.", e);
        }
    }

    /**
     * 장치 상세 조회 (로그 통계 포함)
     */
    @Transactional(readOnly = true)
    public DeviceWithLogStatsResponse getDeviceWithLogStats(Long deviceId) {
        log.info("API 호출 시작: 장치 상세 + 로그 통계 조회 - 장치 ID: {}", deviceId);

        long startTime = System.currentTimeMillis();

        try {
            // 장치 조회
            Device device = deviceRepository.findById(deviceId)
                    .orElseThrow(() -> new IllegalArgumentException("장치를 찾을 수 없습니다: " + deviceId));

            // 로그 통계 조회
            long totalLogCount = drivingLogRepository.countByDeviceId(deviceId);

            DrivingLog latestLog = drivingLogRepository.findFirstByDeviceIdOrderBySubmitDateDesc(deviceId);
            LocalDateTime lastLogSubmitDate = latestLog != null ? latestLog.getSubmitDate() : null;

            // 다음 로그 제출 기한 계산 (월 1회 제출 의무 - 마지막 제출일로부터 30일)
            LocalDateTime nextLogDueDate = null;
            Boolean isOverdue = false;
            if (lastLogSubmitDate != null) {
                nextLogDueDate = lastLogSubmitDate.plusDays(30);
                isOverdue = LocalDateTime.now().isAfter(nextLogDueDate);
            }

            // 이상 징후 로그 개수
            long flaggedLogCount = drivingLogRepository.findByDeviceIdAndStatus(
                    deviceId,
                    com.ddp.device.document.LogStatus.FLAGGED
            ).size();

            // 응답 DTO 생성
            DeviceWithLogStatsResponse.LogStats logStats = DeviceWithLogStatsResponse.LogStats.builder()
                    .totalLogCount(totalLogCount)
                    .lastLogSubmitDate(lastLogSubmitDate)
                    .nextLogDueDate(nextLogDueDate)
                    .flaggedLogCount((int) flaggedLogCount)
                    .isOverdue(isOverdue)
                    .build();

            DeviceResponse deviceResponse = DeviceResponse.from(device);

            DeviceWithLogStatsResponse response = DeviceWithLogStatsResponse.builder()
                    .device(deviceResponse)
                    .logStats(logStats)
                    .build();

            log.info("API 호출 완료: 장치 상세 + 로그 통계 조회 - 총 로그: {} 건 ({}ms)",
                    totalLogCount, System.currentTimeMillis() - startTime);

            return response;

        } catch (IllegalArgumentException e) {
            log.error("장치 조회 실패: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("장치 조회 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("장치 조회에 실패했습니다.", e);
        }
    }
}
