package com.ddp.company.controller;

import com.ddp.company.dto.response.OperatorDto;
import com.ddp.company.dto.response.OperatorListResponse;
import com.ddp.company.service.OperatorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

// 업체 검색 공개 API 컨트롤러 (인증 불필요)
@RestController
@RequestMapping("/api/v1/public/operators")
@RequiredArgsConstructor
@Slf4j
@Validated
@Tag(name = "Public Operator API", description = "업체 검색 공개 API (인증 불필요)")
public class PublicOperatorController {

    private final OperatorService operatorService;

    /**
     * 모든 업체 조회 (승인된 업체만)
     */
    @GetMapping
    @Operation(summary = "업체 목록 조회", description = "모든 승인된 업체 목록을 조회합니다 (인증 불필요)")
    public ResponseEntity<OperatorListResponse> getAllOperators(
        @RequestParam(required = false) String region,
        @RequestParam(required = false) String serviceType
    ) {
        log.debug("업체 목록 조회 요청 (공개) - 지역: {}, 서비스: {}", region, serviceType);

        OperatorListResponse response = operatorService.getAllOperators(region, serviceType);

        return ResponseEntity.ok(response);
    }

    /**
     * 주변 업체 검색 (위치 기반)
     */
    @GetMapping("/nearby")
    @Operation(summary = "주변 업체 검색", description = "현재 위치 기반으로 주변 업체를 검색합니다 (인증 불필요)")
    public ResponseEntity<OperatorListResponse> getNearbyOperators(
        @RequestParam Double latitude,
        @RequestParam Double longitude,
        @RequestParam(required = false, defaultValue = "10.0") Double radius
    ) {
        log.debug("주변 업체 검색 요청 - 위도: {}, 경도: {}, 반경: {}km", latitude, longitude, radius);

        OperatorListResponse response = operatorService.getNearbyOperators(latitude, longitude, radius);

        return ResponseEntity.ok(response);
    }

    /**
     * 업체 상세 조회 (공개)
     */
    @GetMapping("/{id}")
    @Operation(summary = "업체 상세 조회", description = "특정 업체의 상세 정보를 조회합니다 (인증 불필요)")
    public ResponseEntity<OperatorDto> getOperatorById(@PathVariable Long id) {
        log.debug("업체 상세 조회 요청 (공개) - ID: {}", id);

        try {
            OperatorDto operator = operatorService.getOperatorById(id);
            return ResponseEntity.ok(operator);
        } catch (IllegalArgumentException e) {
            log.warn("업체 상세 조회 실패 - ID: {}, 사유: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * 업체 검색 (키워드)
     */
    @GetMapping("/search")
    @Operation(summary = "업체 검색", description = "키워드로 업체를 검색합니다 (인증 불필요)")
    public ResponseEntity<OperatorListResponse> searchOperators(
        @RequestParam String keyword
    ) {
        log.debug("업체 검색 요청 - 키워드: {}", keyword);

        OperatorListResponse response = operatorService.searchOperators(keyword);

        return ResponseEntity.ok(response);
    }
}
