package com.ddp.company.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

// 관리 중인 장치 엔티티 클래스
@Entity
@Table(name = "managed_devices")
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
@Getter
public class ManagedDevice {

    // 장치 고유 ID (기본키)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 시리얼 번호
    @Column(nullable = false, unique = true)
    private String serialNumber;

    // 모델명
    @Column(nullable = false)
    private String modelName;

    // 장치 상태
    @Column(nullable = false)
    private String status;

    // 할당된 대상자 이름
    @Column
    private String assignedSubjectName;

    // 할당된 대상자 ID
    @Column
    private String assignedSubjectId;

    // 소속 업체 (N:1 관계)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    // 생성 시간
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // 수정 시간
    @LastModifiedDate
    private LocalDateTime updatedAt;


}
