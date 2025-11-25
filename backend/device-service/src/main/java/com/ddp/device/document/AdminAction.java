package com.ddp.device.document;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

/**
 * 관리자 조치 문서 (MongoDB)
 * 이상 징후 발생 시 관리자가 취한 조치 내역을 저장
 */
@Document(collection = "admin_actions")
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class AdminAction {

    @Id
    private String actionId; // MongoDB ObjectId

    @Indexed
    private String logId; // 대상 로그 ID

    @Indexed
    private Long userId; // 대상 사용자 ID

    @Indexed
    private Long adminId; // 조치 실행 관리자 ID

    @Indexed
    private ActionType actionType; // 조치 유형

    private String actionDetail; // 조치 상세 내용

    @Indexed
    private ActionStatus status; // 조치 상태

    // 사용자 알림 정보
    private Boolean isRead; // 사용자 확인 여부
    private LocalDateTime readAt; // 사용자 확인 일시

    // TCS 연동 정보
    private Boolean tcsSynced; // TCS 연동 여부
    private String tcsResponse; // TCS 응답 내용

    // 메타데이터
    @Indexed
    private LocalDateTime createdAt; // 생성일시
    private LocalDateTime executedAt; // 실행일시
    private LocalDateTime completedAt; // 완료일시
    private LocalDateTime updatedAt; // 수정일시
}
