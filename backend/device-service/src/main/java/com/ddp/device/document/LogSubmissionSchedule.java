package com.ddp.device.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 로그 제출 일정 문서 (MongoDB)
 * 사용자별 로그 제출 주기 및 일정 관리
 */
@Document(collection = "log_submission_schedules")
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class LogSubmissionSchedule {

    @Id
    private String scheduleId; // MongoDB ObjectId

    @Indexed(unique = true)
    private Long userId; // 사용자 ID (1:1 관계)

    @Indexed
    private Long deviceId; // 장치 ID

    private SubmissionFrequency frequency; // 제출 주기 (WEEKLY, BIWEEKLY, MONTHLY, QUARTERLY)

    private LocalDate lastSubmissionDate; // 마지막 제출일
    private LocalDate nextDueDate; // 다음 제출 기한

    private Integer missedSubmissions; // 미제출 횟수

    // 메타데이터
    private LocalDateTime createdAt; // 생성일시
    private LocalDateTime updatedAt; // 수정일시
}
