package com.ddp.reservation.controller;

import com.ddp.reservation.dto.response.ReservationResponse;
import com.ddp.reservation.entity.Reservation;
import com.ddp.reservation.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

// 관리자 예약 컨트롤러 (관리자용)
@RestController
@RequestMapping("/api/v1/admin/reservations")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Admin Reservation", description = "예약 API (관리자용)")
public class AdminReservationController {

    private final ReservationService reservationService;

    // 전체 예약 목록 조회
    @GetMapping
    @Operation(summary = "전체 예약 목록 조회", description = "관리자가 전체 예약 목록을 조회합니다")
    public ResponseEntity<List<ReservationResponse>> getAllReservations(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role
    ) {
        log.info("전체 예약 목록 조회 - 관리자 ID: {}", userId);

        // 권한 검증: ADMIN만 조회 가능
        if (!"ADMIN".equals(role)) {
            log.warn("권한 없음 - 전체 예약 조회는 ADMIN 역할만 가능: userId={}, role={}", userId, role);
            return ResponseEntity.status(403).build();
        }

        try {
            // 전체 예약 목록 조회
            List<Reservation> reservations = reservationService.findAll();

            // 응답 변환
            List<ReservationResponse> responses = reservations.stream()
                    .map(ReservationResponse::from)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(responses);

        } catch (Exception e) {
            log.error("전체 예약 목록 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }
}
