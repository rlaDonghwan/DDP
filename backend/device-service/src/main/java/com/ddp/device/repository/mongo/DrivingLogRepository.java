package com.ddp.device.repository.mongo;

import com.ddp.device.document.AnomalyType;
import com.ddp.device.document.DrivingLog;
import com.ddp.device.document.LogStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 운행기록 로그 리포지토리 (MongoDB)
 */
@Repository
public interface DrivingLogRepository extends MongoRepository<DrivingLog, String> {

    // 장치 ID로 로그 조회
    List<DrivingLog> findByDeviceId(Long deviceId);
    Page<DrivingLog> findByDeviceId(Long deviceId, Pageable pageable);

    // 사용자 ID로 로그 조회
    List<DrivingLog> findByUserId(Long userId);
    Page<DrivingLog> findByUserId(Long userId, Pageable pageable);

    // 상태로 로그 조회
    List<DrivingLog> findByStatus(LogStatus status);
    Page<DrivingLog> findByStatus(LogStatus status, Pageable pageable);

    // 이상 징후 유형으로 로그 조회
    List<DrivingLog> findByAnomalyType(AnomalyType anomalyType);
    Page<DrivingLog> findByAnomalyType(AnomalyType anomalyType, Pageable pageable);

    // 장치의 최근 로그 조회
    DrivingLog findFirstByDeviceIdOrderBySubmitDateDesc(Long deviceId);

    // 사용자의 최근 로그 조회
    DrivingLog findFirstByUserIdOrderBySubmitDateDesc(Long userId);

    // 장치의 로그 개수
    long countByDeviceId(Long deviceId);

    // 사용자의 로그 개수
    long countByUserId(Long userId);

    // 특정 기간 동안의 로그 조회
    List<DrivingLog> findBySubmitDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    // 장치와 상태로 로그 조회
    List<DrivingLog> findByDeviceIdAndStatus(Long deviceId, LogStatus status);

    // 검토가 필요한 로그 (FLAGGED 또는 UNDER_REVIEW 상태)
    List<DrivingLog> findByStatusIn(List<LogStatus> statuses);
    Page<DrivingLog> findByStatusIn(List<LogStatus> statuses, Pageable pageable);

    // 이상 징후가 있는 로그 (NORMAL이 아닌 것들)
    List<DrivingLog> findByAnomalyTypeNot(AnomalyType anomalyType);
    Page<DrivingLog> findByAnomalyTypeNot(AnomalyType anomalyType, Pageable pageable);
}
