package com.ddp.reservation.service;

import com.ddp.reservation.dto.request.CreateReservationRequest;
import com.ddp.reservation.entity.Reservation;
import com.ddp.reservation.entity.ReservationStatus;
import com.ddp.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

// 예약 서비스
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ReservationService {

    private final ReservationRepository reservationRepository;

    // 예약 생성 (사용자)
    public Reservation createReservation(Long userId, CreateReservationRequest request) {
        log.info("API 호출 시작: 예약 생성 - 사용자 ID: {}, 업체 ID: {}", userId, request.getCompanyId());

        long startTime = System.currentTimeMillis();

        try {
            // 예약 엔티티 생성
            Reservation reservation = Reservation.builder()
                    .userId(userId) // Gateway 헤더에서 추출된 사용자 ID
                    .companyId(request.getCompanyId())
                    .serviceType(request.getServiceType())
                    .status(ReservationStatus.PENDING) // 초기 상태: 대기 중
                    .requestedDate(request.getRequestedDate())
                    .vehicleInfo(request.getVehicleInfo())
                    .notes(request.getNotes())
                    .build();

            // 예약 저장
            Reservation savedReservation = reservationRepository.save(reservation);

            log.info("API 호출 완료: 예약 생성 - 예약 ID: {} ({}ms)",
                    savedReservation.getReservationId(), System.currentTimeMillis() - startTime);

            return savedReservation;

        } catch (Exception e) {
            log.error("예약 생성 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("예약 생성에 실패했습니다.", e);
        }
    }

    // 예약 조회 (ID로)
    @Transactional(readOnly = true)
    public Optional<Reservation> findById(Long reservationId) {
        log.debug("예약 조회 - 예약 ID: {}", reservationId);
        return reservationRepository.findById(reservationId);
    }

    // 사용자의 예약 목록 조회
    @Transactional(readOnly = true)
    public List<Reservation> findByUserId(Long userId) {
        log.info("API 호출 시작: 사용자 예약 목록 조회 - 사용자 ID: {}", userId);

        long startTime = System.currentTimeMillis();

        List<Reservation> reservations = reservationRepository.findByUserIdOrderByCreatedAtDesc(userId);

        log.info("API 호출 완료: 사용자 예약 목록 조회 - {} 건 ({}ms)",
                reservations.size(), System.currentTimeMillis() - startTime);

        return reservations;
    }

    // 업체의 예약 목록 조회
    @Transactional(readOnly = true)
    public List<Reservation> findByCompanyId(Long companyId) {
        log.info("API 호출 시작: 업체 예약 목록 조회 - 업체 ID: {}", companyId);

        long startTime = System.currentTimeMillis();

        List<Reservation> reservations = reservationRepository.findByCompanyIdOrderByCreatedAtDesc(companyId);

        log.info("API 호출 완료: 업체 예약 목록 조회 - {} 건 ({}ms)",
                reservations.size(), System.currentTimeMillis() - startTime);

        return reservations;
    }

    // 전체 예약 목록 조회 (관리자용)
    @Transactional(readOnly = true)
    public List<Reservation> findAll() {
        log.info("API 호출 시작: 전체 예약 목록 조회 (관리자)");

        long startTime = System.currentTimeMillis();

        List<Reservation> reservations = reservationRepository.findAllByOrderByCreatedAtDesc();

        log.info("API 호출 완료: 전체 예약 목록 조회 - {} 건 ({}ms)",
                reservations.size(), System.currentTimeMillis() - startTime);

        return reservations;
    }

    // 예약 확정 (업체)
    public Reservation confirmReservation(Long reservationId, Long companyId) {
        log.info("API 호출 시작: 예약 확정 - 예약 ID: {}, 업체 ID: {}", reservationId, companyId);

        long startTime = System.currentTimeMillis();

        try {
            // 예약 조회
            Reservation reservation = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다: " + reservationId));

            // 권한 검증: 본인 업체의 예약인지 확인
            if (!reservation.getCompanyId().equals(companyId)) {
                log.warn("권한 없음 - 다른 업체의 예약 확정 시도: 예약 ID={}, 요청 업체 ID={}, 실제 업체 ID={}",
                        reservationId, companyId, reservation.getCompanyId());
                throw new IllegalArgumentException("권한이 없습니다");
            }

            // 상태 검증: PENDING 상태만 확정 가능
            if (reservation.getStatus() != ReservationStatus.PENDING) {
                throw new IllegalStateException("대기 중인 예약만 확정할 수 있습니다");
            }

            // 예약 확정 처리
            reservation.setStatus(ReservationStatus.CONFIRMED);
            reservation.setConfirmedDate(LocalDateTime.now());

            Reservation savedReservation = reservationRepository.save(reservation);

            log.info("API 호출 완료: 예약 확정 - 예약 ID: {} ({}ms)",
                    reservationId, System.currentTimeMillis() - startTime);

            return savedReservation;

        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("예약 확정 실패: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("예약 확정 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("예약 확정에 실패했습니다.", e);
        }
    }

    // 예약 거절 (업체)
    public Reservation rejectReservation(Long reservationId, Long companyId, String reason) {
        log.info("API 호출 시작: 예약 거절 - 예약 ID: {}, 업체 ID: {}", reservationId, companyId);

        long startTime = System.currentTimeMillis();

        try {
            // 예약 조회
            Reservation reservation = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다: " + reservationId));

            // 권한 검증
            if (!reservation.getCompanyId().equals(companyId)) {
                log.warn("권한 없음 - 다른 업체의 예약 거절 시도: 예약 ID={}, 요청 업체 ID={}, 실제 업체 ID={}",
                        reservationId, companyId, reservation.getCompanyId());
                throw new IllegalArgumentException("권한이 없습니다");
            }

            // 상태 검증
            if (reservation.getStatus() != ReservationStatus.PENDING) {
                throw new IllegalStateException("대기 중인 예약만 거절할 수 있습니다");
            }

            // 예약 거절 처리
            reservation.setStatus(ReservationStatus.REJECTED);
            reservation.setRejectedReason(reason);
            reservation.setRejectedAt(LocalDateTime.now());

            Reservation savedReservation = reservationRepository.save(reservation);

            log.info("API 호출 완료: 예약 거절 - 예약 ID: {} ({}ms)",
                    reservationId, System.currentTimeMillis() - startTime);

            return savedReservation;

        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("예약 거절 실패: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("예약 거절 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("예약 거절에 실패했습니다.", e);
        }
    }

    // 예약 취소 (사용자)
    public Reservation cancelReservation(Long reservationId, Long userId, String reason) {
        log.info("API 호출 시작: 예약 취소 - 예약 ID: {}, 사용자 ID: {}", reservationId, userId);

        long startTime = System.currentTimeMillis();

        try {
            // 예약 조회
            Reservation reservation = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다: " + reservationId));

            // 권한 검증: 본인의 예약인지 확인
            if (!reservation.getUserId().equals(userId)) {
                log.warn("권한 없음 - 다른 사용자의 예약 취소 시도: 예약 ID={}, 요청 사용자 ID={}, 실제 사용자 ID={}",
                        reservationId, userId, reservation.getUserId());
                throw new IllegalArgumentException("권한이 없습니다");
            }

            // 상태 검증: PENDING 또는 CONFIRMED 상태만 취소 가능
            if (reservation.getStatus() != ReservationStatus.PENDING &&
                reservation.getStatus() != ReservationStatus.CONFIRMED) {
                throw new IllegalStateException("대기 중이거나 확정된 예약만 취소할 수 있습니다");
            }

            // 24시간 취소 정책 확인 (CONFIRMED 상태인 경우에만)
            if (reservation.getStatus() == ReservationStatus.CONFIRMED &&
                reservation.getConfirmedDate() != null) {

                long hoursSinceConfirmation = Duration.between(
                        reservation.getConfirmedDate(),
                        LocalDateTime.now()
                ).toHours();

                if (hoursSinceConfirmation >= 24) {
                    throw new IllegalStateException("예약 확정 후 24시간이 지나 취소할 수 없습니다");
                }
            }

            // 예약 취소 처리
            reservation.setStatus(ReservationStatus.CANCELLED);
            reservation.setCancelledReason(reason);
            reservation.setCancelledAt(LocalDateTime.now());

            Reservation savedReservation = reservationRepository.save(reservation);

            log.info("API 호출 완료: 예약 취소 - 예약 ID: {} ({}ms)",
                    reservationId, System.currentTimeMillis() - startTime);

            return savedReservation;

        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("예약 취소 실패: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("예약 취소 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("예약 취소에 실패했습니다.", e);
        }
    }

    // 예약 완료 (업체)
    public Reservation completeReservation(Long reservationId, Long companyId) {
        log.info("API 호출 시작: 예약 완료 - 예약 ID: {}, 업체 ID: {}", reservationId, companyId);

        long startTime = System.currentTimeMillis();

        try {
            // 예약 조회
            Reservation reservation = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다: " + reservationId));

            // 권한 검증
            if (!reservation.getCompanyId().equals(companyId)) {
                log.warn("권한 없음 - 다른 업체의 예약 완료 시도: 예약 ID={}, 요청 업체 ID={}, 실제 업체 ID={}",
                        reservationId, companyId, reservation.getCompanyId());
                throw new IllegalArgumentException("권한이 없습니다");
            }

            // 상태 검증: CONFIRMED 상태만 완료 가능
            if (reservation.getStatus() != ReservationStatus.CONFIRMED) {
                throw new IllegalStateException("확정된 예약만 완료 처리할 수 있습니다");
            }

            // 예약 완료 처리
            reservation.setStatus(ReservationStatus.COMPLETED);
            reservation.setCompletedDate(LocalDateTime.now());

            Reservation savedReservation = reservationRepository.save(reservation);

            log.info("API 호출 완료: 예약 완료 - 예약 ID: {} ({}ms)",
                    reservationId, System.currentTimeMillis() - startTime);

            // TODO: 장치 등록 (device-service 호출) - 추후 구현
            // TODO: 서비스 이력 등록 (company-service 호출) - 추후 구현
            // TODO: 알림 발송 (notification-service 호출) - 추후 구현

            return savedReservation;

        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("예약 완료 실패: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("예약 완료 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("예약 완료 처리에 실패했습니다.", e);
        }
    }
}
