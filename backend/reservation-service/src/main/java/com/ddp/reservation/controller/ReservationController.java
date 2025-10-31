package com.ddp.reservation.controller;

import com.ddp.reservation.dto.request.CancelReservationRequest;
import com.ddp.reservation.dto.request.CreateReservationRequest;
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
import java.util.stream.Collectors;

// 예약 컨트롤러 (사용자용)
@RestController
@RequestMapping("/api/v1/reservations")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Reservation", description = "예약 API (사용자용)")
public class ReservationController {

    private final ReservationService reservationService;

    // 예약 생성
    @PostMapping
    @Operation(summary = "예약 생성", description = "사용자가 새로운 예약을 생성합니다")
    public ResponseEntity<ReservationResponse> createReservation(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role,
            @Valid @RequestBody CreateReservationRequest request
    ) {
        log.info("예약 생성 요청 - 사용자 ID: {}, 역할: {}", userId, role);

        // 권한 검증: USER만 예약 생성 가능
        if (!"USER".equals(role)) {
            log.warn("권한 없음 - 예약 생성은 USER 역할만 가능: userId={}, role={}", userId, role);
            return ResponseEntity.status(403).build();
        }

        try {
            // 예약 생성
            Reservation reservation = reservationService.createReservation(userId, request);

            // 응답 변환
            ReservationResponse response = ReservationResponse.from(reservation);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("예약 생성 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    // 사용자의 예약 목록 조회
    @GetMapping("/user/{userId}")
    @Operation(summary = "사용자 예약 목록 조회", description = "사용자의 모든 예약 목록을 조회합니다")
    public ResponseEntity<List<ReservationResponse>> getUserReservations(
            @RequestHeader("X-User-Id") Long requestUserId,
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long userId
    ) {
        log.info("사용자 예약 목록 조회 - 요청자: {}, 대상: {}", requestUserId, userId);

        // 권한 검증: 본인의 예약만 조회 가능 (또는 관리자)
        if (!requestUserId.equals(userId) && !"ADMIN".equals(role)) {
            log.warn("권한 없음 - 다른 사용자의 예약 조회 시도: 요청자={}, 대상={}", requestUserId, userId);
            return ResponseEntity.status(403).build();
        }

        try {
            // 예약 목록 조회
            List<Reservation> reservations = reservationService.findByUserId(userId);

            // 응답 변환
            List<ReservationResponse> responses = reservations.stream()
                    .map(ReservationResponse::from)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(responses);

        } catch (Exception e) {
            log.error("사용자 예약 목록 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    // 예약 상세 조회
    @GetMapping("/{id}")
    @Operation(summary = "예약 상세 조회", description = "예약 ID로 예약 상세 정보를 조회합니다")
    public ResponseEntity<ReservationResponse> getReservation(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id
    ) {
        log.info("예약 상세 조회 - 예약 ID: {}, 사용자 ID: {}", id, userId);

        try {
            // 예약 조회
            Reservation reservation = reservationService.findById(id)
                    .orElse(null);

            if (reservation == null) {
                log.warn("예약을 찾을 수 없음: {}", id);
                return ResponseEntity.notFound().build();
            }

            // 권한 검증: 본인의 예약 또는 관리자만 조회 가능
            if (!reservation.getUserId().equals(userId) && !"ADMIN".equals(role)) {
                log.warn("권한 없음 - 다른 사용자의 예약 조회 시도: 예약 ID={}, 요청자={}", id, userId);
                return ResponseEntity.status(403).build();
            }

            // 응답 변환
            ReservationResponse response = ReservationResponse.from(reservation);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("예약 상세 조회 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }

    // 예약 취소
    @DeleteMapping("/{id}")
    @Operation(summary = "예약 취소", description = "사용자가 예약을 취소합니다")
    public ResponseEntity<ReservationResponse> cancelReservation(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-User-Role") String role,
            @PathVariable Long id,
            @RequestBody(required = false) CancelReservationRequest request
    ) {
        log.info("예약 취소 요청 - 예약 ID: {}, 사용자 ID: {}", id, userId);

        // 권한 검증: USER만 취소 가능
        if (!"USER".equals(role)) {
            log.warn("권한 없음 - 예약 취소는 USER 역할만 가능: userId={}, role={}", userId, role);
            return ResponseEntity.status(403).build();
        }

        try {
            // 취소 사유 추출
            String reason = (request != null && request.getReason() != null) ? request.getReason() : "사용자 취소";

            // 예약 취소 (서비스에서 권한 검증 포함)
            Reservation reservation = reservationService.cancelReservation(id, userId, reason);

            // 응답 변환
            ReservationResponse response = ReservationResponse.from(reservation);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("예약 취소 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("예약 취소 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }
}
