"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { actionApi } from "../api/action-api";
import type { DrivingLogResponse } from "@/features/log/types/log";
import type { ActionType, CreateActionRequest } from "../types/action";
import { ACTION_TYPE_LABELS } from "../types/action";
import { useSession } from "@/features/auth/hooks/use-session";

interface AdminActionDialogProps {
  log: DrivingLogResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onActionCreated: () => void;
}

/**
 * 관리자 조치 생성 다이얼로그
 * 위험도 기반으로 추천 조치를 표시하고 조치를 생성합니다
 */
export function AdminActionDialog({
  log,
  open,
  onOpenChange,
  onActionCreated,
}: AdminActionDialogProps) {
  const { user } = useSession();
  const queryClient = useQueryClient();
  const [selectedActionType, setSelectedActionType] = useState<ActionType | "">(
    ""
  );
  const [actionDetail, setActionDetail] = useState("");

  // 조치 생성 mutation
  const createActionMutation = useMutation({
    mutationFn: (data: CreateActionRequest) => actionApi.createAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "logs"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "actions"] });
      onActionCreated();
      // Reset form
      setSelectedActionType("");
      setActionDetail("");
    },
  });

  // 위험도에 따른 추천 조치
  const getRecommendedActions = (): ActionType[] => {
    if (!log?.riskLevel) return [];

    switch (log.riskLevel) {
      case "HIGH":
        return [
          "EMERGENCY_CONTACT",
          "DEVICE_REINSTALLATION_REQUIRED",
          "LICENSE_SUSPENSION",
          "POLICE_REPORT",
        ];
      case "MEDIUM":
        return [
          "WARNING_NOTIFICATION",
          "ADDITIONAL_INSPECTION_REQUIRED",
          "EDUCATION_REQUIRED",
          "LOG_SUBMISSION_FREQUENCY_CHANGE",
        ];
      case "LOW":
        return ["WARNING_NOTIFICATION"];
      default:
        return [];
    }
  };

  // 조치 생성 핸들러
  const handleCreateAction = () => {
    if (!log || !selectedActionType || !actionDetail.trim() || !user) return;

    const request: CreateActionRequest = {
      logId: log.logId,
      userId: log.userId,
      adminId: user.id,
      actionType: selectedActionType as ActionType,
      actionDetail: actionDetail.trim(),
    };

    createActionMutation.mutate(request);
  };

  // 위험도 뱃지
  const getRiskBadge = () => {
    if (!log?.riskLevel) return null;

    const variants = {
      HIGH: { variant: "destructive" as const, text: "긴급", emoji: "🔴" },
      MEDIUM: { variant: "secondary" as const, text: "경고", emoji: "🟡" },
      LOW: { variant: "outline" as const, text: "정상", emoji: "🟢" },
    };

    const style = variants[log.riskLevel];
    return (
      <Badge variant={style.variant}>
        {style.emoji} {style.text}
      </Badge>
    );
  };

  // 이상 유형 라벨
  const getAnomalyTypeLabel = (type?: string): string => {
    const labels: Record<string, string> = {
      NORMAL: "정상",
      TAMPERING_ATTEMPT: "장치 조작 시도",
      BYPASS_ATTEMPT: "우회 시도",
      EXCESSIVE_FAILURES: "과도한 측정 실패",
      DEVICE_MALFUNCTION: "장치 오작동",
      DATA_INCONSISTENCY: "데이터 불일치",
    };
    return type ? labels[type] || "알 수 없음" : "정보 없음";
  };

  const recommendedActions = getRecommendedActions();
  const allActionTypes: ActionType[] = [
    "WARNING_NOTIFICATION",
    "ADDITIONAL_INSPECTION_REQUIRED",
    "EDUCATION_REQUIRED",
    "LOG_SUBMISSION_FREQUENCY_CHANGE",
    "DEVICE_REINSTALLATION_REQUIRED",
    "EMERGENCY_CONTACT",
    "LICENSE_STATUS_CHANGE",
    "LICENSE_SUSPENSION",
    "LICENSE_REVOCATION",
    "LEGAL_ACTION_REVIEW",
    "POLICE_REPORT",
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>관리자 조치 생성</DialogTitle>
          <DialogDescription>
            로그 분석 결과에 따른 적절한 조치를 선택하고 상세 내용을 입력하세요
          </DialogDescription>
        </DialogHeader>

        {log && (
          <div className="space-y-6">
            {/* 로그 정보 */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">로그 정보</h3>
                {getRiskBadge()}
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">로그 ID:</span>
                  <span className="ml-2 font-medium">{log.logId}</span>
                </div>
                <div>
                  <span className="text-gray-600">사용자 ID:</span>
                  <span className="ml-2 font-medium">{log.userId}</span>
                </div>
                <div>
                  <span className="text-gray-600">제출일:</span>
                  <span className="ml-2 font-medium">
                    {new Date(log.submitDate).toLocaleDateString("ko-KR")}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">이상 유형:</span>
                  <span className="ml-2 font-medium">
                    {getAnomalyTypeLabel(log.anomalyType)}
                  </span>
                </div>
              </div>
            </div>

            {/* 추천 조치 */}
            {recommendedActions.length > 0 && (
              <div>
                <Label className="text-base font-semibold">
                  추천 조치 ({log.riskLevel} 위험도)
                </Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {recommendedActions.map((actionType) => (
                    <Button
                      key={actionType}
                      variant={
                        selectedActionType === actionType
                          ? "default"
                          : "outline"
                      }
                      className="justify-start h-auto py-3"
                      onClick={() => setSelectedActionType(actionType)}
                    >
                      {selectedActionType === actionType && (
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                      )}
                      {ACTION_TYPE_LABELS[actionType]}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* 기타 조치 선택 */}
            <div>
              <Label htmlFor="action-type" className="text-base font-semibold">
                기타 조치 선택
              </Label>
              <Select
                value={selectedActionType}
                onValueChange={(value) => setSelectedActionType(value as ActionType)}
              >
                <SelectTrigger id="action-type" className="mt-2">
                  <SelectValue placeholder="조치 유형을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {allActionTypes.map((actionType) => (
                    <SelectItem key={actionType} value={actionType}>
                      {ACTION_TYPE_LABELS[actionType]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 조치 상세 내용 */}
            <div>
              <Label htmlFor="action-detail" className="text-base font-semibold">
                조치 상세 내용 *
              </Label>
              <Textarea
                id="action-detail"
                placeholder="조치 내용을 구체적으로 입력하세요..."
                className="mt-2 min-h-[120px]"
                value={actionDetail}
                onChange={(e) => setActionDetail(e.target.value)}
              />
              <p className="mt-1 text-xs text-gray-500">
                사용자에게 전달될 내용입니다. 명확하고 구체적으로 작성해주세요.
              </p>
            </div>

            {/* 미리보기 */}
            {selectedActionType && actionDetail.trim() && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">미리보기</h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-blue-700">조치 유형:</span>
                    <Badge variant="secondary" className="ml-2">
                      {ACTION_TYPE_LABELS[selectedActionType as ActionType]}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-blue-700">상세 내용:</span>
                    <p className="mt-1 text-gray-700 whitespace-pre-wrap">
                      {actionDetail}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 에러 메시지 */}
            {createActionMutation.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  조치 생성 중 오류가 발생했습니다. 다시 시도해주세요.
                </AlertDescription>
              </Alert>
            )}

            {/* 액션 버튼 */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={createActionMutation.isPending}
              >
                취소
              </Button>
              <Button
                onClick={handleCreateAction}
                disabled={
                  !selectedActionType ||
                  !actionDetail.trim() ||
                  createActionMutation.isPending
                }
              >
                {createActionMutation.isPending ? "생성 중..." : "조치 생성"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
