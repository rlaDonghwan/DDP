package com.ddp.device.repository.mongo;

import com.ddp.device.document.LogSubmissionSchedule;
import com.ddp.device.document.SubmissionFrequency;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * 로그 제출 일정 Repository
 */
@Repository
public interface LogSubmissionScheduleRepository extends MongoRepository<LogSubmissionSchedule, String> {

    /**
     * 사용자별 일정 조회
     */
    Optional<LogSubmissionSchedule> findByUserId(Long userId);

    /**
     * 장치별 일정 조회
     */
    Optional<LogSubmissionSchedule> findByDeviceId(Long deviceId);

    /**
     * 제출 주기별 조회
     */
    List<LogSubmissionSchedule> findByFrequency(SubmissionFrequency frequency);

    /**
     * 제출 기한이 지난 일정 조회
     */
    List<LogSubmissionSchedule> findByNextDueDateBefore(LocalDate date);

    /**
     * 미제출 횟수가 특정 값 이상인 일정 조회
     */
    List<LogSubmissionSchedule> findByMissedSubmissionsGreaterThanEqual(Integer count);
}
