package com.ddp.company.controller;

import com.ddp.company.dto.response.CompanyStatsDto;
import com.ddp.company.service.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 업체 포털 컨트롤러
 * 업체(Company) 역할 사용자가 자신의 업체 정보 및 통계를 조회하는 API
 */
@RestController
@RequestMapping("/api/v1/company/portal")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Company Portal", description = "업체 포털 API")
public class CompanyPortalController {

    private final CompanyService companyService;

    /**
     * 업체 통계 조회
     * 업체가 자신의 서비스 통계를 조회
     */
    @GetMapping("/stats")
    @Operation(summary = "업체 통계 조회", description = "업체의 서비스 통계를 조회합니다 (업체 전용)")
    public ResponseEntity<CompanyStatsDto> getCompanyStats(
        @RequestHeader("X-User-Id") Long userId,
        @RequestHeader("X-User-Role") String role,
        @RequestHeader("X-Company-Id") Long companyId
    ) {
        log.info("업체 통계 조회 요청 - userId: {}, role: {}, companyId: {}", userId, role, companyId);

        // COMPANY 권한 체크
        if (!"COMPANY".equals(role)) {
            log.warn("권한 없음 - userId: {}, role: {}", userId, role);
            return ResponseEntity.status(403).build();
        }

        CompanyStatsDto stats = companyService.getCompanyStats(companyId);

        if (stats != null) {
            return ResponseEntity.ok(stats);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
