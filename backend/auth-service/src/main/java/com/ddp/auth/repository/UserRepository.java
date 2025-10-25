package com.ddp.auth.repository;

import com.ddp.auth.entity.User;
import com.ddp.auth.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// 사용자 리포지토리
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // 이메일로 사용자 조회
    Optional<User> findByEmail(String email);

    // 이름으로 사용자 검색
    List<User> findByNameContaining(String name);

    // 역할별 사용자 조회
    List<User> findByRole(UserRole role);

    // 이메일 존재 여부 확인
    boolean existsByEmail(String email);

    // 운전면허 번호로 사용자 조회
    Optional<User> findByLicenseNumber(String licenseNumber);

    // 전화번호로 사용자 조회
    Optional<User> findByPhone(String phone);

    // 업체 ID와 역할로 사용자 조회 (COMPANY 역할 전용)
    Optional<User> findByCompanyIdAndRole(Long companyId, UserRole role);
}