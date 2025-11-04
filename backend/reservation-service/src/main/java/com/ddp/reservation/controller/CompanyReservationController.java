package com.ddp.reservation.controller;

import com.ddp.reservation.dto.request.RejectReservationRequest;
import com.ddp.reservation.dto.response.ReservationResponse;
import com.ddp.reservation.entity.Reservation;
import com.ddp.reservation.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// 업체 예약 컨트롤러 (업체용)
@RestController
@RequestMapping("/api/v1/reservations/company")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Company Reservation", description = "예약 API (업체용)")
public class CompanyReservationController {

    private final ReservationService reservationService;

    // 업체의 예약 목록 조회
    @GetMapping
    @Operation(summary = "업체 예약 목록 조회", description = "업체가 자신에게 할당된 예약 목록을 조회합니다")
    public ResponseEntity<List<ReservationResponse>> getCompanyReservations(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader(value = "X-Company-Id", required = false) Long companyId
    ) {
        log.info("업체 예약 목록 조회 - 사용자 ID: {}, 역할: {}, 업체 ID: {}", userId, role, companyId);

        // 권한 검증: COMPANY 역할만 조회 가능
        if (!"COMPANY".equals(role)) {
            log.warn("권한 없음 - 업체 예약 조회는 COMPANY 역할만 가능: userId={}, role={}", userId, role);
            return ResponseEntity.status(403).build();
        }

        // companyId 검증
        if (companyId == null) {
            log.error("companyId가 null - JWT 또는 Gateway 설정 오류: userId={}", userId);
            return ResponseEntity.status(500).build();
        }

        try {
            // 업체 예약 목록 조회 (사용자 정보 포함)
            List<ReservationResponse> responses = reservationService.findByCompanyIdWithUserInfo(companyId);

            return ResponseEntity.ok(responses);

        } catch (Exception e) {
            log.error("업체 예약 목록 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    // 예약 확정
    @PostMapping("/{id}/confirm")
    @Operation(summary = "예약 확정", description = "업체가 예약을 확정합니다")
    public ResponseEntity<ReservationResponse> confirmReservation(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader(value = "X-Company-Id", required = false) Long companyId,
            @PathVariable Long id
    ) {
        log.info("예약 확정 요청 - 예약 ID: {}, 업체 ID: {}", id, companyId);

        // 권한 검증: COMPANY 역할만 가능
        if (!"COMPANY".equals(role)) {
            log.warn("권한 없음 - 예약 확정은 COMPANY 역할만 가능: userId={}, role={}", userId, role);
            return ResponseEntity.status(403).build();
        }

        // companyId 검증
        if (companyId == null) {
            log.error("companyId가 null - JWT 또는 Gateway 설정 오류: userId={}", userId);
            return ResponseEntity.status(500).build();
        }

        try {
            // 예약 확정 (서비스에서 권한 검증 포함)
            Reservation reservation = reservationService.confirmReservation(id, companyId);

            // 응답 변환
            ReservationResponse response = ReservationResponse.from(reservation);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("예약 확정 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("예약 확정 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    // 예약 거절
    @PostMapping("/{id}/reject")
    @Operation(summary = "예약 거절", description = "업체가 예약을 거절합니다")
    public ResponseEntity<ReservationResponse> rejectReservation(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader(value = "X-Company-Id", required = false) Long companyId,
            @PathVariable Long id,
            @Valid @RequestBody RejectReservationRequest request
    ) {
        log.info("예약 거절 요청 - 예약 ID: {}, 업체 ID: {}", id, companyId);

        // 권한 검증: COMPANY 역할만 가능
        if (!"COMPANY".equals(role)) {
            log.warn("권한 없음 - 예약 거절은 COMPANY 역할만 가능: userId={}, role={}", userId, role);
            return ResponseEntity.status(403).build();
        }

        // companyId 검증
        if (companyId == null) {
            log.error("companyId가 null - JWT 또는 Gateway 설정 오류: userId={}", userId);
            return ResponseEntity.status(500).build();
        }

        try {
            // 예약 거절 (서비스에서 권한 검증 포함)
            Reservation reservation = reservationService.rejectReservation(id, companyId, request.getReason());

            // 응답 변환
            ReservationResponse response = ReservationResponse.from(reservation);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("예약 거절 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("예약 거절 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    // 예약 완료
    @PostMapping("/{id}/complete")
    @Operation(summary = "예약 완료", description = "업체가 서비스 완료 후 예약을 완료 처리합니다")
    public ResponseEntity<ReservationResponse> completeReservation(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role,
            @RequestHeader(value = "X-Company-Id", required = false) Long companyId,
            @PathVariable Long id
    ) {
        log.info("예약 완료 요청 - 예약 ID: {}, 업체 ID: {}", id, companyId);

        // 권한 검증: COMPANY 역할만 가능
        if (!"COMPANY".equals(role)) {
            log.warn("권한 없음 - 예약 완료는 COMPANY 역할만 가능: userId={}, role={}", userId, role);
            return ResponseEntity.status(403).build();
        }

        // companyId 검증
        if (companyId == null) {
            log.error("companyId가 null - JWT 또는 Gateway 설정 오류: userId={}", userId);
            return ResponseEntity.status(500).build();
        }

        try {
            // 예약 완료 (서비스에서 권한 검증 포함)
            Reservation reservation = reservationService.completeReservation(id, companyId);

            // 응답 변환
            ReservationResponse response = ReservationResponse.from(reservation);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("예약 완료 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("예약 완료 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }
}
