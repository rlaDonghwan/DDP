package com.ddp.device.controller;

import com.ddp.device.document.LogSubmissionSchedule;
import com.ddp.device.document.SubmissionFrequency;
import com.ddp.device.dto.schedule.ChangeFrequencyRequest;
import com.ddp.device.dto.schedule.CreateScheduleRequest;
import com.ddp.device.dto.schedule.DdayResponse;
import com.ddp.device.service.LogSubmissionScheduleService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 로그 제출 일정 컨트롤러
 * 사용자별 로그 제출 주기 및 일정 관리
 */
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "LogSubmissionSchedule", description = "로그 제출 일정 API")
public class LogSubmissionScheduleController {

    private final LogSubmissionScheduleService scheduleService;

    /**
     * 사용자별 로그 제출 일정 조회 (사용자용)
     */
    @GetMapping("/users/{userId}/log-schedule")
    @Operation(summary = "로그 제출 일정 조회", description = "사용자의 로그 제출 일정을 조회합니다")
    public ResponseEntity<LogSubmissionSchedule> getSchedule(@PathVariable Long userId) {
        log.info("로그 제출 일정 조회: userId={}", userId);

        LogSubmissionSchedule schedule = scheduleService.getSchedule(userId);
        return ResponseEntity.ok(schedule);
    }

    /**
     * 로그 제출 일정 생성 (관리자용)
     */
    @PostMapping("/admin/log-schedules")
    @Operation(summary = "로그 제출 일정 생성", description = "사용자의 로그 제출 일정을 생성합니다")
    public ResponseEntity<LogSubmissionSchedule> createSchedule(@Valid @RequestBody CreateScheduleRequest request) {
        log.info("로그 제출 일정 생성: userId={}, deviceId={}, frequency={}",
                request.getUserId(), request.getDeviceId(), request.getFrequency());

        LogSubmissionSchedule schedule = scheduleService.createOrUpdateSchedule(
                request.getUserId(),
                request.getDeviceId(),
                request.getFrequency()
        );

        return ResponseEntity.ok(schedule);
    }

    /**
     * 제출 주기 변경 (관리자 조치)
     */
    @PatchMapping("/users/{userId}/log-schedule/frequency")
    @Operation(summary = "로그 제출 주기 변경", description = "관리자가 사용자의 로그 제출 주기를 변경합니다")
    public ResponseEntity<LogSubmissionSchedule> changeFrequency(
            @PathVariable Long userId,
            @Valid @RequestBody ChangeFrequencyRequest request) {

        log.info("로그 제출 주기 변경: userId={}, newFrequency={}", userId, request.getFrequency());

        LogSubmissionSchedule schedule = scheduleService.changeSubmissionFrequency(userId, request.getFrequency());
        return ResponseEntity.ok(schedule);
    }

    /**
     * D-day 계산 (사용자용)
     */
    @GetMapping("/users/{userId}/log-schedule/dday")
    @Operation(summary = "D-day 계산", description = "다음 로그 제출까지 남은 일수를 계산합니다")
    public ResponseEntity<DdayResponse> calculateDday(@PathVariable Long userId) {
        log.info("D-day 계산: userId={}", userId);

        Long dday = scheduleService.calculateDday(userId);

        if (dday == null) {
            return ResponseEntity.ok(DdayResponse.builder()
                    .userId(userId)
                    .dday(null)
                    .message("일정이 설정되지 않았습니다")
                    .build());
        }

        String message;
        if (dday > 0) {
            message = String.format("D-%d (제출까지 %d일 남음)", dday, dday);
        } else if (dday == 0) {
            message = "D-Day (오늘까지 제출)";
        } else {
            message = String.format("D+%d (%d일 초과)", Math.abs(dday), Math.abs(dday));
        }

        return ResponseEntity.ok(DdayResponse.builder()
                .userId(userId)
                .dday(dday)
                .message(message)
                .build());
    }

    /**
     * 전체 일정 목록 조회 (관리자용)
     */
    @GetMapping("/admin/log-schedules")
    @Operation(summary = "전체 로그 제출 일정 조회", description = "모든 사용자의 로그 제출 일정을 조회합니다")
    public ResponseEntity<List<LogSubmissionSchedule>> getAllSchedules() {
        log.info("전체 로그 제출 일정 조회");

        List<LogSubmissionSchedule> schedules = scheduleService.getAllSchedules();
        return ResponseEntity.ok(schedules);
    }

    /**
     * 미제출 횟수가 특정 값 이상인 사용자 조회 (관리자용)
     */
    @GetMapping("/admin/log-schedules/missed")
    @Operation(summary = "미제출 사용자 조회", description = "미제출 횟수가 특정 값 이상인 사용자를 조회합니다")
    public ResponseEntity<List<LogSubmissionSchedule>> getSchedulesWithMissedSubmissions(
            @RequestParam(defaultValue = "3") Integer count) {

        log.info("미제출 {}회 이상 사용자 조회", count);

        List<LogSubmissionSchedule> schedules = scheduleService.getSchedulesWithMissedSubmissions(count);
        return ResponseEntity.ok(schedules);
    }

    /**
     * 제출 기한이 임박한 사용자 조회 (관리자용)
     */
    @GetMapping("/admin/log-schedules/due-soon")
    @Operation(summary = "제출 기한 임박 사용자 조회", description = "제출 기한이 며칠 이내인 사용자를 조회합니다")
    public ResponseEntity<List<LogSubmissionSchedule>> getSchedulesDueSoon(
            @RequestParam(defaultValue = "3") int daysAhead) {

        log.info("제출 기한 {}일 이내 사용자 조회", daysAhead);

        List<LogSubmissionSchedule> schedules = scheduleService.getSchedulesDueSoon(daysAhead);
        return ResponseEntity.ok(schedules);
    }
}
