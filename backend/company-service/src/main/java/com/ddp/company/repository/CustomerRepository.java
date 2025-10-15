package com.ddp.company.repository;

import com.ddp.company.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// 고객 리포지토리
@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    // 업체별 고객 조회
    List<Customer> findByCompanyId(Long companyId);

    // 사용자 ID로 고객 조회
    Optional<Customer> findByUserId(String userId);

    // 전화번호로 고객 조회
    Optional<Customer> findByPhone(String phone);

    // 고객 이름으로 검색 (부분 일치)
    List<Customer> findByNameContaining(String name);
}
