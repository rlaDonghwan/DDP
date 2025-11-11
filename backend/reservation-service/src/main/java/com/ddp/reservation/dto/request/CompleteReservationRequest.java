package com.ddp.reservation.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

// 예약 완료 요청 DTO
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Schema(description = "예약 완료 요청 (서비스 타입별 필수 필드 포함)")
public class CompleteReservationRequest {

    // ========== 공통 필드 (모든 서비스 타입) ==========

    // 완료 일시
    @NotNull(message = "완료 일시는 필수입니다")
    @Schema(description = "서비스 완료 일시", example = "2025-11-15T14:30:00", required = true)
    private LocalDateTime completedDate;

    // 비용
    @Schema(description = "서비스 비용 (원)", example = "150000")
    private BigDecimal cost;

    // 특이사항
    @Schema(description = "특이사항 또는 추가 메모", example = "정상적으로 설치 완료됨")
    private String notes;

    // ========== INSTALLATION (신규 설치) 전용 필드 ==========

    // 장치 시리얼 번호
    @Schema(description = "[INSTALLATION 전용] 장치 시리얼 번호", example = "DDP-2025-001")
    private String deviceSerialNumber;

    // 장치 모델명
    @Schema(description = "[INSTALLATION 전용] 장치 모델명", example = "DDP-X100")
    private String modelName;

    // 제조업체 ID
    @Schema(description = "[INSTALLATION 전용] 제조업체 ID", example = "1")
    private Long manufacturerId;

    // 보증 종료일
    @Schema(description = "[INSTALLATION 전용] 보증 종료일", example = "2026-11-15")
    private LocalDate warrantyEndDate;

    // ========== INSPECTION (검·교정) 전용 필드 ==========

    // 검사 결과
    @Schema(description = "[INSPECTION 전용] 검사 결과 (PASS, FAIL, CONDITIONAL_PASS)", example = "PASS")
    private InspectionResult inspectionResult;

    // 다음 검사 예정일
    @Schema(description = "[INSPECTION 전용] 다음 검사 예정일", example = "2026-05-15")
    private LocalDate nextInspectionDate;

    // 장치 ID (검사 대상 장치)
    @Schema(description = "[INSPECTION 전용] 검사 대상 장치 ID", example = "1")
    private Long deviceId;

    // ========== REPAIR/MAINTENANCE (수리/유지보수) 전용 필드 ==========

    // 작업 내용
    @Schema(description = "[REPAIR/MAINTENANCE 전용] 작업 내용", example = "센서 모듈 교체, 펌웨어 업데이트")
    private String workDescription;

    // 교체 부품
    @Schema(description = "[REPAIR/MAINTENANCE 전용] 교체된 부품 목록", example = "센서 모듈, 케이블")
    private String replacedParts;

    // 장치 ID (수리 대상 장치)
    @Schema(description = "[REPAIR/MAINTENANCE 전용] 수리 대상 장치 ID", example = "1")
    private Long repairDeviceId;

    // ========== 내부 Enum: 검사 결과 ==========
    public enum InspectionResult {
        PASS,               // 합격
        FAIL,               // 불합격
        CONDITIONAL_PASS    // 조건부 합격
    }
}
