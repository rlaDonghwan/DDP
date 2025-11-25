package com.ddp.device.repository.mongo;

import com.ddp.device.document.AdminAction;
import com.ddp.device.document.ActionStatus;
import com.ddp.device.document.ActionType;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 관리자 조치 Repository
 */
@Repository
public interface AdminActionRepository extends MongoRepository<AdminAction, String> {

    /**
     * 사용자별 조치 목록 조회 (미확인 조치 우선, 최신순)
     */
    List<AdminAction> findByUserIdOrderByIsReadAscCreatedAtDesc(Long userId);

    /**
     * 로그별 조치 목록 조회
     */
    List<AdminAction> findByLogId(String logId);

    /**
     * 조치 유형별 조회
     */
    List<AdminAction> findByActionType(ActionType actionType);

    /**
     * 조치 상태별 조회
     */
    List<AdminAction> findByStatus(ActionStatus status);

    /**
     * 관리자별 조치 목록 조회
     */
    List<AdminAction> findByAdminId(Long adminId);

    /**
     * 미확인 조치 조회
     */
    List<AdminAction> findByIsReadFalse();

    /**
     * TCS 연동 대기 조치 조회
     */
    List<AdminAction> findByTcsSyncedFalseAndActionTypeIn(List<ActionType> actionTypes);
}
