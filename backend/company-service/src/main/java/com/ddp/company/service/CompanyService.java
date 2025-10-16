package com.ddp.company.service;

import com.ddp.company.client.AuthServiceClient;
import com.ddp.company.dto.request.CreateCompanyAccountRequest;
import com.ddp.company.dto.request.CreateCompanyRequest;
import com.ddp.company.dto.request.UpdateCompanyRequest;
import com.ddp.company.dto.response.*;
import com.ddp.company.entity.Company;
import com.ddp.company.entity.CompanyStatus;
import com.ddp.company.repository.CompanyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

// 업체 관리 서비스
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final AuthServiceClient authServiceClient;

    /**
     * 업체 목록 조회
     */
    @Transactional(readOnly = true)
    public CompanyListResponse getCompanies(String searchQuery, String status, String region, Integer page, Integer pageSize) {
        log.info("API 호출 시작: 업체 목록 조회");
        long startTime = System.currentTimeMillis();

        try {
            // 페이징 설정 (기본값: 페이지 0, 크기 10)
            int pageNumber = (page != null && page > 0) ? page - 1 : 0;
            int size = (pageSize != null && pageSize > 0) ? pageSize : 10;
            Pageable pageable = PageRequest.of(pageNumber, size, Sort.by("createdAt").descending());

            // CompanyStatus 변환
            CompanyStatus companyStatus = null;
            if (status != null && !status.isEmpty()) {
                companyStatus = mapStringToStatus(status);
            }

            // 검색 실행
            Page<Company> companyPage = companyRepository.searchCompanies(searchQuery, companyStatus, region, pageable);

            // DTO 변환
            List<CompanyDto> companies = companyPage.getContent().stream()
                .map(CompanyDto::fromEntity)
                .collect(Collectors.toList());

            log.info("API 호출 완료: 업체 목록 조회 - 총 {}개 조회 ({}ms)",
                companyPage.getTotalElements(), System.currentTimeMillis() - startTime);

            return CompanyListResponse.success((int) companyPage.getTotalElements(), companies);

        } catch (Exception e) {
            log.error("API 호출 실패: 업체 목록 조회 - {}", e.getMessage(), e);
            return CompanyListResponse.failure();
        }
    }

    /**
     * 업체 상세 조회
     */
    @Transactional(readOnly = true)
    public CompanyDetailResponse getCompanyById(Long id) {
        log.info("API 호출 시작: 업체 상세 조회 - ID: {}", id);
        long startTime = System.currentTimeMillis();

        try {
            Company company = companyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("업체를 찾을 수 없습니다: " + id));

            CompanyDetailDto companyDetail = CompanyDetailDto.fromEntity(company);

            log.info("API 호출 완료: 업체 상세 조회 - ID: {} ({}ms)",
                id, System.currentTimeMillis() - startTime);

            return CompanyDetailResponse.success(companyDetail);

        } catch (Exception e) {
            log.error("API 호출 실패: 업체 상세 조회 - ID: {}, 오류: {}", id, e.getMessage(), e);
            return CompanyDetailResponse.failure();
        }
    }

    /**
     * 업체 등록
     */
    public ApiResponse createCompany(CreateCompanyRequest request) {
        log.info("API 호출 시작: 업체 등록 - 업체명: {}", request.getName());
        long startTime = System.currentTimeMillis();

        try {
            // 1. 사업자등록번호 중복 확인
            if (companyRepository.existsByBusinessNumber(request.getBusinessNumber())) {
                log.warn("업체 등록 실패: 이미 등록된 사업자등록번호 - {}", request.getBusinessNumber());
                return ApiResponse.failure("이미 등록된 사업자등록번호입니다.");
            }

            // 2. 이메일 중복 확인
            if (companyRepository.existsByEmail(request.getEmail())) {
                log.warn("업체 등록 실패: 이미 등록된 이메일 - {}", request.getEmail());
                return ApiResponse.failure("이미 등록된 이메일입니다.");
            }

            // 3. 업체 엔티티 생성
            Company company = Company.builder()
                .name(request.getName())
                .businessNumber(request.getBusinessNumber())
                .representativeName(request.getRepresentativeName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .address(request.getAddress())
                .region(request.getRegion())
                .status(CompanyStatus.PENDING)  // 기본 상태: 대기 중
                .initialAccountId(request.getInitialAccountId())
                .deviceCount(0)
                .customerCount(0)
                .build();

            // 4. 저장
            Company savedCompany = companyRepository.save(company);

            log.info("API 호출 완료: 업체 등록 - ID: {}, 업체명: {} ({}ms)",
                savedCompany.getId(), savedCompany.getName(), System.currentTimeMillis() - startTime);

            // 5. TODO: auth-service 호출하여 업체 계정 생성
            // createCompanyAccount(request.getInitialAccountId(), request.getInitialPassword(), savedCompany.getId());

            return ApiResponse.success("업체가 성공적으로 등록되었습니다.");

        } catch (Exception e) {
            log.error("API 호출 실패: 업체 등록 - 오류: {}", e.getMessage(), e);
            return ApiResponse.failure("업체 등록 중 오류가 발생했습니다.");
        }
    }

    /**
     * 업체 승인
     */
    public ApiResponse approveCompany(Long companyId) {
        log.info("API 호출 시작: 업체 승인 - ID: {}", companyId);
        long startTime = System.currentTimeMillis();

        try {
            Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("업체를 찾을 수 없습니다: " + companyId));

            // 업체 승인 처리
            company.setStatus(CompanyStatus.APPROVED);
            company.setApprovedAt(LocalDateTime.now());
            company.setRejectedReason(null);
            companyRepository.save(company);

            // auth-service에 업체 로그인 계정 생성 요청
            try {
                CreateCompanyAccountRequest accountRequest = CreateCompanyAccountRequest.builder()
                    .companyId(String.valueOf(company.getId()))
                    .companyName(company.getName())
                    .email(company.getEmail())
                    .password(company.getInitialAccountId() + "!@#") // 임시 비밀번호 (추후 변경 필요)
                    .phone(company.getPhone())
                    .build();

                CreateCompanyAccountResponse accountResponse = authServiceClient.createCompanyAccount(accountRequest);

                if (accountResponse.isSuccess()) {
                    log.info("업체 로그인 계정 생성 성공 - 업체 ID: {}, 사용자 ID: {}",
                        companyId, accountResponse.getUserId());
                } else {
                    log.warn("업체 로그인 계정 생성 실패 - 업체 ID: {}, 사유: {}",
                        companyId, accountResponse.getMessage());
                    // 계정 생성 실패해도 업체 승인은 유지 (수동으로 계정 생성 가능)
                }
            } catch (Exception authError) {
                log.error("auth-service 호출 실패 - 업체 ID: {}, 오류: {}",
                    companyId, authError.getMessage(), authError);
                // auth-service 호출 실패해도 업체 승인은 유지
            }

            log.info("API 호출 완료: 업체 승인 - ID: {}, 업체명: {} ({}ms)",
                companyId, company.getName(), System.currentTimeMillis() - startTime);

            return ApiResponse.success("업체가 승인되었습니다.");

        } catch (Exception e) {
            log.error("API 호출 실패: 업체 승인 - ID: {}, 오류: {}", companyId, e.getMessage(), e);
            return ApiResponse.failure("업체 승인 중 오류가 발생했습니다.");
        }
    }

    /**
     * 업체 거절
     */
    public ApiResponse rejectCompany(Long companyId, String reason) {
        log.info("API 호출 시작: 업체 거절 - ID: {}", companyId);
        long startTime = System.currentTimeMillis();

        try {
            Company company = companyRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("업체를 찾을 수 없습니다: " + companyId));

            // 업체 거절 처리
            company.setStatus(CompanyStatus.REJECTED);
            company.setRejectedReason(reason);
            company.setApprovedAt(null);
            companyRepository.save(company);

            log.info("API 호출 완료: 업체 거절 - ID: {}, 업체명: {}, 사유: {} ({}ms)",
                companyId, company.getName(), reason, System.currentTimeMillis() - startTime);

            return ApiResponse.success("업체가 거절되었습니다.");

        } catch (Exception e) {
            log.error("API 호출 실패: 업체 거절 - ID: {}, 오류: {}", companyId, e.getMessage(), e);
            return ApiResponse.failure("업체 거절 중 오류가 발생했습니다.");
        }
    }

    /**
     * 업체 수정
     */
    public ApiResponse updateCompany(Long id, UpdateCompanyRequest request) {
        log.info("API 호출 시작: 업체 수정 - ID: {}", id);
        long startTime = System.currentTimeMillis();

        try {
            Company company = companyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("업체를 찾을 수 없습니다: " + id));

            // 업체 정보 업데이트
            if (request.getName() != null) {
                company.setName(request.getName());
            }
            if (request.getEmail() != null) {
                company.setEmail(request.getEmail());
            }
            if (request.getPhone() != null) {
                company.setPhone(request.getPhone());
            }
            if (request.getAddress() != null) {
                company.setAddress(request.getAddress());
            }
            if (request.getRegion() != null) {
                company.setRegion(request.getRegion());
            }
            if (request.getStatus() != null) {
                company.setStatus(request.getStatus());
            }

            companyRepository.save(company);

            log.info("API 호출 완료: 업체 수정 - ID: {}, 업체명: {} ({}ms)",
                id, company.getName(), System.currentTimeMillis() - startTime);

            return ApiResponse.success("업체 정보가 수정되었습니다.");

        } catch (Exception e) {
            log.error("API 호출 실패: 업체 수정 - ID: {}, 오류: {}", id, e.getMessage(), e);
            return ApiResponse.failure("업체 수정 중 오류가 발생했습니다.");
        }
    }

    /**
     * 업체 삭제
     */
    public ApiResponse deleteCompany(Long id) {
        log.info("API 호출 시작: 업체 삭제 - ID: {}", id);
        long startTime = System.currentTimeMillis();

        try {
            Company company = companyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("업체를 찾을 수 없습니다: " + id));

            companyRepository.delete(company);

            log.info("API 호출 완료: 업체 삭제 - ID: {}, 업체명: {} ({}ms)",
                id, company.getName(), System.currentTimeMillis() - startTime);

            return ApiResponse.success("업체가 삭제되었습니다.");

        } catch (Exception e) {
            log.error("API 호출 실패: 업체 삭제 - ID: {}, 오류: {}", id, e.getMessage(), e);
            return ApiResponse.failure("업체 삭제 중 오류가 발생했습니다.");
        }
    }

    /**
     * 문자열을 CompanyStatus Enum으로 변환
     */
    private CompanyStatus mapStringToStatus(String status) {
        return switch (status.toLowerCase()) {
            case "approved" -> CompanyStatus.APPROVED;
            case "pending" -> CompanyStatus.PENDING;
            case "rejected" -> CompanyStatus.REJECTED;
            case "suspended" -> CompanyStatus.SUSPENDED;
            default -> null;
        };
    }
}
