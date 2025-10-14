package com.ddp.auth.service;

import com.ddp.auth.dto.request.TcsVerificationRequest;
import com.ddp.auth.dto.response.TcsVerificationResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

// TCS (경찰청 음주운전 단속 시스템) 연동 서비스
@Service
@RequiredArgsConstructor
@Slf4j
public class TcsService {

    private final RestTemplate restTemplate;

    @Value("${tcs.api.url:http://localhost:8085/api/tcs}")
    private String tcsApiUrl;

    // 운전면허 검증
    public TcsVerificationResponse verifyLicense(String licenseNumber) {
        log.info("API 호출 시작: TCS 운전면허 검증 - 면허번호: {}", maskLicenseNumber(licenseNumber));

        long startTime = System.currentTimeMillis();

        try {
            // TCS API 호출
            TcsVerificationRequest request = TcsVerificationRequest.builder()
                    .licenseNumber(licenseNumber)
                    .build();

            String url = tcsApiUrl + "/license/verify";

            TcsVerificationResponse response = restTemplate.postForObject(
                    url,
                    request,
                    TcsVerificationResponse.class
            );

            if (response != null && response.isSuccess()) {
                log.info("API 호출 완료: TCS 운전면허 검증 성공 - 이름: {}, 적발횟수: {} ({}ms)",
                        response.getName(), response.getViolationCount(), System.currentTimeMillis() - startTime);
            } else {
                log.warn("API 호출 완료: TCS 운전면허 검증 실패 - 메시지: {} ({}ms)",
                        response != null ? response.getMessage() : "응답 없음", System.currentTimeMillis() - startTime);
            }

            return response;

        } catch (Exception e) {
            log.error("TCS API 호출 중 오류 발생: {}", e.getMessage(), e);
            return TcsVerificationResponse.failure("TCS 시스템 연동 중 오류가 발생했습니다.");
        }
    }

    // 운전면허 번호 마스킹 (로그용)
    private String maskLicenseNumber(String licenseNumber) {
        if (licenseNumber == null || licenseNumber.length() < 10) {
            return "***";
        }
        // 예: 23-45-678901-22 → 23-45-***901-22
        int maskStart = licenseNumber.indexOf('-', 6);
        int maskEnd = licenseNumber.lastIndexOf('-');

        if (maskStart > 0 && maskEnd > maskStart) {
            return licenseNumber.substring(0, maskStart + 1) +
                    "***" +
                    licenseNumber.substring(maskEnd - 3);
        }

        return licenseNumber;
    }
}
