package com.ddp.device.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

// 장치 엔티티
@Entity
@Table(name = "devices")
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class Device {

    // 장치 ID (Primary Key)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "device_id")
    private Long deviceId;

    // 장치 시리얼 번호 (고유)
    @Column(name = "serial_number", nullable = false, unique = true, length = 100)
    private String serialNumber;

    // 모델명
    @Column(name = "model_name", nullable = false, length = 100)
    private String modelName;

    // 제조업체 ID
    @Column(name = "manufacturer_id")
    private Long manufacturerId;

    // 사용자 ID (설치 완료 시 매핑)
    @Column(name = "user_id")
    private Long userId;

    // 설치 업체 ID
    @Column(name = "company_id")
    private Long companyId;

    // 장치 상태
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private DeviceStatus status;

    // 설치일
    @Column(name = "install_date")
    private LocalDate installDate;

    // 마지막 검·교정일
    @Column(name = "last_inspection_date")
    private LocalDate lastInspectionDate;

    // 다음 검·교정 예정일
    @Column(name = "next_inspection_date")
    private LocalDate nextInspectionDate;

    // 보증 종료일
    @Column(name = "warranty_end_date")
    private LocalDate warrantyEndDate;

    // 생성 일시
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // 수정 일시
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // JPA 생명주기 콜백: 엔티티 생성 시 자동으로 timestamps 설정
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = DeviceStatus.AVAILABLE; // 기본 상태: 사용 가능
        }
    }

    // JPA 생명주기 콜백: 엔티티 수정 시 자동으로 updatedAt 갱신
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
