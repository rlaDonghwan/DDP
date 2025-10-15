package com.ddp.company.repository;

import com.ddp.company.entity.Company;
import com.ddp.company.entity.CompanyStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// 업체 리포지토리
@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    // 사업자등록번호로 업체 조회
    Optional<Company> findByBusinessNumber(String businessNumber);

    // 이메일로 업체 조회
    Optional<Company> findByEmail(String email);

    // 업체명으로 검색 (부분 일치)
    List<Company> findByNameContaining(String name);

    // 상태별 업체 조회
    List<Company> findByStatus(CompanyStatus status);

    // 지역별 업체 조회
    List<Company> findByRegion(String region);

    // 사업자등록번호 존재 여부 확인
    boolean existsByBusinessNumber(String businessNumber);

    // 이메일 존재 여부 확인
    boolean existsByEmail(String email);

    // 복합 검색 (업체명, 상태, 지역)
    @Query("SELECT c FROM Company c WHERE " +
           "(:searchQuery IS NULL OR c.name LIKE %:searchQuery% OR c.businessNumber LIKE %:searchQuery%) AND " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:region IS NULL OR c.region = :region)")
    Page<Company> searchCompanies(
        @Param("searchQuery") String searchQuery,
        @Param("status") CompanyStatus status,
        @Param("region") String region,
        Pageable pageable
    );

    // 모든 업체 페이징 조회
    Page<Company> findAll(Pageable pageable);

    // 상태와 지역으로 업체 조회
    List<Company> findByStatusAndRegion(CompanyStatus status, String region);

    // 상태와 업체명으로 검색 (부분 일치)
    List<Company> findByStatusAndNameContaining(CompanyStatus status, String name);
}
