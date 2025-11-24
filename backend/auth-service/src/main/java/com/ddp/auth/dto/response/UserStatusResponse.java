package com.ddp.auth.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * 사용자 현황 정보 응답 DTO
 * 프론트엔드 UserStatus 인터페이스와 매핑
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserStatusResponse {

    private Boolean deviceInstalled; // 장치 설치 여부
    private Long deviceId; // 장치 ID (DB primary key)
    private String deviceStatus; // 장치 상태: "normal", "maintenance", "warning"
    private String deviceModel; // 장치 모델명
    private String deviceSerialNumber; // 장치 시리얼 번호
    private String vehicleInfo; // 장착된 차량 정보
    private LocalDate nextInspectionDate; // 다음 검교정 예정일
    private LocalDate nextLogSubmitDate; // 다음 로그 제출 예정일
    private LocalDate lastLogSubmitDate; // 최근 로그 제출일
    private Integer totalLogSubmits; // 총 로그 제출 횟수
    private Integer pendingNotifications; // 미확인 알림 수

    /**
     * 장치 미설치 상태 응답 생성
     */
    public static UserStatusResponse noDevice() {
        return UserStatusResponse.builder()
                .deviceInstalled(false)
                .deviceStatus("normal")
                .totalLogSubmits(0)
                .pendingNotifications(0)
                .build();
    }

    /**
     * 장치 설치 상태 응답 생성
     */
    public static UserStatusResponse withDevice(
            Long deviceId,
            String deviceModel,
            String deviceSerialNumber,
            String deviceStatus,
            String vehicleInfo,
            LocalDate nextInspectionDate) {

        return UserStatusResponse.builder()
                .deviceInstalled(true)
                .deviceId(deviceId)
                .deviceStatus(deviceStatus != null ? deviceStatus.toString() : "INSTALLED")
                .deviceModel(deviceModel)
                .deviceSerialNumber(deviceSerialNumber)
                .vehicleInfo(vehicleInfo)
                .nextInspectionDate(nextInspectionDate)
                .totalLogSubmits(0) // TODO: log-service 연동 후 실제 값 설정
                .pendingNotifications(0) // TODO: notification-service 연동 후 실제 값 설정
                .build();
    }
}
