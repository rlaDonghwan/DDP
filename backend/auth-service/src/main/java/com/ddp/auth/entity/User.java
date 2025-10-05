package com.ddp.auth.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

// 사용자 엔티티 클래스 - 불변 객체로 설계
@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class) // JPA Auditing 활성화
@NoArgsConstructor(access = AccessLevel.PROTECTED) // JPA용 기본 생성자
@AllArgsConstructor(access = AccessLevel.PRIVATE)  // 전체 생성자 (private)
@Builder                                           // 빌더 패턴
@Getter                                           // Getter만 생성
public class User {

    // 사용자 고유 ID (기본키)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    // 이메일 주소 (로그인 ID) - PENDING 상태에서는 null 가능
    @Column(unique = true)
    private String email;

    // 암호화된 비밀번호 - PENDING 상태에서는 null 가능
    @Column
    private String passwordHash;

    // 사용자 이름
    @Column(nullable = false)
    private String name;

    // 전화번호
    @Column(unique = true, nullable = true)
    private String phone;

    // 주소 (선택사항)
    @Column
    private String address;

    // 운전면허 번호 (음주운전 방지 프로그램용)
    @Column(unique = true)
    private String licenseNumber;

    // 사용자 역할
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    // 계정 상태
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AccountStatus accountStatus;

    // 생성 시간
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // 수정 시간
    @LastModifiedDate
    private LocalDateTime updatedAt;
}