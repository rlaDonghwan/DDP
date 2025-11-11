package com.ddp.reservation.service;

import com.ddp.reservation.client.AuthServiceClient;
import com.ddp.reservation.client.CompanyServiceClient;
import com.ddp.reservation.client.DeviceServiceClient;
import com.ddp.reservation.client.dto.DeviceResponse;
import com.ddp.reservation.client.dto.RegisterDeviceRequest;
import com.ddp.reservation.dto.CompanyDto;
import com.ddp.reservation.dto.UserDto;
import com.ddp.reservation.dto.request.CompleteReservationRequest;
import com.ddp.reservation.dto.request.CreateReservationRequest;
import com.ddp.reservation.dto.response.ReservationResponse;
import com.ddp.reservation.entity.Reservation;
import com.ddp.reservation.entity.ReservationStatus;
import com.ddp.reservation.entity.ServiceType;
import com.ddp.reservation.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

// 예약 서비스
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final AuthServiceClient authServiceClient;
    private final CompanyServiceClient companyServiceClient;
    private final DeviceServiceClient deviceServiceClient;

    // 예약 생성 (사용자)
    public Reservation createReservation(Long userId, CreateReservationRequest request) {
        log.info("API 호출 시작: 예약 생성 - 사용자 ID: {}, 업체 ID: {}", userId, request.getCompanyId());

        long startTime = System.currentTimeMillis();

        try {
            // 예약 엔티티 생성
            Reservation reservation = Reservation.builder()
                    .userId(userId) // Gateway 헤더에서 추출된 사용자 ID
                    .companyId(request.getCompanyId())
                    .serviceType(request.getServiceType())
                    .status(ReservationStatus.PENDING) // 초기 상태: 대기 중
                    .requestedDate(request.getRequestedDate())
                    .vehicleInfo(request.getVehicleInfo())
                    .notes(request.getNotes())
                    .build();

            // 예약 저장
            Reservation savedReservation = reservationRepository.save(reservation);

            log.info("API 호출 완료: 예약 생성 - 예약 ID: {} ({}ms)",
                    savedReservation.getReservationId(), System.currentTimeMillis() - startTime);

            return savedReservation;

        } catch (Exception e) {
            log.error("예약 생성 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("예약 생성에 실패했습니다.", e);
        }
    }

    // 예약 조회 (ID로)
    @Transactional(readOnly = true)
    public Optional<Reservation> findById(Long reservationId) {
        log.debug("예약 조회 - 예약 ID: {}", reservationId);
        return reservationRepository.findById(reservationId);
    }

    // 사용자의 예약 목록 조회 (업체 정보 포함)
    @Transactional(readOnly = true)
    public List<ReservationResponse> findByUserIdWithCompanyInfo(Long userId) {
        log.info("API 호출 시작: 사용자 예약 목록 조회 (업체 정보 포함) - 사용자 ID: {}", userId);

        long startTime = System.currentTimeMillis();

        // 1. 예약 목록 조회
        List<Reservation> reservations = reservationRepository.findByUserIdOrderByCreatedAtDesc(userId);

        // 2. 고유한 업체 ID 추출
        Set<Long> companyIds = reservations.stream()
                .map(Reservation::getCompanyId)
                .collect(Collectors.toSet());

        // 3. 업체 정보 배치 조회 (Map으로 캐싱)
        Map<Long, CompanyDto> companyMap = new HashMap<>();
        for (Long companyId : companyIds) {
            try {
                CompanyDto company = companyServiceClient.getCompanyById(companyId);
                if (company != null) {
                    companyMap.put(companyId, company);
                }
            } catch (Exception e) {
                log.warn("업체 정보 조회 실패 (계속 진행): companyId={}, error={}", companyId, e.getMessage());
            }
        }

        // 4. ReservationResponse 생성 (업체 정보 포함)
        List<ReservationResponse> responses = reservations.stream()
                .map(reservation -> {
                    CompanyDto company = companyMap.get(reservation.getCompanyId());
                    if (company != null) {
                        return ReservationResponse.withCompanyInfo(
                                reservation,
                                company.getName(),
                                company.getAddress(),
                                company.getPhone()
                        );
                    } else {
                        return ReservationResponse.from(reservation);
                    }
                })
                .collect(Collectors.toList());

        log.info("API 호출 완료: 사용자 예약 목록 조회 - {} 건 ({}ms)",
                responses.size(), System.currentTimeMillis() - startTime);

        return responses;
    }

    // 업체의 예약 목록 조회 (사용자 정보 포함)
    @Transactional(readOnly = true)
    public List<ReservationResponse> findByCompanyIdWithUserInfo(Long companyId) {
        log.info("API 호출 시작: 업체 예약 목록 조회 (사용자 정보 포함) - 업체 ID: {}", companyId);

        long startTime = System.currentTimeMillis();

        // 1. 예약 목록 조회
        List<Reservation> reservations = reservationRepository.findByCompanyIdOrderByCreatedAtDesc(companyId);

        // 2. 고유한 사용자 ID 추출
        Set<Long> userIds = reservations.stream()
                .map(Reservation::getUserId)
                .collect(Collectors.toSet());

        // 3. 사용자 정보 배치 조회 (Map으로 캐싱)
        Map<Long, UserDto> userMap = new HashMap<>();
        for (Long userId : userIds) {
            try {
                UserDto user = authServiceClient.getUserById(userId);
                if (user != null) {
                    userMap.put(userId, user);
                }
            } catch (Exception e) {
                log.warn("사용자 정보 조회 실패 (계속 진행): userId={}, error={}", userId, e.getMessage());
            }
        }

        // 4. ReservationResponse 생성 (사용자 정보 포함)
        List<ReservationResponse> responses = reservations.stream()
                .map(reservation -> {
                    UserDto user = userMap.get(reservation.getUserId());
                    if (user != null) {
                        return ReservationResponse.withUserInfo(
                                reservation,
                                user.getName(),
                                user.getPhone(),
                                user.getAddress()
                        );
                    } else {
                        return ReservationResponse.from(reservation);
                    }
                })
                .collect(Collectors.toList());

        log.info("API 호출 완료: 업체 예약 목록 조회 - {} 건 ({}ms)",
                responses.size(), System.currentTimeMillis() - startTime);

        return responses;
    }

    // 사용자의 예약 목록 조회 (레거시 - 엔티티 반환)
    @Transactional(readOnly = true)
    public List<Reservation> findByUserId(Long userId) {
        log.info("API 호출 시작: 사용자 예약 목록 조회 - 사용자 ID: {}", userId);

        long startTime = System.currentTimeMillis();

        List<Reservation> reservations = reservationRepository.findByUserIdOrderByCreatedAtDesc(userId);

        log.info("API 호출 완료: 사용자 예약 목록 조회 - {} 건 ({}ms)",
                reservations.size(), System.currentTimeMillis() - startTime);

        return reservations;
    }

    // 업체의 예약 목록 조회 (레거시 - 엔티티 반환)
    @Transactional(readOnly = true)
    public List<Reservation> findByCompanyId(Long companyId) {
        log.info("API 호출 시작: 업체 예약 목록 조회 - 업체 ID: {}", companyId);

        long startTime = System.currentTimeMillis();

        List<Reservation> reservations = reservationRepository.findByCompanyIdOrderByCreatedAtDesc(companyId);

        log.info("API 호출 완료: 업체 예약 목록 조회 - {} 건 ({}ms)",
                reservations.size(), System.currentTimeMillis() - startTime);

        return reservations;
    }

    // 전체 예약 목록 조회 (관리자용)
    @Transactional(readOnly = true)
    public List<Reservation> findAll() {
        log.info("API 호출 시작: 전체 예약 목록 조회 (관리자)");

        long startTime = System.currentTimeMillis();

        List<Reservation> reservations = reservationRepository.findAllByOrderByCreatedAtDesc();

        log.info("API 호출 완료: 전체 예약 목록 조회 - {} 건 ({}ms)",
                reservations.size(), System.currentTimeMillis() - startTime);

        return reservations;
    }

    // 예약 확정 (업체)
    public Reservation confirmReservation(Long reservationId, Long companyId) {
        log.info("API 호출 시작: 예약 확정 - 예약 ID: {}, 업체 ID: {}", reservationId, companyId);

        long startTime = System.currentTimeMillis();

        try {
            // 예약 조회
            Reservation reservation = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다: " + reservationId));

            // 권한 검증: 본인 업체의 예약인지 확인
            if (!reservation.getCompanyId().equals(companyId)) {
                log.warn("권한 없음 - 다른 업체의 예약 확정 시도: 예약 ID={}, 요청 업체 ID={}, 실제 업체 ID={}",
                        reservationId, companyId, reservation.getCompanyId());
                throw new IllegalArgumentException("권한이 없습니다");
            }

            // 상태 검증: PENDING 상태만 확정 가능
            if (reservation.getStatus() != ReservationStatus.PENDING) {
                throw new IllegalStateException("대기 중인 예약만 확정할 수 있습니다");
            }

            // 예약 확정 처리
            reservation.setStatus(ReservationStatus.CONFIRMED);
            reservation.setConfirmedDate(LocalDateTime.now());

            Reservation savedReservation = reservationRepository.save(reservation);

            log.info("API 호출 완료: 예약 확정 - 예약 ID: {} ({}ms)",
                    reservationId, System.currentTimeMillis() - startTime);

            return savedReservation;

        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("예약 확정 실패: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("예약 확정 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("예약 확정에 실패했습니다.", e);
        }
    }

    // 예약 거절 (업체)
    public Reservation rejectReservation(Long reservationId, Long companyId, String reason) {
        log.info("API 호출 시작: 예약 거절 - 예약 ID: {}, 업체 ID: {}", reservationId, companyId);

        long startTime = System.currentTimeMillis();

        try {
            // 예약 조회
            Reservation reservation = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다: " + reservationId));

            // 권한 검증
            if (!reservation.getCompanyId().equals(companyId)) {
                log.warn("권한 없음 - 다른 업체의 예약 거절 시도: 예약 ID={}, 요청 업체 ID={}, 실제 업체 ID={}",
                        reservationId, companyId, reservation.getCompanyId());
                throw new IllegalArgumentException("권한이 없습니다");
            }

            // 상태 검증
            if (reservation.getStatus() != ReservationStatus.PENDING) {
                throw new IllegalStateException("대기 중인 예약만 거절할 수 있습니다");
            }

            // 예약 거절 처리
            reservation.setStatus(ReservationStatus.REJECTED);
            reservation.setRejectedReason(reason);
            reservation.setRejectedAt(LocalDateTime.now());

            Reservation savedReservation = reservationRepository.save(reservation);

            log.info("API 호출 완료: 예약 거절 - 예약 ID: {} ({}ms)",
                    reservationId, System.currentTimeMillis() - startTime);

            return savedReservation;

        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("예약 거절 실패: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("예약 거절 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("예약 거절에 실패했습니다.", e);
        }
    }

    // 예약 취소 (사용자)
    public Reservation cancelReservation(Long reservationId, Long userId, String reason) {
        log.info("API 호출 시작: 예약 취소 - 예약 ID: {}, 사용자 ID: {}", reservationId, userId);

        long startTime = System.currentTimeMillis();

        try {
            // 예약 조회
            Reservation reservation = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다: " + reservationId));

            // 권한 검증: 본인의 예약인지 확인
            if (!reservation.getUserId().equals(userId)) {
                log.warn("권한 없음 - 다른 사용자의 예약 취소 시도: 예약 ID={}, 요청 사용자 ID={}, 실제 사용자 ID={}",
                        reservationId, userId, reservation.getUserId());
                throw new IllegalArgumentException("권한이 없습니다");
            }

            // 상태 검증: PENDING 또는 CONFIRMED 상태만 취소 가능
            if (reservation.getStatus() != ReservationStatus.PENDING &&
                reservation.getStatus() != ReservationStatus.CONFIRMED) {
                throw new IllegalStateException("대기 중이거나 확정된 예약만 취소할 수 있습니다");
            }

            // 24시간 취소 정책 확인 (CONFIRMED 상태인 경우에만)
            if (reservation.getStatus() == ReservationStatus.CONFIRMED &&
                reservation.getConfirmedDate() != null) {

                long hoursSinceConfirmation = Duration.between(
                        reservation.getConfirmedDate(),
                        LocalDateTime.now()
                ).toHours();

                if (hoursSinceConfirmation >= 24) {
                    throw new IllegalStateException("예약 확정 후 24시간이 지나 취소할 수 없습니다");
                }
            }

            // 예약 취소 처리
            reservation.setStatus(ReservationStatus.CANCELLED);
            reservation.setCancelledReason(reason);
            reservation.setCancelledAt(LocalDateTime.now());

            Reservation savedReservation = reservationRepository.save(reservation);

            log.info("API 호출 완료: 예약 취소 - 예약 ID: {} ({}ms)",
                    reservationId, System.currentTimeMillis() - startTime);

            return savedReservation;

        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("예약 취소 실패: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("예약 취소 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("예약 취소에 실패했습니다.", e);
        }
    }

    // 예약 완료 (업체)
    public Reservation completeReservation(Long reservationId, Long companyId, CompleteReservationRequest request) {
        log.info("API 호출 시작: 예약 완료 - 예약 ID: {}, 업체 ID: {}, 서비스 타입별 정보 포함", reservationId, companyId);

        long startTime = System.currentTimeMillis();

        try {
            // 예약 조회
            Reservation reservation = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다: " + reservationId));

            // 권한 검증
            if (!reservation.getCompanyId().equals(companyId)) {
                log.warn("권한 없음 - 다른 업체의 예약 완료 시도: 예약 ID={}, 요청 업체 ID={}, 실제 업체 ID={}",
                        reservationId, companyId, reservation.getCompanyId());
                throw new IllegalArgumentException("권한이 없습니다");
            }

            // 상태 검증: CONFIRMED 상태만 완료 가능
            if (reservation.getStatus() != ReservationStatus.CONFIRMED) {
                throw new IllegalStateException("확정된 예약만 완료 처리할 수 있습니다");
            }

            // 예약 완료 처리
            reservation.setStatus(ReservationStatus.COMPLETED);
            reservation.setCompletedDate(request.getCompletedDate() != null ?
                    request.getCompletedDate() : LocalDateTime.now());

            Reservation savedReservation = reservationRepository.save(reservation);

            log.info("예약 완료 처리 완료 - 예약 ID: {}, 서비스 타입: {}", reservationId, reservation.getServiceType());

            // 서비스 타입별 처리
            try {
                if (reservation.getServiceType() == ServiceType.INSTALLATION) {
                    // INSTALLATION: device-service 호출하여 장치 등록
                    handleInstallationCompletion(reservation, request, companyId);
                } else if (reservation.getServiceType() == ServiceType.INSPECTION) {
                    // INSPECTION: device-service 호출하여 검·교정 이력 등록
                    handleInspectionCompletion(reservation, request, companyId);
                } else if (reservation.getServiceType() == ServiceType.REPAIR ||
                           reservation.getServiceType() == ServiceType.MAINTENANCE) {
                    // REPAIR/MAINTENANCE: device-service 호출하여 수리 이력 등록
                    handleRepairCompletion(reservation, request, companyId);
                }
            } catch (Exception e) {
                log.error("서비스 타입별 처리 중 오류 발생: {}", e.getMessage(), e);
                // 예약 완료는 성공했지만 후속 처리 실패 - 경고 로그만 남기고 계속 진행
            }

            // ServiceRecord 생성 (모든 서비스 타입)
            try {
                createServiceRecord(reservation, request, companyId);
            } catch (Exception e) {
                log.error("ServiceRecord 생성 실패: {}", e.getMessage(), e);
                // ServiceRecord 생성 실패해도 예약 완료는 성공으로 처리
            }

            // TODO: 알림 발송 (notification-service 호출)

            log.info("API 호출 완료: 예약 완료 - 예약 ID: {} ({}ms)",
                    reservationId, System.currentTimeMillis() - startTime);

            return savedReservation;

        } catch (IllegalArgumentException | IllegalStateException e) {
            log.error("예약 완료 실패: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("예약 완료 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("예약 완료 처리에 실패했습니다.", e);
        }
    }

    // 예약 삭제 (관리자 전용 - 실제 DB에서 제거)
    public void deleteReservation(Long reservationId) {
        log.info("API 호출 시작: 예약 삭제 (Hard Delete) - 예약 ID: {}", reservationId);

        long startTime = System.currentTimeMillis();

        try {
            // 예약 존재 여부 확인
            Reservation reservation = reservationRepository.findById(reservationId)
                    .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다: " + reservationId));

            // 실제 DB에서 삭제 (Hard Delete)
            reservationRepository.delete(reservation);

            log.info("API 호출 완료: 예약 삭제 - 예약 ID: {} ({}ms)",
                    reservationId, System.currentTimeMillis() - startTime);

        } catch (IllegalArgumentException e) {
            log.error("예약 삭제 실패: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("예약 삭제 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("예약 삭제에 실패했습니다.", e);
        }
    }

    // 설치 완료 처리 - device-service 호출
    private void handleInstallationCompletion(Reservation reservation, CompleteReservationRequest request, Long companyId) {
        log.info("설치 완료 처리 시작 - 예약 ID: {}, 시리얼 번호: {}", reservation.getReservationId(), request.getDeviceSerialNumber());

        try {
            // 장치 등록 요청 DTO 생성
            RegisterDeviceRequest deviceRequest = RegisterDeviceRequest.builder()
                    .serialNumber(request.getDeviceSerialNumber())
                    .modelName(request.getModelName())
                    .manufacturerId(request.getManufacturerId())
                    .userId(reservation.getUserId()) // 예약한 사용자에게 장치 할당
                    .companyId(companyId) // 설치한 업체
                    .installDate(request.getCompletedDate().toLocalDate()) // 완료일을 설치일로 사용
                    .warrantyEndDate(request.getWarrantyEndDate())
                    .build();

            // device-service 호출
            DeviceResponse deviceResponse = deviceServiceClient.registerDevice(deviceRequest);

            log.info("장치 등록 완료 - 장치 ID: {}, 시리얼 번호: {}, 사용자 ID: {}",
                    deviceResponse.getDeviceId(), deviceResponse.getSerialNumber(), deviceResponse.getUserId());

        } catch (Exception e) {
            log.error("장치 등록 실패 - 예약 ID: {}, 시리얼 번호: {}, 오류: {}",
                    reservation.getReservationId(), request.getDeviceSerialNumber(), e.getMessage(), e);
            throw new RuntimeException("장치 등록에 실패했습니다: " + e.getMessage(), e);
        }
    }

    // 검·교정 완료 처리
    private void handleInspectionCompletion(Reservation reservation, CompleteReservationRequest request, Long companyId) {
        log.info("검·교정 완료 처리 시작 - 예약 ID: {}, 장치 ID: {}", reservation.getReservationId(), request.getDeviceId());

        try {
            // 검·교정 이력 등록 요청 DTO 생성
            com.ddp.reservation.client.dto.RegisterInspectionRequest inspectionRequest =
                    com.ddp.reservation.client.dto.RegisterInspectionRequest.builder()
                            .deviceId(request.getDeviceId())
                            .inspectionDate(request.getCompletedDate().toLocalDate()) // 완료일을 검사일로 사용
                            .inspectorId(companyId) // 검사 업체
                            .result(request.getInspectionResult() != null ? request.getInspectionResult().name() : "PASS")
                            .notes(request.getNotes())
                            .nextInspectionDate(request.getNextInspectionDate())
                            .cost(request.getCost() != null ? request.getCost().longValue() : null)
                            .build();

            // device-service 호출
            com.ddp.reservation.client.dto.InspectionRecordResponse inspectionResponse =
                    deviceServiceClient.registerInspection(request.getDeviceId(), inspectionRequest);

            log.info("검·교정 이력 등록 완료 - 이력 ID: {}, 장치 ID: {}, 결과: {}",
                    inspectionResponse.getId(), inspectionResponse.getDeviceId(), inspectionResponse.getResult());

        } catch (Exception e) {
            log.error("검·교정 이력 등록 실패 - 예약 ID: {}, 장치 ID: {}, 오류: {}",
                    reservation.getReservationId(), request.getDeviceId(), e.getMessage(), e);
            throw new RuntimeException("검·교정 이력 등록에 실패했습니다: " + e.getMessage(), e);
        }
    }

    // 수리/유지보수 완료 처리
    private void handleRepairCompletion(Reservation reservation, CompleteReservationRequest request, Long companyId) {
        log.info("수리/유지보수 완료 처리 시작 - 예약 ID: {}, 장치 ID: {}", reservation.getReservationId(), request.getRepairDeviceId());

        try {
            // 수리 이력 등록 요청 DTO 생성
            com.ddp.reservation.client.dto.RegisterRepairRequest repairRequest =
                    com.ddp.reservation.client.dto.RegisterRepairRequest.builder()
                            .deviceId(request.getRepairDeviceId())
                            .repairDate(request.getCompletedDate().toLocalDate()) // 완료일을 수리일로 사용
                            .repairerId(companyId) // 수리 업체
                            .workDescription(request.getWorkDescription())
                            .replacedParts(request.getReplacedParts())
                            .cost(request.getCost() != null ? request.getCost().longValue() : null)
                            .notes(request.getNotes())
                            .build();

            // device-service 호출
            com.ddp.reservation.client.dto.RepairRecordResponse repairResponse =
                    deviceServiceClient.registerRepair(request.getRepairDeviceId(), repairRequest);

            log.info("수리 이력 등록 완료 - 이력 ID: {}, 장치 ID: {}, 작업 내용: {}",
                    repairResponse.getId(), repairResponse.getDeviceId(), repairResponse.getWorkDescription());

        } catch (Exception e) {
            log.error("수리 이력 등록 실패 - 예약 ID: {}, 장치 ID: {}, 오류: {}",
                    reservation.getReservationId(), request.getRepairDeviceId(), e.getMessage(), e);
            throw new RuntimeException("수리 이력 등록에 실패했습니다: " + e.getMessage(), e);
        }
    }

    // ServiceRecord 생성 - company-service 호출
    private void createServiceRecord(Reservation reservation, CompleteReservationRequest request, Long companyId) {
        log.info("ServiceRecord 생성 시작 - 예약 ID: {}, 서비스 타입: {}", reservation.getReservationId(), reservation.getServiceType());

        try {
            // 서비스 타입별 설명 생성
            String description = generateServiceDescription(reservation, request);

            // 장치 ID 및 시리얼 번호 추출
            Long deviceId = extractDeviceId(reservation, request);
            String deviceSerialNumber = extractDeviceSerialNumber(request);

            // ServiceRecord 생성 요청 DTO
            com.ddp.reservation.client.dto.CreateServiceRecordRequest serviceRecordRequest =
                    com.ddp.reservation.client.dto.CreateServiceRecordRequest.builder()
                            .type(reservation.getServiceType().name())
                            .subjectId(reservation.getUserId())
                            .subjectName("사용자 " + reservation.getUserId()) // TODO: 실제 사용자 이름 조회
                            .deviceId(deviceId)
                            .deviceSerialNumber(deviceSerialNumber)
                            .description(description)
                            .performedAt(request.getCompletedDate())
                            .performedBy("업체 " + companyId) // TODO: 실제 업체 이름 조회
                            .cost(request.getCost())
                            .companyId(companyId)
                            .build();

            // company-service 호출
            com.ddp.reservation.client.dto.ServiceRecordResponse serviceRecordResponse =
                    companyServiceClient.createServiceRecord(serviceRecordRequest);

            log.info("ServiceRecord 생성 완료 - 이력 ID: {}, 타입: {}",
                    serviceRecordResponse.getId(), serviceRecordResponse.getType());

        } catch (Exception e) {
            log.error("ServiceRecord 생성 실패 - 예약 ID: {}, 오류: {}",
                    reservation.getReservationId(), e.getMessage(), e);
            throw new RuntimeException("ServiceRecord 생성에 실패했습니다: " + e.getMessage(), e);
        }
    }

    // 서비스 타입별 설명 생성
    private String generateServiceDescription(Reservation reservation, CompleteReservationRequest request) {
        return switch (reservation.getServiceType()) {
            case INSTALLATION -> String.format("장치 설치 완료 - 모델: %s, S/N: %s",
                    request.getModelName(), request.getDeviceSerialNumber());
            case INSPECTION -> String.format("검·교정 완료 - 결과: %s, 다음 검사일: %s",
                    request.getInspectionResult(), request.getNextInspectionDate());
            case REPAIR, MAINTENANCE -> String.format("수리/유지보수 완료 - %s",
                    request.getWorkDescription());
        };
    }

    // 장치 ID 추출 (서비스 타입별)
    private Long extractDeviceId(Reservation reservation, CompleteReservationRequest request) {
        return switch (reservation.getServiceType()) {
            case INSTALLATION -> null; // 설치는 장치가 아직 없음
            case INSPECTION -> request.getDeviceId();
            case REPAIR, MAINTENANCE -> request.getRepairDeviceId();
        };
    }

    // 장치 시리얼 번호 추출
    private String extractDeviceSerialNumber(CompleteReservationRequest request) {
        if (request.getDeviceSerialNumber() != null) {
            return request.getDeviceSerialNumber();
        }
        return "N/A";
    }
}
