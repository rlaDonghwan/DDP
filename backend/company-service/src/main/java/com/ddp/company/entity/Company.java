package com.ddp.company.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// 업체 엔티티 클래스
@Entity
@Table(name = "companies")
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
@Getter
@Setter
public class Company {

    // 업체 고유 ID (기본키)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 업체명
    @Column(nullable = false)
    private String name;

    // 사업자등록번호
    @Column(nullable = false, unique = true)
    private String businessNumber;

    // 대표자명
    @Column(nullable = false)
    private String representativeName;

    // 이메일 주소
    @Column(nullable = false, unique = true)
    private String email;

    // 전화번호
    @Column(nullable = false)
    private String phone;

    // 주소
    @Column(nullable = false)
    private String address;

    // 지역 (서울, 경기 등)
    @Column(nullable = false)
    private String region;

    // 위도
    @Column
    private Double latitude;

    // 경도
    @Column
    private Double longitude;

    // 영업시간
    @Column
    private String businessHours;

    // 업체 소개
    @Column(columnDefinition = "TEXT")
    private String description;

    // 평점 (0-5)
    @Column
    @Builder.Default
    private Double rating = 0.0;

    // 리뷰 수
    @Column
    @Builder.Default
    private Integer reviewCount = 0;

    // 업체 상태
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CompanyStatus status;

    // 승인일
    @Column
    private LocalDateTime approvedAt;

    // 반려 사유
    @Column
    private String rejectedReason;

    // 초기 계정 ID
    @Column
    private String initialAccountId;

    // 관리 중인 장치 수
    @Column
    @Builder.Default
    private Integer deviceCount = 0;

    // 담당 고객(대상자) 수
    @Column
    @Builder.Default
    private Integer customerCount = 0;

    // 생성 시간
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // 수정 시간
    @LastModifiedDate
    private LocalDateTime updatedAt;

    // 삭제 시간 (Soft Delete)
    @Column
    private LocalDateTime deletedAt;

    // 삭제자 ID (관리자 ID)
    @Column
    private Long deletedBy;

    // 서비스 이력 목록 (1:N 관계)
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ServiceRecord> serviceHistory = new ArrayList<>();

    // 관리 중인 장치 목록 (1:N 관계)
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<ManagedDevice> managedDevices = new ArrayList<>();

    // 담당 고객 목록 (1:N 관계)
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Customer> customers = new ArrayList<>();

    /**
     * 업체 소프트 삭제 수행
     */
    public void softDelete(Long adminId) {
        this.deletedAt = LocalDateTime.now();
        this.deletedBy = adminId;
        this.status = CompanyStatus.REJECTED; // 삭제된 업체는 REJECTED 상태로 변경
    }

    /**
     * 삭제 여부 확인
     */
    public boolean isDeleted() {
        return this.deletedAt != null;
    }
}
