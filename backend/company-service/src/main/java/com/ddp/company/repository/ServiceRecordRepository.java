package com.ddp.company.repository;

import com.ddp.company.entity.ServiceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// 서비스 이력 리포지토리
@Repository
public interface ServiceRecordRepository extends JpaRepository<ServiceRecord, Long> {

    // 업체별 서비스 이력 조회
    List<ServiceRecord> findByCompanyId(Long companyId);

    // 대상자별 서비스 이력 조회
    List<ServiceRecord> findBySubjectId(String subjectId);

    // 장치별 서비스 이력 조회
    List<ServiceRecord> findByDeviceId(String deviceId);
}
