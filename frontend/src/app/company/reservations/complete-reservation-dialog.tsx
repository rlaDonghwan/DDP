"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  CompleteReservationRequest,
  InspectionResult,
  ServiceType,
} from "@/features/company/types/company";

/**
 * 서비스 타입별 입력 폼 스키마
 */
const getFormSchema = (serviceType: ServiceType) => {
  const baseSchema = z.object({
    completedDate: z.string().min(1, "완료 일시를 입력하세요"),
    cost: z.coerce.number().min(0, "비용은 0 이상이어야 합니다").optional(),
    notes: z.string().optional(),
  });

  if (serviceType === "INSTALLATION") {
    return baseSchema.extend({
      deviceSerialNumber: z.string().min(1, "장치 시리얼 번호는 필수입니다"),
      modelName: z.string().min(1, "모델명은 필수입니다"),
      manufacturerId: z.coerce.number().optional(),
      warrantyEndDate: z.string().optional(),
    });
  }

  if (serviceType === "INSPECTION") {
    return baseSchema.extend({
      inspectionResult: z.enum(["PASS", "FAIL", "CONDITIONAL_PASS"] as const, {
        message: "검사 결과는 필수입니다",
      }),
      nextInspectionDate: z.string().optional(),
      deviceId: z.coerce.number().optional(),
    });
  }

  if (serviceType === "REPAIR" || serviceType === "MAINTENANCE") {
    return baseSchema.extend({
      workDescription: z.string().min(1, "작업 내용은 필수입니다"),
      replacedParts: z.string().optional(),
      repairDeviceId: z.coerce.number().optional(),
    });
  }

  return baseSchema;
};

interface CompleteReservationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reservationId: string;
  serviceType: ServiceType;
  onSubmit: (data: CompleteReservationRequest) => Promise<void>;
  isSubmitting: boolean;
}

/**
 * 예약 완료 다이얼로그 컴포넌트
 */
export function CompleteReservationDialog({
  open,
  onOpenChange,
  reservationId,
  serviceType,
  onSubmit,
  isSubmitting,
}: CompleteReservationDialogProps) {
  const formSchema = getFormSchema(serviceType);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<any>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      completedDate: new Date().toISOString().slice(0, 16),
    },
  });

  const onSubmitForm = async (data: any) => {
    await onSubmit(data as CompleteReservationRequest);
    reset();
    onOpenChange(false);
  };

  const getDialogTitle = () => {
    const titleMap = {
      INSTALLATION: "신규 설치 완료 처리",
      INSPECTION: "검·교정 완료 처리",
      MAINTENANCE: "유지보수 완료 처리",
      REPAIR: "수리 완료 처리",
      ALL: "서비스 완료 처리",
    };
    return titleMap[serviceType] || "서비스 완료 처리";
  };

  const getDialogDescription = () => {
    const descriptionMap = {
      INSTALLATION:
        "설치한 장치의 시리얼 번호와 모델명을 입력하고 서비스 내용을 기록하세요.",
      INSPECTION: "검·교정 결과를 선택하고 다음 검사 예정일을 입력하세요.",
      MAINTENANCE: "수행한 유지보수 작업 내용을 상세히 기록하세요.",
      REPAIR: "수리 내역과 교체한 부품 정보를 입력하세요.",
      ALL: "서비스 완료 정보를 입력하세요.",
    };
    return descriptionMap[serviceType] || "서비스 완료 정보를 입력하세요.";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
          <DialogDescription>{getDialogDescription()}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4 py-4">
          {/* 공통 필드 */}
          <div className="space-y-2">
            <Label htmlFor="completedDate">완료 일시 *</Label>
            <Input
              id="completedDate"
              type="datetime-local"
              {...register("completedDate")}
            />
            {errors.completedDate && (
              <p className="text-sm text-red-600">
                {String(errors.completedDate.message)}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="cost">비용 (원)</Label>
            <Input
              id="cost"
              type="number"
              placeholder="서비스 비용을 입력하세요"
              {...register("cost")}
            />
            {errors.cost && (
              <p className="text-sm text-red-600">
                {String(errors.cost.message)}
              </p>
            )}
          </div>

          {/* INSTALLATION 전용 필드 */}
          {serviceType === "INSTALLATION" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="deviceSerialNumber">장치 시리얼 번호 *</Label>
                <Input
                  id="deviceSerialNumber"
                  placeholder="DDP-2025-001"
                  {...register("deviceSerialNumber")}
                />
                {errors.deviceSerialNumber && (
                  <p className="text-sm text-red-600">
                    {String(errors.deviceSerialNumber.message)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="modelName">모델명 *</Label>
                <Input
                  id="modelName"
                  placeholder="DDP-X100"
                  {...register("modelName")}
                />
                {errors.modelName && (
                  <p className="text-sm text-red-600">
                    {String(errors.modelName.message)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="warrantyEndDate">보증 종료일</Label>
                <Input
                  id="warrantyEndDate"
                  type="date"
                  {...register("warrantyEndDate")}
                />
              </div>
            </>
          )}

          {/* INSPECTION 전용 필드 */}
          {serviceType === "INSPECTION" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="inspectionResult">검사 결과 *</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("inspectionResult", value as InspectionResult)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="검사 결과 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PASS">합격</SelectItem>
                    <SelectItem value="FAIL">불합격</SelectItem>
                    <SelectItem value="CONDITIONAL_PASS">
                      조건부 합격
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.inspectionResult && (
                  <p className="text-sm text-red-600">
                    {String(errors.inspectionResult.message)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextInspectionDate">다음 검사 예정일</Label>
                <Input
                  id="nextInspectionDate"
                  type="date"
                  {...register("nextInspectionDate")}
                />
              </div>
            </>
          )}

          {/* REPAIR/MAINTENANCE 전용 필드 */}
          {(serviceType === "REPAIR" || serviceType === "MAINTENANCE") && (
            <>
              <div className="space-y-2">
                <Label htmlFor="workDescription">작업 내용 *</Label>
                <Textarea
                  id="workDescription"
                  placeholder="수행한 작업 내용을 상세히 입력하세요"
                  className="min-h-[100px]"
                  {...register("workDescription")}
                />
                {errors.workDescription && (
                  <p className="text-sm text-red-600">
                    {String(errors.workDescription.message)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="replacedParts">교체 부품</Label>
                <Input
                  id="replacedParts"
                  placeholder="센서 모듈, 케이블 등"
                  {...register("replacedParts")}
                />
              </div>
            </>
          )}

          {/* 특이사항 (공통) */}
          <div className="space-y-2">
            <Label htmlFor="notes">특이사항</Label>
            <Textarea
              id="notes"
              placeholder="특이사항이나 추가 메모를 입력하세요"
              className="min-h-[80px]"
              {...register("notes")}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "처리 중..." : "완료 처리"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
