package com.ddp.reservation.repository;

import com.ddp.reservation.entity.Reservation;
import com.ddp.reservation.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// 예약 레포지토리
@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    // 사용자 ID로 예약 목록 조회 (최신순)
    List<Reservation> findByUserIdOrderByCreatedAtDesc(Long userId);

    // 업체 ID로 예약 목록 조회 (최신순)
    List<Reservation> findByCompanyIdOrderByCreatedAtDesc(Long companyId);

    // 업체 ID와 상태로 예약 목록 조회 (최신순)
    List<Reservation> findByCompanyIdAndStatusOrderByCreatedAtDesc(Long companyId, ReservationStatus status);

    // 업체 ID와 여러 상태로 예약 목록 조회 (최신순)
    List<Reservation> findByCompanyIdAndStatusInOrderByCreatedAtDesc(Long companyId, List<ReservationStatus> statuses);

    // 상태로 예약 목록 조회 (관리자용, 최신순)
    List<Reservation> findByStatusOrderByCreatedAtDesc(ReservationStatus status);

    // 전체 예약 목록 조회 (관리자용, 최신순)
    List<Reservation> findAllByOrderByCreatedAtDesc();
}
