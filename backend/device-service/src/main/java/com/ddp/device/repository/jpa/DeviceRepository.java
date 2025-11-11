package com.ddp.device.repository.jpa;

import com.ddp.device.entity.Device;
import com.ddp.device.entity.DeviceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * 장치 리포지토리
 */
@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {

    // 시리얼 번호로 장치 조회
    Optional<Device> findBySerialNumber(String serialNumber);

    // 사용자 ID로 장치 목록 조회
    List<Device> findByUserId(Long userId);

    // 업체 ID로 장치 목록 조회
    List<Device> findByCompanyId(Long companyId);

    // 상태로 장치 목록 조회
    List<Device> findByStatus(DeviceStatus status);

    // 다음 검·교정 예정일이 특정 날짜 이전인 장치 조회 (검사 기한 임박)
    List<Device> findByNextInspectionDateBefore(LocalDate date);

    // 업체 ID와 상태로 장치 목록 조회
    List<Device> findByCompanyIdAndStatus(Long companyId, DeviceStatus status);

    // 시리얼 번호 존재 여부 확인
    boolean existsBySerialNumber(String serialNumber);
}
