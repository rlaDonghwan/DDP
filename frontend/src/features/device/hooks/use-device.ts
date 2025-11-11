import { useQuery } from "@tanstack/react-query";
import { deviceApi, type DeviceResponse } from "../api/device-api";

/**
 * 업체의 장치 목록 조회 훅
 */
export function useCompanyDevices(companyId: number) {
  return useQuery<DeviceResponse[]>({
    queryKey: ["devices", "company", companyId],
    queryFn: () => deviceApi.getCompanyDevices(companyId),
    enabled: !!companyId,
  });
}

/**
 * 사용자의 장치 목록 조회 훅
 */
export function useUserDevices(userId: number) {
  return useQuery<DeviceResponse[]>({
    queryKey: ["devices", "user", userId],
    queryFn: () => deviceApi.getUserDevices(userId),
    enabled: !!userId,
  });
}

/**
 * 장치 상세 조회 훅
 */
export function useDevice(deviceId: number) {
  return useQuery<DeviceResponse>({
    queryKey: ["devices", deviceId],
    queryFn: () => deviceApi.getDevice(deviceId),
    enabled: !!deviceId,
  });
}

/**
 * 전체 장치 목록 조회 훅 (관리자용)
 */
export function useAllDevices() {
  return useQuery<DeviceResponse[]>({
    queryKey: ["devices", "all"],
    queryFn: () => deviceApi.getAllDevices(),
  });
}
