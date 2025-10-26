package com.ddp.company.controller;

import com.ddp.company.dto.request.CreateCompanyRequest;
import com.ddp.company.dto.request.UpdateCompanyRequest;
import com.ddp.company.dto.response.ApiResponse;
import com.ddp.company.dto.response.CompanyDetailResponse;
import com.ddp.company.dto.response.CompanyListResponse;
import com.ddp.company.service.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

// 업체 관리 컨트롤러
@RestController
@RequestMapping("/api/v1/admin/companies")
@RequiredArgsConstructor
@Slf4j
@Validated
@Tag(name = "Company Management", description = "업체 관리 API")
public class CompanyController {

    private final CompanyService companyService;

    /**
     * 업체 목록 조회 (ADMIN만 가능)
     */
    @GetMapping
    @Operation(summary = "업체 목록 조회", description = "검색 조건에 따라 업체 목록을 조회합니다 (ADMIN 전용)")
    public ResponseEntity<CompanyListResponse> getCompanies(
        @RequestHeader("X-User-Id") Long userId,
        @RequestHeader("X-User-Role") String role,
        @RequestParam(required = false) String searchQuery,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) String region,
        @RequestParam(required = false) Integer page,
        @RequestParam(required = false) Integer pageSize
    ) {
        log.debug("업체 목록 조회 요청 - userId: {}, role: {}", userId, role);

        // ADMIN 권한 체크
        if (!"ADMIN".equals(role)) {
            log.warn("권한 없음 - userId: {}, role: {}", userId, role);
            return ResponseEntity.status(403).build();
        }

        CompanyListResponse response = companyService.getCompanies(searchQuery, status, region, page, pageSize);

        return ResponseEntity.ok(response);
    }

    /**
     * 업체 상세 조회
     */
    @GetMapping("/{id}")
    @Operation(summary = "업체 상세 조회", description = "특정 업체의 상세 정보를 조회합니다")
    public ResponseEntity<CompanyDetailResponse> getCompanyById(@PathVariable Long id) {
        log.debug("업체 상세 조회 요청 - ID: {}", id);

        CompanyDetailResponse response = companyService.getCompanyById(id);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 업체 등록 (ADMIN만 가능)
     */
    @PostMapping
    @Operation(summary = "업체 등록", description = "새로운 업체를 등록합니다 (ADMIN 전용)")
    public ResponseEntity<ApiResponse> createCompany(
        @RequestHeader("X-User-Id") Long userId,
        @RequestHeader("X-User-Role") String role,
        @Valid @RequestBody CreateCompanyRequest request
    ) {
        log.debug("업체 등록 요청 - userId: {}, role: {}, 업체명: {}", userId, role, request.getName());

        // ADMIN 권한 체크
        if (!"ADMIN".equals(role)) {
            log.warn("권한 없음 - userId: {}, role: {}", userId, role);
            return ResponseEntity.status(403).body(ApiResponse.failure("권한이 없습니다."));
        }

        ApiResponse response = companyService.createCompany(request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 업체 승인 (ADMIN만 가능)
     */
    @PostMapping("/{id}/approve")
    @Operation(summary = "업체 승인", description = "대기 중인 업체를 승인합니다 (ADMIN 전용)")
    public ResponseEntity<ApiResponse> approveCompany(
        @RequestHeader("X-User-Id") Long userId,
        @RequestHeader("X-User-Role") String role,
        @PathVariable Long id
    ) {
        log.debug("업체 승인 요청 - userId: {}, role: {}, companyId: {}", userId, role, id);

        // ADMIN 권한 체크
        if (!"ADMIN".equals(role)) {
            log.warn("권한 없음 - userId: {}, role: {}", userId, role);
            return ResponseEntity.status(403).body(ApiResponse.failure("권한이 없습니다."));
        }

        // 저장된 계정 정보를 사용하여 승인 (null 전달)
        ApiResponse response = companyService.approveCompany(id, null, null);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 업체 거절 (ADMIN만 가능)
     */
    @PostMapping("/{id}/reject")
    @Operation(summary = "업체 거절", description = "대기 중인 업체를 거절합니다 (ADMIN 전용)")
    public ResponseEntity<ApiResponse> rejectCompany(
        @RequestHeader("X-User-Id") Long userId,
        @RequestHeader("X-User-Role") String role,
        @PathVariable Long id,
        @RequestBody RejectRequest request
    ) {
        log.debug("업체 거절 요청 - userId: {}, role: {}, ID: {}, 사유: {}", userId, role, id, request.reason());

        // ADMIN 권한 체크
        if (!"ADMIN".equals(role)) {
            log.warn("권한 없음 - userId: {}, role: {}", userId, role);
            return ResponseEntity.status(403).body(ApiResponse.failure("권한이 없습니다."));
        }

        ApiResponse response = companyService.rejectCompany(id, request.reason());

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 업체 수정 (ADMIN만 가능)
     */
    @PutMapping("/{id}")
    @Operation(summary = "업체 수정", description = "업체 정보를 수정합니다 (ADMIN 전용)")
    public ResponseEntity<ApiResponse> updateCompany(
        @RequestHeader("X-User-Id") Long userId,
        @RequestHeader("X-User-Role") String role,
        @PathVariable Long id,
        @Valid @RequestBody UpdateCompanyRequest request
    ) {
        log.debug("업체 수정 요청 - userId: {}, role: {}, ID: {}", userId, role, id);

        // ADMIN 권한 체크
        if (!"ADMIN".equals(role)) {
            log.warn("권한 없음 - userId: {}, role: {}", userId, role);
            return ResponseEntity.status(403).body(ApiResponse.failure("권한이 없습니다."));
        }

        ApiResponse response = companyService.updateCompany(id, request);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 업체 삭제 (ADMIN만 가능)
     */
    @DeleteMapping("/{id}")
    @Operation(summary = "업체 삭제", description = "업체를 삭제합니다 (ADMIN 전용)")
    public ResponseEntity<ApiResponse> deleteCompany(
        @RequestHeader("X-User-Id") Long userId,
        @RequestHeader("X-User-Role") String role,
        @PathVariable Long id
    ) {
        log.debug("업체 삭제 요청 - userId: {}, role: {}, ID: {}", userId, role, id);

        // ADMIN 권한 체크
        if (!"ADMIN".equals(role)) {
            log.warn("권한 없음 - userId: {}, role: {}", userId, role);
            return ResponseEntity.status(403).body(ApiResponse.failure("권한이 없습니다."));
        }

        ApiResponse response = companyService.deleteCompany(id);

        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    /**
     * 업체 거절 요청용 내부 DTO
     */
    private record RejectRequest(String reason) {}
}
