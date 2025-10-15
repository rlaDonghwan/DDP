package com.ddp.company.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

// 서비스 이력 엔티티 클래스
@Entity
@Table(name = "service_records")
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
@Getter
public class ServiceRecord {

    // 서비스 이력 고유 ID (기본키)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 서비스 유형
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ServiceType type;

    // 대상자 ID
    @Column(nullable = false)
    private String subjectId;

    // 대상자 이름
    @Column(nullable = false)
    private String subjectName;

    // 장치 ID
    @Column(nullable = false)
    private String deviceId;

    // 장치 시리얼 번호
    @Column(nullable = false)
    private String deviceSerialNumber;

    // 서비스 설명
    @Column(columnDefinition = "TEXT")
    private String description;

    // 서비스 수행 일시
    @Column(nullable = false)
    private LocalDateTime performedAt;

    // 담당자 이름
    @Column(nullable = false)
    private String performedBy;

    // 비용 (옵션)
    @Column(precision = 10, scale = 2)
    private BigDecimal cost;

    // 소속 업체 (N:1 관계)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    // 생성 시간
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
