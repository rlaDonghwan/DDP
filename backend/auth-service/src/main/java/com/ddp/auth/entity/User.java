package com.ddp.auth.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

// 사용자 엔티티 클래스
@Entity
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class) // JPA Auditing 활성화
public class User {

    // 사용자 고유 ID (기본키)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    // 이메일 주소 (로그인 ID)
    @Column(unique = true, nullable = false)
    @Email(message = "올바른 이메일 형식이 아닙니다")
    @NotBlank(message = "이메일은 필수입니다")
    private String email;

    // 암호화된 비밀번호
    @Column(nullable = false)
    @NotBlank(message = "비밀번호는 필수입니다")
    @Size(min = 8, message = "비밀번호는 최소 8자 이상이어야 합니다")
    private String passwordHash;

    // 사용자 이름
    @Column(nullable = false)
    @NotBlank(message = "이름은 필수입니다")
    @Size(max = 100, message = "이름은 100자를 초과할 수 없습니다")
    private String name;

    // 전화번호 (선택사항)
    @Column
    private String phone;

    // 주소 (선택사항)
    @Column
    private String address;

    // 생성 시간
    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    // 수정 시간
    @LastModifiedDate
    private LocalDateTime updatedAt;

    // 기본 생성자
    protected User() {}

    // 생성자
    public User(String email, String passwordHash, String name) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.name = name;
    }

    // Getter 메서드들
    public Long getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getName() {
        return name;
    }

    public String getPhone() {
        return phone;
    }

    public String getAddress() {
        return address;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    // Setter 메서드들
    public void setName(String name) {
        this.name = name;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }
}