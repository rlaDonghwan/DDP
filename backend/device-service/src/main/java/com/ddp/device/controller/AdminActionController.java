package com.ddp.device.controller;

import com.ddp.device.document.AdminAction;
import com.ddp.device.document.ActionType;
import com.ddp.device.dto.action.CreateActionRequest;
import com.ddp.device.dto.action.MarkAsReadRequest;
import com.ddp.device.service.AdminActionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 관리자 조치 컨트롤러
 * 이상 징후 발견 시 관리자 조치 생성 및 관리
 */
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "AdminAction", description = "관리자 조치 API")
public class AdminActionController {

    private final AdminActionService adminActionService;

    /**
     * 조치 생성 및 실행 (관리자용)
     */
    @PostMapping("/admin/actions")
    @Operation(summary = "관리자 조치 생성", description = "이상 징후 발견 시 관리자 조치를 생성하고 실행합니다")
    public ResponseEntity<AdminAction> createAction(@Valid @RequestBody CreateActionRequest request) {
        log.info("관리자 조치 생성 요청: userId={}, actionType={}", request.getUserId(), request.getActionType());

        AdminAction action = adminActionService.createAction(
                request.getLogId(),
                request.getUserId(),
                request.getAdminId(),
                request.getActionType(),
                request.getActionDetail()
        );

        return ResponseEntity.ok(action);
    }

    /**
     * 사용자별 조치 목록 조회 (사용자용)
     */
    @GetMapping("/users/{userId}/actions")
    @Operation(summary = "사용자별 조치 목록 조회", description = "특정 사용자에 대한 관리자 조치 목록을 조회합니다 (미확인 조치 우선)")
    public ResponseEntity<List<AdminAction>> getUserActions(@PathVariable Long userId) {
        log.info("사용자별 조치 목록 조회: userId={}", userId);

        List<AdminAction> actions = adminActionService.getUserActions(userId);
        return ResponseEntity.ok(actions);
    }

    /**
     * 조치 확인 처리 (사용자용)
     */
    @PatchMapping("/actions/{actionId}/read")
    @Operation(summary = "조치 확인", description = "사용자가 대시보드에서 조치를 확인했을 때 호출합니다")
    public ResponseEntity<AdminAction> markAsRead(
            @PathVariable String actionId,
            @Valid @RequestBody MarkAsReadRequest request) {

        log.info("조치 확인 처리: actionId={}, userId={}", actionId, request.getUserId());

        AdminAction action = adminActionService.markAsRead(actionId, request.getUserId());
        return ResponseEntity.ok(action);
    }

    /**
     * 로그별 조치 목록 조회 (관리자용)
     */
    @GetMapping("/admin/logs/{logId}/actions")
    @Operation(summary = "로그별 조치 목록 조회", description = "특정 로그에 대한 관리자 조치 목록을 조회합니다")
    public ResponseEntity<List<AdminAction>> getActionsByLogId(@PathVariable String logId) {
        log.info("로그별 조치 목록 조회: logId={}", logId);

        List<AdminAction> actions = adminActionService.getActionsByLogId(logId);
        return ResponseEntity.ok(actions);
    }

    /**
     * 미확인 조치 목록 조회 (관리자용)
     */
    @GetMapping("/admin/actions/unread")
    @Operation(summary = "미확인 조치 목록 조회", description = "사용자가 아직 확인하지 않은 조치 목록을 조회합니다")
    public ResponseEntity<List<AdminAction>> getUnreadActions() {
        log.info("미확인 조치 목록 조회");

        List<AdminAction> actions = adminActionService.getUnreadActions();
        return ResponseEntity.ok(actions);
    }

    /**
     * 관리자별 조치 목록 조회 (관리자용)
     */
    @GetMapping("/admin/{adminId}/actions")
    @Operation(summary = "관리자별 조치 목록 조회", description = "특정 관리자가 생성한 조치 목록을 조회합니다")
    public ResponseEntity<List<AdminAction>> getActionsByAdminId(@PathVariable Long adminId) {
        log.info("관리자별 조치 목록 조회: adminId={}", adminId);

        List<AdminAction> actions = adminActionService.getActionsByAdminId(adminId);
        return ResponseEntity.ok(actions);
    }
}
