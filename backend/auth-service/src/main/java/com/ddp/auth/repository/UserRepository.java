package com.ddp.auth.repository;

import com.ddp.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// 사용자 데이터 접근 레포지토리
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // 이메일로 사용자 조회
    Optional<User> findByEmail(String email);
    
    // 이메일 존재 여부 확인
    boolean existsByEmail(String email);
}