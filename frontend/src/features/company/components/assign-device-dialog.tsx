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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAssignDevice, useCompanyCustomers } from "../hooks/use-company";
import type { CompanyDevice } from "../types/company";

/**
 * 장치 할당 폼 스키마
 */
const assignDeviceSchema = z.object({
  customerId: z.string().min(1, "고객을 선택해주세요"),
  installationDate: z.string().min(1, "설치일을 선택해주세요"),
  installationNote: z.string().optional(),
});

type AssignDeviceFormData = z.infer<typeof assignDeviceSchema>;

interface AssignDeviceDialogProps {
  device: CompanyDevice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * 장치 할당 다이얼로그 컴포넌트
 * 업체가 보유한 장치를 고객에게 할당합니다
 */
export function AssignDeviceDialog({
  device,
  open,
  onOpenChange,
}: AssignDeviceDialogProps) {
  const { data: customers } = useCompanyCustomers();
  const assignMutation = useAssignDevice();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AssignDeviceFormData>({
    resolver: zodResolver(assignDeviceSchema),
  });

  const customerId = watch("customerId");

  /**
   * 폼 제출 핸들러
   */
  const onSubmit = async (data: AssignDeviceFormData) => {
    if (!device) return;

    try {
      await assignMutation.mutateAsync({
        deviceId: device.id,
        data: {
          customerId: data.customerId,
          installationDate: data.installationDate,
          installationNote: data.installationNote,
        },
      });

      // 성공 시 다이얼로그 닫기 및 폼 리셋
      onOpenChange(false);
      reset();
    } catch (error) {
      // 에러는 훅에서 처리됨
      console.error("장치 할당 실패:", error);
    }
  };

  /**
   * 다이얼로그 닫기 핸들러
   */
  const handleClose = () => {
    if (!assignMutation.isPending) {
      onOpenChange(false);
      reset();
    }
  };

  // 장치가 미설정된 고객만 필터링
  const availableCustomers = customers?.filter((c) => !c.deviceInstalled) || [];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>고객에게 장치 할당</DialogTitle>
            <DialogDescription>
              {device && (
                <>
                  장치 <strong>{device.serialNumber}</strong>를 고객에게
                  할당합니다
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* 고객 선택 */}
            <div className="space-y-2">
              <Label htmlFor="customerId">
                고객 선택 <span className="text-red-600">*</span>
              </Label>
              {availableCustomers.length === 0 ? (
                <p className="text-sm text-gray-500">
                  장치가 할당되지 않은 고객이 없습니다
                </p>
              ) : (
                <>
                  <Select
                    value={customerId}
                    onValueChange={(value) => setValue("customerId", value)}
                  >
                    <SelectTrigger id="customerId">
                      <SelectValue placeholder="고객을 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCustomers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} ({customer.phone})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.customerId && (
                    <p className="text-sm text-red-600">
                      {errors.customerId.message}
                    </p>
                  )}
                </>
              )}
            </div>

            {/* 설치일 */}
            <div className="space-y-2">
              <Label htmlFor="installationDate">
                설치일 <span className="text-red-600">*</span>
              </Label>
              <Input
                id="installationDate"
                type="date"
                {...register("installationDate")}
              />
              {errors.installationDate && (
                <p className="text-sm text-red-600">
                  {errors.installationDate.message}
                </p>
              )}
            </div>

            {/* 설치 메모 */}
            <div className="space-y-2">
              <Label htmlFor="installationNote">설치 메모 (선택)</Label>
              <Textarea
                id="installationNote"
                {...register("installationNote")}
                placeholder="설치 관련 메모를 입력하세요"
                rows={3}
              />
              {errors.installationNote && (
                <p className="text-sm text-red-600">
                  {errors.installationNote.message}
                </p>
              )}
            </div>

            {/* 장치 정보 요약 */}
            {device && (
              <div className="rounded-md bg-gray-50 p-3 space-y-1">
                <p className="text-sm font-medium text-gray-900">장치 정보</p>
                <p className="text-sm text-gray-600">모델: {device.model}</p>
                <p className="text-sm text-gray-600">
                  제조사: {device.manufacturer}
                </p>
                <p className="text-sm text-gray-600">
                  시리얼 번호: {device.serialNumber}
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={assignMutation.isPending}
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={assignMutation.isPending || availableCustomers.length === 0}
            >
              {assignMutation.isPending ? "할당 중..." : "할당"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
