"use client";

import { useState } from "react";
import {
  useCompanyDevices,
  useRegisterDevice,
  useUpdateDevice,
  useDeleteDevice,
} from "@/features/company/hooks/use-company";
import { AssignDeviceDialog } from "@/features/company/components/assign-device-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wrench, Plus, Calendar, User, Trash2, UserPlus } from "lucide-react";
import { formatKoreanDate } from "@/lib/date-utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { DeviceStatus, CompanyDevice } from "@/features/company/types/company";

/**
 * 장치 등록 스키마
 */
const registerDeviceSchema = z.object({
  serialNumber: z.string().min(1, "시리얼 번호를 입력하세요"),
  model: z.string().min(1, "모델명을 입력하세요"),
  manufacturer: z.string().min(1, "제조사를 입력하세요"),
  purchaseDate: z.string().min(1, "구매일을 입력하세요"),
});

type RegisterDeviceInput = z.infer<typeof registerDeviceSchema>;

/**
 * 업체 장치 관리 페이지
 */
export default function CompanyDevicesPage() {
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | "ALL">("ALL");
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState<CompanyDevice | null>(null);

  const { data: devices, isLoading } = useCompanyDevices(
    statusFilter === "ALL" ? undefined : statusFilter
  );
  const registerMutation = useRegisterDevice();
  const updateMutation = useUpdateDevice();
  const deleteMutation = useDeleteDevice();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterDeviceInput>({
    resolver: zodResolver(registerDeviceSchema),
  });

  /**
   * 장치 등록 처리
   */
  const onSubmit = async (data: RegisterDeviceInput) => {
    await registerMutation.mutateAsync(data);
    setIsRegisterDialogOpen(false);
    reset();
  };

  /**
   * 장치 삭제 처리
   */
  const handleDelete = async (deviceId: string) => {
    await deleteMutation.mutateAsync(deviceId);
  };

  /**
   * 상태 뱃지 스타일
   */
  const getStatusBadge = (status: DeviceStatus) => {
    const styles = {
      AVAILABLE: { variant: "default" as const, text: "사용 가능" },
      INSTALLED: { variant: "secondary" as const, text: "설치됨" },
      MAINTENANCE: { variant: "outline" as const, text: "점검 중" },
      RETIRED: { variant: "destructive" as const, text: "폐기" },
    };
    const config = styles[status];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            장치 관리
          </h1>
          <p className="text-gray-600 mt-2">
            보유한 음주운전 방지장치를 등록하고 관리합니다
          </p>
        </div>
        <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              장치 등록
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <DialogHeader>
                <DialogTitle>새 장치 등록</DialogTitle>
                <DialogDescription>
                  새로운 장치 정보를 입력하여 등록하세요
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">시리얼 번호</Label>
                  <Input
                    id="serialNumber"
                    {...register("serialNumber")}
                    placeholder="예: DUI-2024-001"
                  />
                  {errors.serialNumber && (
                    <p className="text-sm text-red-600">
                      {errors.serialNumber.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">모델명</Label>
                  <Input
                    id="model"
                    {...register("model")}
                    placeholder="예: DUI-PRO-2024"
                  />
                  {errors.model && (
                    <p className="text-sm text-red-600">{errors.model.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manufacturer">제조사</Label>
                  <Input
                    id="manufacturer"
                    {...register("manufacturer")}
                    placeholder="예: 한국음주방지시스템"
                  />
                  {errors.manufacturer && (
                    <p className="text-sm text-red-600">
                      {errors.manufacturer.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">구매일</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    {...register("purchaseDate")}
                  />
                  {errors.purchaseDate && (
                    <p className="text-sm text-red-600">
                      {errors.purchaseDate.message}
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsRegisterDialogOpen(false);
                    reset();
                  }}
                >
                  취소
                </Button>
                <Button type="submit" disabled={registerMutation.isPending}>
                  등록
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 필터 및 목록 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>장치 목록</CardTitle>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                총 <span className="font-semibold">{devices?.length || 0}</span>대
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as DeviceStatus | "ALL")
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">전체</SelectItem>
                  <SelectItem value="AVAILABLE">사용 가능</SelectItem>
                  <SelectItem value="INSTALLED">설치됨</SelectItem>
                  <SelectItem value="MAINTENANCE">점검 중</SelectItem>
                  <SelectItem value="RETIRED">폐기</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!devices || devices.length === 0 ? (
            <div className="text-center py-20">
              <Wrench className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2">등록된 장치가 없습니다</p>
              <Button
                variant="outline"
                onClick={() => setIsRegisterDialogOpen(true)}
              >
                장치 등록하기
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {devices.map((device) => (
                <Card
                  key={device.id}
                  className="border-l-4 border-l-purple-500 hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Wrench className="h-5 w-5" />
                          {device.model}
                          {getStatusBadge(device.status)}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          S/N: {device.serialNumber} • 제조사: {device.manufacturer}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* 고객 할당 버튼 (AVAILABLE 상태일 때만 표시) */}
                        {device.status === "AVAILABLE" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedDevice(device);
                              setIsAssignDialogOpen(true);
                            }}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            고객 할당
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>장치 삭제</AlertDialogTitle>
                            <AlertDialogDescription>
                              이 장치를 삭제하시겠습니까? 이 작업은 되돌릴 수
                              없습니다.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>취소</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(device.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              삭제
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {device.assignedTo && device.assignedToName && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                            <User className="h-4 w-4" />
                            설치 고객
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {device.assignedToName}
                          </p>
                        </div>
                      )}
                      {device.installationDate && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            설치일
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatKoreanDate(device.installationDate)}
                          </p>
                        </div>
                      )}
                      {device.lastInspectionDate && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            최종 점검일
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatKoreanDate(device.lastInspectionDate)}
                          </p>
                        </div>
                      )}
                      {device.nextInspectionDate && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            다음 점검일
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatKoreanDate(device.nextInspectionDate)}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 pt-4 border-t text-sm text-gray-600">
                      등록일: {formatKoreanDate(device.createdAt)} • 최종 수정:{" "}
                      {formatKoreanDate(device.updatedAt)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 장치 할당 다이얼로그 */}
      <AssignDeviceDialog
        device={selectedDevice}
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
      />
    </div>
  );
}
