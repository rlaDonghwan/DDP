package com.ddp.company.repository;

import com.ddp.company.entity.ManagedDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// 관리 장치 리포지토리
@Repository
public interface ManagedDeviceRepository extends JpaRepository<ManagedDevice, Long> {

    // 업체별 관리 장치 조회
    List<ManagedDevice> findByCompanyId(Long companyId);

    // 시리얼 번호로 장치 조회
    Optional<ManagedDevice> findBySerialNumber(String serialNumber);

    // 시리얼 번호 존재 여부 확인
    boolean existsBySerialNumber(String serialNumber);

    // 할당된 대상자별 장치 조회
    Optional<ManagedDevice> findByAssignedSubjectId(String assignedSubjectId);
}
