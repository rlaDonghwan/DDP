import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyApi } from "../api/company-api";
import type {
  UpdateCompanyProfileRequest,
  RegisterDeviceRequest,
  UpdateDeviceRequest,
  AssignDeviceRequest,
  CompleteReservationRequest,
} from "../types/company";
import { toast } from "sonner";

/**
 * 업체 프로필 조회 훅
 */
export function useCompanyProfile() {
  return useQuery({
    queryKey: ["company", "profile"],
    queryFn: companyApi.getProfile,
  });
}

/**
 * 업체 프로필 수정 훅
 */
export function useUpdateCompanyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCompanyProfileRequest) =>
      companyApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", "profile"] });
      toast.success("업체 정보가 수정되었습니다");
    },
    onError: () => {
      toast.error("업체 정보 수정에 실패했습니다");
    },
  });
}

/**
 * 업체 통계 조회 훅
 */
export function useCompanyStats() {
  return useQuery({
    queryKey: ["company", "stats"],
    queryFn: companyApi.getStats,
  });
}

/**
 * 업체 예약 목록 조회 훅
 */
export function useCompanyReservations(status?: string) {
  return useQuery({
    queryKey: ["company", "reservations", status],
    queryFn: () => companyApi.getReservations(status),
  });
}

/**
 * 예약 승인 훅
 */
export function useApproveReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reservationId: string) =>
      companyApi.approveReservation(reservationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", "reservations"] });
      queryClient.invalidateQueries({ queryKey: ["company", "stats"] });
      toast.success("예약이 승인되었습니다");
    },
    onError: () => {
      toast.error("예약 승인에 실패했습니다");
    },
  });
}

/**
 * 예약 거절 훅
 */
export function useRejectReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      companyApi.rejectReservation(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", "reservations"] });
      queryClient.invalidateQueries({ queryKey: ["company", "stats"] });
      toast.success("예약이 거절되었습니다");
    },
    onError: () => {
      toast.error("예약 거절에 실패했습니다");
    },
  });
}

/**
 * 예약 완료 처리 훅
 */
export function useCompleteReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: CompleteReservationRequest;
    }) => companyApi.completeReservation(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", "reservations"] });
      queryClient.invalidateQueries({ queryKey: ["company", "stats"] });
      toast.success("예약이 완료 처리되었습니다");
    },
    onError: () => {
      toast.error("예약 완료 처리에 실패했습니다");
    },
  });
}

/**
 * 고객 목록 조회 훅
 */
export function useCompanyCustomers() {
  return useQuery({
    queryKey: ["company", "customers"],
    queryFn: companyApi.getCustomers,
  });
}

/**
 * 고객 상세 조회 훅
 */
export function useCompanyCustomer(customerId: string) {
  return useQuery({
    queryKey: ["company", "customers", customerId],
    queryFn: () => companyApi.getCustomer(customerId),
    enabled: !!customerId,
  });
}

/**
 * 장치 목록 조회 훅
 */
export function useCompanyDevices(status?: string) {
  return useQuery({
    queryKey: ["company", "devices", status],
    queryFn: () => companyApi.getDevices(status),
  });
}

/**
 * 장치 상세 조회 훅
 */
export function useCompanyDevice(deviceId: string) {
  return useQuery({
    queryKey: ["company", "devices", deviceId],
    queryFn: () => companyApi.getDevice(deviceId),
    enabled: !!deviceId,
  });
}

/**
 * 장치 등록 훅
 */
export function useRegisterDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterDeviceRequest) =>
      companyApi.registerDevice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", "devices"] });
      queryClient.invalidateQueries({ queryKey: ["company", "stats"] });
      toast.success("장치가 등록되었습니다");
    },
    onError: () => {
      toast.error("장치 등록에 실패했습니다");
    },
  });
}

/**
 * 장치 수정 훅
 */
export function useUpdateDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDeviceRequest }) =>
      companyApi.updateDevice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", "devices"] });
      toast.success("장치 정보가 수정되었습니다");
    },
    onError: () => {
      toast.error("장치 정보 수정에 실패했습니다");
    },
  });
}

/**
 * 장치 삭제 훅
 */
export function useDeleteDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (deviceId: string) => companyApi.deleteDevice(deviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", "devices"] });
      queryClient.invalidateQueries({ queryKey: ["company", "stats"] });
      toast.success("장치가 삭제되었습니다");
    },
    onError: () => {
      toast.error("장치 삭제에 실패했습니다");
    },
  });
}

/**
 * 장치 할당 훅
 */
export function useAssignDevice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ deviceId, data }: { deviceId: string; data: AssignDeviceRequest }) =>
      companyApi.assignDeviceToCustomer(deviceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", "devices"] });
      queryClient.invalidateQueries({ queryKey: ["company", "customers"] });
      queryClient.invalidateQueries({ queryKey: ["company", "stats"] });
      toast.success("장치가 고객에게 할당되었습니다");
    },
    onError: () => {
      toast.error("장치 할당에 실패했습니다");
    },
  });
}
