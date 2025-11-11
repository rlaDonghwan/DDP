package com.ddp.device.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 장치 상세 + 로그 통계 응답 DTO
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeviceWithLogStatsResponse {

    // 장치 정보
    private DeviceResponse device;

    // 로그 통계
    private LogStats logStats;

    /**
     * 로그 통계 정보
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LogStats {
        private Long totalLogCount; // 총 로그 제출 횟수
        private LocalDateTime lastLogSubmitDate; // 마지막 로그 제출일
        private LocalDateTime nextLogDueDate; // 다음 로그 제출 기한
        private Integer flaggedLogCount; // 이상 징후 로그 개수
        private Boolean isOverdue; // 제출 기한 초과 여부
    }
}
