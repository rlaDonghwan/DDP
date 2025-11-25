package com.ddp.device.service;

import com.ddp.device.document.LogSubmissionSchedule;
import com.ddp.device.document.SubmissionFrequency;
import com.ddp.device.repository.mongo.LogSubmissionScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * 로그 제출 일정 서비스
 * 사용자별 로그 제출 주기 및 일정을 관리
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class LogSubmissionScheduleService {

    private final LogSubmissionScheduleRepository scheduleRepository;

    /**
     * 사용자별 일정 조회
     * @param userId 사용자 ID
     * @return 로그 제출 일정
     */
    public LogSubmissionSchedule getSchedule(Long userId) {
        log.info("로그 제출 일정 조회: userId={}", userId);
        return scheduleRepository.findByUserId(userId)
                .orElse(null);
    }

    /**
     * 일정 생성 또는 업데이트
     * @param userId 사용자 ID
     * @param deviceId 장치 ID
     * @param frequency 제출 주기
     * @return 생성/업데이트된 일정
     */
    @Transactional
    public LogSubmissionSchedule createOrUpdateSchedule(
            Long userId,
            Long deviceId,
            SubmissionFrequency frequency
    ) {
        log.info("로그 제출 일정 생성/업데이트: userId={}, deviceId={}, frequency={}",
                userId, deviceId, frequency);

        LogSubmissionSchedule schedule = scheduleRepository.findByUserId(userId)
                .orElse(LogSubmissionSchedule.builder()
                        .userId(userId)
                        .deviceId(deviceId)
                        .frequency(frequency)
                        .missedSubmissions(0)
                        .createdAt(LocalDateTime.now())
                        .build());

        // 주기 변경 시 다음 제출 기한 재계산
        if (schedule.getFrequency() != frequency) {
            log.info("제출 주기 변경: {} -> {}", schedule.getFrequency(), frequency);
            schedule.setFrequency(frequency);

            // 마지막 제출일이 있으면 그 기준으로, 없으면 오늘 기준으로 계산
            LocalDate baseDate = schedule.getLastSubmissionDate() != null
                    ? schedule.getLastSubmissionDate()
                    : LocalDate.now();

            schedule.setNextDueDate(baseDate.plusDays(frequency.getDays()));
        }

        schedule.setUpdatedAt(LocalDateTime.now());
        LogSubmissionSchedule savedSchedule = scheduleRepository.save(schedule);

        log.info("로그 제출 일정 저장 완료: scheduleId={}, nextDueDate={}",
                savedSchedule.getScheduleId(), savedSchedule.getNextDueDate());

        return savedSchedule;
    }

    /**
     * 로그 제출 시 일정 업데이트
     * @param userId 사용자 ID
     * @param submissionDate 제출일
     */
    @Transactional
    public void updateScheduleOnSubmission(Long userId, LocalDate submissionDate) {
        log.info("로그 제출에 따른 일정 업데이트: userId={}, submissionDate={}", userId, submissionDate);

        LogSubmissionSchedule schedule = scheduleRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("일정을 찾을 수 없습니다: userId=" + userId));

        // 마지막 제출일 업데이트
        schedule.setLastSubmissionDate(submissionDate);

        // 다음 제출 기한 계산
        LocalDate nextDueDate = submissionDate.plusDays(schedule.getFrequency().getDays());
        schedule.setNextDueDate(nextDueDate);

        // 기한 내 제출한 경우 미제출 횟수 초기화
        if (submissionDate.isBefore(schedule.getNextDueDate()) ||
            submissionDate.isEqual(schedule.getNextDueDate())) {
            log.info("기한 내 제출 완료: missedSubmissions 초기화");
            schedule.setMissedSubmissions(0);
        }

        schedule.setUpdatedAt(LocalDateTime.now());
        scheduleRepository.save(schedule);

        log.info("일정 업데이트 완료: nextDueDate={}", nextDueDate);
    }

    /**
     * 제출 주기 변경 (관리자 조치)
     * @param userId 사용자 ID
     * @param newFrequency 새 제출 주기
     * @return 업데이트된 일정
     */
    @Transactional
    public LogSubmissionSchedule changeSubmissionFrequency(Long userId, SubmissionFrequency newFrequency) {
        log.info("제출 주기 변경 (관리자 조치): userId={}, newFrequency={}", userId, newFrequency);

        LogSubmissionSchedule schedule = scheduleRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("일정을 찾을 수 없습니다: userId=" + userId));

        SubmissionFrequency oldFrequency = schedule.getFrequency();
        schedule.setFrequency(newFrequency);

        // 다음 제출 기한 재계산
        LocalDate baseDate = schedule.getLastSubmissionDate() != null
                ? schedule.getLastSubmissionDate()
                : LocalDate.now();

        LocalDate newNextDueDate = baseDate.plusDays(newFrequency.getDays());
        schedule.setNextDueDate(newNextDueDate);

        schedule.setUpdatedAt(LocalDateTime.now());
        LogSubmissionSchedule updatedSchedule = scheduleRepository.save(schedule);

        log.info("제출 주기 변경 완료: {} -> {}, nextDueDate={}",
                oldFrequency, newFrequency, newNextDueDate);

        return updatedSchedule;
    }

    /**
     * 제출 기한 초과 처리
     * 스케줄러에서 주기적으로 호출하여 미제출 횟수 증가
     * @return 처리된 일정 목록
     */
    @Transactional
    public List<LogSubmissionSchedule> processOverdueSchedules() {
        log.info("제출 기한 초과 일정 처리 시작");

        LocalDate today = LocalDate.now();
        List<LogSubmissionSchedule> overdueSchedules = scheduleRepository.findByNextDueDateBefore(today);

        log.info("제출 기한 초과 일정: {}건", overdueSchedules.size());

        for (LogSubmissionSchedule schedule : overdueSchedules) {
            // 미제출 횟수 증가
            schedule.setMissedSubmissions(schedule.getMissedSubmissions() + 1);

            // 다음 기한을 현재 주기만큼 연장 (다음 체크를 위해)
            schedule.setNextDueDate(schedule.getNextDueDate().plusDays(schedule.getFrequency().getDays()));

            schedule.setUpdatedAt(LocalDateTime.now());
            scheduleRepository.save(schedule);

            log.warn("미제출 처리: userId={}, missedSubmissions={}, newNextDueDate={}",
                    schedule.getUserId(),
                    schedule.getMissedSubmissions(),
                    schedule.getNextDueDate());
        }

        log.info("제출 기한 초과 일정 처리 완료: {}건", overdueSchedules.size());
        return overdueSchedules;
    }

    /**
     * D-day 계산
     * @param userId 사용자 ID
     * @return D-day (양수: 남은 일수, 음수: 초과 일수, 0: 오늘)
     */
    public Long calculateDday(Long userId) {
        LogSubmissionSchedule schedule = scheduleRepository.findByUserId(userId)
                .orElse(null);

        if (schedule == null || schedule.getNextDueDate() == null) {
            return null;
        }

        LocalDate today = LocalDate.now();
        return ChronoUnit.DAYS.between(today, schedule.getNextDueDate());
    }

    /**
     * 미제출 횟수가 특정 값 이상인 사용자 조회
     * @param count 미제출 횟수
     * @return 일정 목록
     */
    public List<LogSubmissionSchedule> getSchedulesWithMissedSubmissions(Integer count) {
        log.info("미제출 횟수 {}회 이상 일정 조회", count);
        return scheduleRepository.findByMissedSubmissionsGreaterThanEqual(count);
    }

    /**
     * 제출 기한이 임박한 사용자 조회
     * @param daysAhead 며칠 이내 (예: 3일 이내)
     * @return 일정 목록
     */
    public List<LogSubmissionSchedule> getSchedulesDueSoon(int daysAhead) {
        log.info("제출 기한 {}일 이내 일정 조회", daysAhead);
        LocalDate targetDate = LocalDate.now().plusDays(daysAhead);
        return scheduleRepository.findByNextDueDateBefore(targetDate);
    }

    /**
     * 모든 일정 조회
     * @return 일정 목록
     */
    public List<LogSubmissionSchedule> getAllSchedules() {
        log.info("전체 로그 제출 일정 조회");
        return scheduleRepository.findAll();
    }

    /**
     * 일정 삭제
     * @param userId 사용자 ID
     */
    @Transactional
    public void deleteSchedule(Long userId) {
        log.info("로그 제출 일정 삭제: userId={}", userId);
        scheduleRepository.findByUserId(userId)
                .ifPresent(schedule -> {
                    scheduleRepository.delete(schedule);
                    log.info("일정 삭제 완료: scheduleId={}", schedule.getScheduleId());
                });
    }
}
