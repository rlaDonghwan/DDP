package com.ddp.company.controller;

import com.ddp.company.dto.response.CompanyDto;
import com.ddp.company.service.CompanyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// 내부 서비스 호출용 업체 컨트롤러 (Feign Client용)
@RestController
@RequestMapping("/api/v1/companies")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Internal Company API", description = "내부 서비스 호출용 업체 API")
public class InternalCompanyController {

    private final CompanyService companyService;

    /**
     * 업체 기본 정보 조회 (내부 서비스용)
     * GET /api/v1/companies/{id}
     *
     * 이 엔드포인트는 다른 마이크로서비스(예: reservation-service)에서
     * Feign Client를 통해 호출하기 위한 용도입니다.
     */
    @GetMapping("/{id}")
    @Operation(summary = "업체 기본 정보 조회", description = "내부 서비스에서 업체 기본 정보를 조회합니다")
    public ResponseEntity<CompanyDto> getCompanyBasicInfo(@PathVariable Long id) {
        log.debug("내부 서비스 - 업체 기본 정보 조회 요청: companyId={}", id);

        try {
            CompanyDto company = companyService.getCompanyBasicInfo(id);
            if (company != null) {
                return ResponseEntity.ok(company);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            log.error("업체 기본 정보 조회 실패: companyId={}, error={}", id, e.getMessage());
            return ResponseEntity.internalServerError().build();
        }
    }
}
