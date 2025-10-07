package com.ddp.tcs.service;

import com.ddp.tcs.dto.DuiSubjectResponse;
import com.ddp.tcs.dto.LicenseVerifyRequest;
import com.ddp.tcs.dto.LicenseVerifyResponse;
import com.ddp.tcs.entity.License;
import com.ddp.tcs.entity.LicenseStatus;
import com.ddp.tcs.repository.LicenseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

// TCS Mock 서비스 - 경찰청 TCS API 시뮬레이션
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class TcsService {

    private final LicenseRepository licenseRepository;
    private final RestTemplate restTemplate;

    @Value("${auth.service.url:http://localhost:8081}")
    private String authServiceUrl;

    // 면허 정보 조회
    public LicenseVerifyResponse verifyLicense(LicenseVerifyRequest request) {
        log.info("API 호출 시작: 면허 정보 조회 - 면허번호: {}", request.getLicenseNumber());
        
        long startTime = System.currentTimeMillis();
        
        try {
            // 면허번호로 면허 정보 조회
            Optional<License> licenseOpt = licenseRepository.findByLicenseNumber(request.getLicenseNumber());
            
            if (licenseOpt.isEmpty()) {
                log.warn("면허 정보를 찾을 수 없습니다: {}", request.getLicenseNumber());
                return LicenseVerifyResponse.failure("해당 면허번호의 정보를 찾을 수 없습니다.");
            }
            
            License license = licenseOpt.get();
            
            // 생년월일 검증 (요청에 생년월일이 포함된 경우)
            if (request.getBirthDate() != null && !request.getBirthDate().isEmpty()) {
                String requestBirthDate = request.getBirthDate();
                String licenseBirthDate = license.getBirthDate().format(DateTimeFormatter.ofPattern("yyMMdd"));
                
                if (!requestBirthDate.equals(licenseBirthDate)) {
                    log.warn("생년월일이 일치하지 않습니다: 요청={}, 실제={}", requestBirthDate, licenseBirthDate);
                    return LicenseVerifyResponse.failure("면허번호와 생년월일이 일치하지 않습니다.");
                }
            }
            
            // 면허 만료 여부 확인
            if (license.getExpiryDate().isBefore(LocalDate.now())) {
                log.warn("만료된 면허입니다: {}", request.getLicenseNumber());
                return LicenseVerifyResponse.failure("만료된 면허입니다.");
            }
            
            // 면허 상태 확인
            if (license.getStatus() != LicenseStatus.NORMAL) {
                log.warn("유효하지 않은 면허 상태: {} - {}", request.getLicenseNumber(), license.getStatus());
                return LicenseVerifyResponse.failure("유효하지 않은 면허 상태입니다: " + license.getStatus().getDescription());
            }
            
            // 성공 응답 생성
            LicenseVerifyResponse response = LicenseVerifyResponse.success(
                    license.getLicenseNumber(),
                    license.getName(),
                    license.getBirthDate(),
                    license.getAddress(),
                    license.getPhoneNumber(),
                    license.getIssueDate(),
                    license.getExpiryDate(),
                    license.getLicenseType(),
                    license.getStatus(),
                    license.isDuiViolator(),
                    license.getViolationCount()
            );
            
            log.info("API 호출 완료: 면허 정보 조회 ({}ms)", System.currentTimeMillis() - startTime);
            return response;
            
        } catch (Exception e) {
            log.error("면허 정보 조회 중 오류 발생: {}", e.getMessage(), e);
            return LicenseVerifyResponse.failure("시스템 오류가 발생했습니다.");
        }
    }

    // 음주운전 위반자 목록 조회
    public DuiSubjectResponse getDuiSubjects() {
        log.info("API 호출 시작: 음주운전 위반자 목록 조회");

        long startTime = System.currentTimeMillis();

        try {
            // 음주운전 위반자 목록 조회
            List<License> duiLicenses = licenseRepository.findAllDuiViolators();

            // DTO로 변환 (Auth Service 연동하여 계정 생성 여부 확인)
            List<DuiSubjectResponse.DuiSubject> subjects = duiLicenses.stream()
                    .map(license -> {
                        // Auth Service에서 계정 생성 여부 확인
                        Map<String, Object> accountCheck = checkAccountFromAuthService(license.getLicenseNumber());

                        return DuiSubjectResponse.DuiSubject.builder()
                                .licenseNumber(license.getLicenseNumber())
                                .name(license.getName())
                                .birthDate(license.getBirthDate())
                                .address(license.getAddress())
                                .phoneNumber(license.getPhoneNumber())
                                .violationCount(license.getViolationCount())
                                .lastViolationDate(LocalDate.now().minusDays((long) (Math.random() * 365))) // 임의의 최근 위반일
                                .isAccountCreated((Boolean) accountCheck.getOrDefault("exists", false))
                                .accountStatus((String) accountCheck.get("accountStatus"))
                                .build();
                    })
                    .collect(Collectors.toList());

            log.info("API 호출 완료: 음주운전 위반자 목록 조회 - 총 {}명 ({}ms)",
                    subjects.size(), System.currentTimeMillis() - startTime);

            return DuiSubjectResponse.success(subjects);

        } catch (Exception e) {
            log.error("음주운전 위반자 목록 조회 중 오류 발생: {}", e.getMessage(), e);
            return DuiSubjectResponse.failure("시스템 오류가 발생했습니다.");
        }
    }

    // Auth Service에서 계정 생성 여부 확인
    private Map<String, Object> checkAccountFromAuthService(String licenseNumber) {
        try {
            String url = authServiceUrl + "/api/v1/auth/admin/accounts/check/" + licenseNumber;
            log.debug("Auth Service 계정 확인 요청: {}", url);

            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);

            if (response != null) {
                log.debug("Auth Service 응답: licenseNumber={}, exists={}, status={}",
                        licenseNumber, response.get("exists"), response.get("accountStatus"));
                return response;
            }

        } catch (Exception e) {
            log.warn("Auth Service 계정 확인 실패 (licenseNumber={}): {}", licenseNumber, e.getMessage());
        }

        // 실패 시 기본값 반환
        return Map.of("exists", false, "accountStatus", (Object) null);
    }
}