package com.ddp.tcs.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

// 운전면허 정보 엔티티
@Entity
@Table(name = "licenses")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
@Getter
public class License {

    // 면허번호 (기본키)
    @Id
    @Column(name = "license_number", length = 20)
    private String licenseNumber;

    // 성명
    @Column(nullable = false, length = 50)
    private String name;

    // 주민등록번호 (암호화된 형태)
    @Column(nullable = false, length = 100)
    private String residentNumber;

    // 생년월일
    @Column(nullable = false)
    private LocalDate birthDate;

    // 주소
    @Column(nullable = false, length = 200)
    private String address;

    // 면허 발급일
    @Column(nullable = false)
    private LocalDate issueDate;

    // 면허 만료일
    @Column(nullable = false)
    private LocalDate expiryDate;

    // 면허 종류 (1종보통, 2종보통 등)
    @Column(nullable = false, length = 20)
    private String licenseType;

    // 면허 상태 (정상, 취소, 정지 등)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LicenseStatus status;

    // 음주운전 위반 여부
    @Column(nullable = false)
    private boolean isDuiViolator;

    // 위반 횟수
    @Column(nullable = false)
    private int violationCount;
}