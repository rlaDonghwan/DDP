package com.ddp.device.service;

import com.ddp.device.document.AdminAction;
import com.ddp.device.document.ActionStatus;
import com.ddp.device.document.ActionType;
import com.ddp.device.repository.mongo.AdminActionRepository;
import com.ddp.device.repository.mongo.DrivingLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 관리자 조치 서비스
 * 이상 징후 발견 시 관리자가 취한 조치를 관리
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AdminActionService {

    private final AdminActionRepository adminActionRepository;
    private final DrivingLogRepository drivingLogRepository;

    /**
     * 조치 생성 및 실행
     * @param logId 대상 로그 ID
     * @param userId 대상 사용자 ID
     * @param adminId 조치 실행 관리자 ID
     * @param actionType 조치 유형
     * @param actionDetail 조치 상세 내용
     * @return 생성된 조치
     */
    @Transactional
    public AdminAction createAction(
            String logId,
            Long userId,
            Long adminId,
            ActionType actionType,
            String actionDetail
    ) {
        log.info("관리자 조치 생성: logId={}, userId={}, adminId={}, actionType={}",
                logId, userId, adminId, actionType);

        // 조치 생성
        AdminAction action = AdminAction.builder()
                .logId(logId)
                .userId(userId)
                .adminId(adminId)
                .actionType(actionType)
                .actionDetail(actionDetail)
                .status(ActionStatus.PENDING)
                .isRead(false)
                .tcsSynced(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        AdminAction savedAction = adminActionRepository.save(action);
        log.info("조치 생성 완료: actionId={}", savedAction.getActionId());

        // 로그에 조치 상태 업데이트
        drivingLogRepository.findById(logId).ifPresent(drivingLog -> {
            drivingLog.setActionTaken(true);
            drivingLog.setActionId(savedAction.getActionId());
            drivingLog.setUpdatedAt(LocalDateTime.now());
            drivingLogRepository.save(drivingLog);
            log.info("로그 조치 상태 업데이트 완료: logId={}", logId);
        });

        // 즉시 실행
        return executeAction(savedAction.getActionId());
    }

    /**
     * 조치 실행
     * @param actionId 조치 ID
     * @return 실행된 조치
     */
    @Transactional
    public AdminAction executeAction(String actionId) {
        log.info("조치 실행 시작: actionId={}", actionId);

        AdminAction action = adminActionRepository.findById(actionId)
                .orElseThrow(() -> new IllegalArgumentException("조치를 찾을 수 없습니다: " + actionId));

        // 상태 업데이트
        action.setStatus(ActionStatus.IN_PROGRESS);
        action.setExecutedAt(LocalDateTime.now());
        action.setUpdatedAt(LocalDateTime.now());

        try {
            // 면허 관련 조치인 경우 TCS 연동
            if (isLicenseRelatedAction(action.getActionType())) {
                executeLicenseAction(action);
            }

            // 조치 완료
            action.setStatus(ActionStatus.COMPLETED);
            action.setCompletedAt(LocalDateTime.now());
            log.info("조치 실행 완료: actionId={}", actionId);

        } catch (Exception e) {
            log.error("조치 실행 실패: actionId={}", actionId, e);
            action.setStatus(ActionStatus.FAILED);
        }

        action.setUpdatedAt(LocalDateTime.now());
        return adminActionRepository.save(action);
    }

    /**
     * 사용자별 조치 목록 조회
     * 미확인 조치가 먼저 표시됨
     * @param userId 사용자 ID
     * @return 조치 목록
     */
    public List<AdminAction> getUserActions(Long userId) {
        log.info("사용자별 조치 목록 조회: userId={}", userId);
        return adminActionRepository.findByUserIdOrderByIsReadAscCreatedAtDesc(userId);
    }

    /**
     * 조치 확인 처리
     * 사용자가 대시보드에서 조치를 확인했을 때 호출
     * @param actionId 조치 ID
     * @param userId 사용자 ID (보안 검증용)
     * @return 업데이트된 조치
     */
    @Transactional
    public AdminAction markAsRead(String actionId, Long userId) {
        log.info("조치 확인 처리: actionId={}, userId={}", actionId, userId);

        AdminAction action = adminActionRepository.findById(actionId)
                .orElseThrow(() -> new IllegalArgumentException("조치를 찾을 수 없습니다: " + actionId));

        // 보안 검증: 해당 사용자의 조치인지 확인
        if (!action.getUserId().equals(userId)) {
            throw new IllegalArgumentException("권한이 없습니다: 다른 사용자의 조치입니다.");
        }

        // 이미 확인된 조치는 중복 처리 안 함
        if (Boolean.TRUE.equals(action.getIsRead())) {
            log.info("이미 확인된 조치입니다: actionId={}", actionId);
            return action;
        }

        // 확인 처리
        action.setIsRead(true);
        action.setReadAt(LocalDateTime.now());
        action.setUpdatedAt(LocalDateTime.now());

        AdminAction updatedAction = adminActionRepository.save(action);
        log.info("조치 확인 완료: actionId={}", actionId);

        return updatedAction;
    }

    /**
     * 로그별 조치 목록 조회
     * @param logId 로그 ID
     * @return 조치 목록
     */
    public List<AdminAction> getActionsByLogId(String logId) {
        log.info("로그별 조치 목록 조회: logId={}", logId);
        return adminActionRepository.findByLogId(logId);
    }

    /**
     * 미확인 조치 목록 조회
     * @return 미확인 조치 목록
     */
    public List<AdminAction> getUnreadActions() {
        log.info("미확인 조치 목록 조회");
        return adminActionRepository.findByIsReadFalse();
    }

    /**
     * 관리자별 조치 목록 조회
     * @param adminId 관리자 ID
     * @return 조치 목록
     */
    public List<AdminAction> getActionsByAdminId(Long adminId) {
        log.info("관리자별 조치 목록 조회: adminId={}", adminId);
        return adminActionRepository.findByAdminId(adminId);
    }

    /**
     * 면허 관련 조치 실행 (TCS 연동)
     * @param action 조치
     */
    private void executeLicenseAction(AdminAction action) {
        log.info("면허 관련 조치 실행: actionType={}", action.getActionType());

        try {
            // TODO: 실제 TCS 연동 구현
            // 현재는 Mock 응답 저장
            String mockResponse = String.format(
                    "{\"success\": true, \"message\": \"면허 조치 완료\", \"actionType\": \"%s\", \"userId\": %d}",
                    action.getActionType(),
                    action.getUserId()
            );

            action.setTcsSynced(true);
            action.setTcsResponse(mockResponse);

            log.info("TCS 연동 완료 (Mock): actionId={}", action.getActionId());

        } catch (Exception e) {
            log.error("TCS 연동 실패: actionId={}", action.getActionId(), e);
            action.setTcsSynced(false);
            action.setTcsResponse("TCS 연동 실패: " + e.getMessage());
        }
    }

    /**
     * 면허 관련 조치 여부 확인
     * @param actionType 조치 유형
     * @return 면허 관련 조치 여부
     */
    private boolean isLicenseRelatedAction(ActionType actionType) {
        return actionType == ActionType.LICENSE_STATUS_CHANGE ||
               actionType == ActionType.LICENSE_SUSPENSION ||
               actionType == ActionType.LICENSE_REVOCATION;
    }
}
