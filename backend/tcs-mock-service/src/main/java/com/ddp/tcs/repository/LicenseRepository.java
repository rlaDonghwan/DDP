package com.ddp.tcs.repository;

import com.ddp.tcs.entity.License;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// 면허 정보 리포지토리
@Repository
public interface LicenseRepository extends JpaRepository<License, String> {

    // 면허번호로 조회
    Optional<License> findByLicenseNumber(String licenseNumber);

    // 음주운전 위반자 목록 조회
    @Query("SELECT l FROM License l WHERE l.isDuiViolator = true ORDER BY l.violationCount DESC")
    List<License> findAllDuiViolators();

    // 이름으로 검색
    List<License> findByNameContaining(String name);

    // 면허 상태별 조회
    List<License> findByStatus(com.ddp.tcs.entity.LicenseStatus status);
}