package com.ddp.auth.service;

import com.ddp.auth.dto.TcsLicenseVerifyRequest;
import com.ddp.auth.dto.TcsLicenseVerifyResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

// TCS Mock API 연동 서비스
@Service
@RequiredArgsConstructor
@Slf4j
public class TcsIntegrationService {

    private final RestTemplate restTemplate;

    @Value("${tcs.api.base-url:http://localhost:8085}")
    private String tcsApiBaseUrl;

    // TCS API를 통한 면허 정보 조회
    public TcsLicenseVerifyResponse verifyLicense(String licenseNumber, String birthDate) {
        log.info("API 호출 시작: TCS 면허 정보 조회 - 면허번호: {}", licenseNumber);
        
        long startTime = System.currentTimeMillis();
        
        try {
            // 요청 DTO 생성
            TcsLicenseVerifyRequest request = TcsLicenseVerifyRequest.builder()
                    .licenseNumber(licenseNumber)
                    .birthDate(birthDate)
                    .build();

            // HTTP 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // HTTP 요청 엔티티 생성
            HttpEntity<TcsLicenseVerifyRequest> requestEntity = new HttpEntity<>(request, headers);

            // TCS Mock API 호출
            String url = tcsApiBaseUrl + "/api/tcs/license/verify";
            ResponseEntity<TcsLicenseVerifyResponse> response = restTemplate.postForEntity(
                    url, requestEntity, TcsLicenseVerifyResponse.class);

            log.info("API 호출 완료: TCS 면허 정보 조회 ({}ms)", System.currentTimeMillis() - startTime);
            
            return response.getBody();

        } catch (Exception e) {
            log.error("TCS API 호출 중 오류 발생: {}", e.getMessage(), e);
            return TcsLicenseVerifyResponse.builder()
                    .success(false)
                    .errorMessage("TCS API 호출 중 오류가 발생했습니다: " + e.getMessage())
                    .build();
        }
    }

    // 음주운전 위반자인지 확인
    public boolean isDuiViolator(String licenseNumber) {
        TcsLicenseVerifyResponse response = verifyLicense(licenseNumber, null);
        return response.isSuccess() && response.isDuiViolator();
    }
}