package com.ddp.company.service;

import com.ddp.company.dto.request.CreateServiceRecordRequest;
import com.ddp.company.dto.response.ServiceRecordDto;
import com.ddp.company.entity.Company;
import com.ddp.company.entity.ServiceRecord;
import com.ddp.company.repository.CompanyRepository;
import com.ddp.company.repository.ServiceRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 서비스 이력 관리 서비스
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ServiceRecordService {

    private final ServiceRecordRepository serviceRecordRepository;
    private final CompanyRepository companyRepository;

    /**
     * 서비스 이력 생성 (내부 API - Reservation Service에서 호출)
     */
    public ServiceRecordDto createServiceRecord(CreateServiceRecordRequest request) {
        log.info("API 호출 시작: 서비스 이력 생성 - 업체 ID: {}, 타입: {}", request.getCompanyId(), request.getType());

        long startTime = System.currentTimeMillis();

        try {
            // 업체 조회
            Company company = companyRepository.findById(request.getCompanyId())
                    .orElseThrow(() -> new IllegalArgumentException("업체를 찾을 수 없습니다: " + request.getCompanyId()));

            // ServiceRecord 엔티티 생성
            ServiceRecord record = ServiceRecord.builder()
                    .type(request.getType())
                    .subjectId(String.valueOf(request.getSubjectId()))
                    .subjectName(request.getSubjectName())
                    .deviceId(String.valueOf(request.getDeviceId()))
                    .deviceSerialNumber(request.getDeviceSerialNumber())
                    .description(request.getDescription())
                    .performedAt(request.getPerformedAt())
                    .performedBy(request.getPerformedBy())
                    .cost(request.getCost())
                    .company(company)
                    .build();

            // 저장
            ServiceRecord savedRecord = serviceRecordRepository.save(record);

            log.info("API 호출 완료: 서비스 이력 생성 - 이력 ID: {} ({}ms)",
                    savedRecord.getId(), System.currentTimeMillis() - startTime);

            return ServiceRecordDto.fromEntity(savedRecord);

        } catch (IllegalArgumentException e) {
            log.error("서비스 이력 생성 실패: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("서비스 이력 생성 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("서비스 이력 생성에 실패했습니다.", e);
        }
    }

    /**
     * 업체의 서비스 이력 목록 조회
     */
    @Transactional(readOnly = true)
    public List<ServiceRecordDto> getCompanyServiceRecords(Long companyId) {
        log.info("API 호출 시작: 업체 서비스 이력 조회 - 업체 ID: {}", companyId);

        long startTime = System.currentTimeMillis();

        List<ServiceRecord> records = serviceRecordRepository.findByCompanyId(companyId);

        log.info("API 호출 완료: 업체 서비스 이력 조회 - {} 건 ({}ms)",
                records.size(), System.currentTimeMillis() - startTime);

        return records.stream()
                .map(ServiceRecordDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 서비스 이력 상세 조회
     */
    @Transactional(readOnly = true)
    public ServiceRecordDto getServiceRecord(Long id) {
        log.info("API 호출 시작: 서비스 이력 상세 조회 - 이력 ID: {}", id);

        long startTime = System.currentTimeMillis();

        ServiceRecord record = serviceRecordRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("서비스 이력을 찾을 수 없습니다: " + id));

        log.info("API 호출 완료: 서비스 이력 상세 조회 - 이력 ID: {} ({}ms)",
                id, System.currentTimeMillis() - startTime);

        return ServiceRecordDto.fromEntity(record);
    }

    /**
     * 전체 서비스 이력 조회 (관리자용)
     */
    @Transactional(readOnly = true)
    public List<ServiceRecordDto> getAllServiceRecords() {
        log.info("API 호출 시작: 전체 서비스 이력 조회 (관리자)");

        long startTime = System.currentTimeMillis();

        List<ServiceRecord> records = serviceRecordRepository.findAll();

        log.info("API 호출 완료: 전체 서비스 이력 조회 - {} 건 ({}ms)",
                records.size(), System.currentTimeMillis() - startTime);

        return records.stream()
                .map(ServiceRecordDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 사용자별 서비스 이력 조회
     */
    @Transactional(readOnly = true)
    public List<ServiceRecordDto> getUserServiceRecords(String subjectId) {
        log.info("API 호출 시작: 사용자 서비스 이력 조회 - 사용자 ID: {}", subjectId);

        long startTime = System.currentTimeMillis();

        List<ServiceRecord> records = serviceRecordRepository.findBySubjectId(subjectId);

        log.info("API 호출 완료: 사용자 서비스 이력 조회 - {} 건 ({}ms)",
                records.size(), System.currentTimeMillis() - startTime);

        return records.stream()
                .map(ServiceRecordDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 장치별 서비스 이력 조회
     */
    @Transactional(readOnly = true)
    public List<ServiceRecordDto> getDeviceServiceRecords(String deviceId) {
        log.info("API 호출 시작: 장치 서비스 이력 조회 - 장치 ID: {}", deviceId);

        long startTime = System.currentTimeMillis();

        List<ServiceRecord> records = serviceRecordRepository.findByDeviceId(deviceId);

        log.info("API 호출 완료: 장치 서비스 이력 조회 - {} 건 ({}ms)",
                records.size(), System.currentTimeMillis() - startTime);

        return records.stream()
                .map(ServiceRecordDto::fromEntity)
                .collect(Collectors.toList());
    }
}
