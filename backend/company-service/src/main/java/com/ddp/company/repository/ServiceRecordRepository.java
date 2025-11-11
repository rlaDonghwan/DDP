package com.ddp.company.repository;

import com.ddp.company.entity.ServiceRecord;
import com.ddp.company.entity.ServiceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
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

    // 업체별 총 서비스 건수
    long countByCompanyId(Long companyId);

    // 업체별 서비스 타입별 건수
    long countByCompanyIdAndType(Long companyId, ServiceType type);

    // 업체별 총 매출
    @Query("SELECT COALESCE(SUM(s.cost), 0) FROM ServiceRecord s WHERE s.company.id = :companyId")
    BigDecimal sumCostByCompanyId(@Param("companyId") Long companyId);

    // 업체별 특정 기간 서비스 건수
    long countByCompanyIdAndPerformedAtBetween(Long companyId, LocalDateTime startDate, LocalDateTime endDate);

    // 업체별 특정 기간 매출
    @Query("SELECT COALESCE(SUM(s.cost), 0) FROM ServiceRecord s WHERE s.company.id = :companyId AND s.performedAt BETWEEN :startDate AND :endDate")
    BigDecimal sumCostByCompanyIdAndPerformedAtBetween(
        @Param("companyId") Long companyId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    // 업체별 평균 서비스 비용
    @Query("SELECT COALESCE(AVG(s.cost), 0) FROM ServiceRecord s WHERE s.company.id = :companyId")
    BigDecimal avgCostByCompanyId(@Param("companyId") Long companyId);
}
