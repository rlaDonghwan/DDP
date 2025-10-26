package com.ddp.company.service;

import com.ddp.company.dto.response.OperatorDto;
import com.ddp.company.dto.response.OperatorListResponse;
import com.ddp.company.entity.Company;
import com.ddp.company.entity.CompanyStatus;
import com.ddp.company.repository.CompanyRepository;
import com.ddp.company.util.LocationUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

// 업체 검색 서비스 (공개 API용)
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class OperatorService {

    private final CompanyRepository companyRepository;

    /**
     * 모든 승인된 업체 조회
     */
    public OperatorListResponse getAllOperators(String region, String serviceType) {
        log.info("API 호출 시작: 업체 목록 조회 (공개) - 지역: {}, 서비스: {}", region, serviceType);
        long startTime = System.currentTimeMillis();

        try {
            // 승인된 업체만 조회 (삭제되지 않은 업체만)
            List<Company> companies;

            if (region != null && !region.isEmpty()) {
                companies = companyRepository.findByStatusAndRegionAndDeletedAtIsNull(CompanyStatus.APPROVED, region);
            } else {
                companies = companyRepository.findByStatusAndDeletedAtIsNull(CompanyStatus.APPROVED);
            }

            // DTO 변환
            List<OperatorDto> operators = companies.stream()
                .map(OperatorDto::fromEntity)
                .collect(Collectors.toList());

            log.info("API 호출 완료: 업체 목록 조회 (공개) - 총 {}개 조회 ({}ms)",
                operators.size(), System.currentTimeMillis() - startTime);

            return OperatorListResponse.success(operators.size(), operators);

        } catch (Exception e) {
            log.error("API 호출 실패: 업체 목록 조회 (공개) - {}", e.getMessage(), e);
            return OperatorListResponse.failure();
        }
    }

    /**
     * 업체 상세 조회 (공개)
     */
    public OperatorDto getOperatorById(Long id) {
        log.info("API 호출 시작: 업체 상세 조회 (공개) - ID: {}", id);
        long startTime = System.currentTimeMillis();

        try {
            Company company = companyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("업체를 찾을 수 없습니다: " + id));

            // 승인된 업체만 공개
            if (company.getStatus() != CompanyStatus.APPROVED) {
                log.warn("업체 상세 조회 실패: 승인되지 않은 업체 - ID: {}, 상태: {}", id, company.getStatus());
                throw new IllegalArgumentException("승인되지 않은 업체입니다.");
            }

            OperatorDto operator = OperatorDto.fromEntity(company);

            log.info("API 호출 완료: 업체 상세 조회 (공개) - ID: {} ({}ms)",
                id, System.currentTimeMillis() - startTime);

            return operator;

        } catch (Exception e) {
            log.error("API 호출 실패: 업체 상세 조회 (공개) - ID: {}, 오류: {}", id, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * 업체 검색 (키워드)
     */
    public OperatorListResponse searchOperators(String keyword) {
        log.info("API 호출 시작: 업체 검색 - 키워드: {}", keyword);
        long startTime = System.currentTimeMillis();

        try {
            // 승인된 업체 중 이름으로 검색 (삭제되지 않은 업체만)
            List<Company> companies = companyRepository.findByStatusAndNameContainingAndDeletedAtIsNull(
                CompanyStatus.APPROVED, keyword);

            // DTO 변환
            List<OperatorDto> operators = companies.stream()
                .map(OperatorDto::fromEntity)
                .collect(Collectors.toList());

            log.info("API 호출 완료: 업체 검색 - 키워드: {}, 총 {}개 조회 ({}ms)",
                keyword, operators.size(), System.currentTimeMillis() - startTime);

            return OperatorListResponse.success(operators.size(), operators);

        } catch (Exception e) {
            log.error("API 호출 실패: 업체 검색 - 키워드: {}, 오류: {}", keyword, e.getMessage(), e);
            return OperatorListResponse.failure();
        }
    }
}
