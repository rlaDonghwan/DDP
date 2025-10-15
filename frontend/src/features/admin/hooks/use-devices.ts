import { useQuery } from "@tanstack/react-query";
import { devicesApi } from "../api/devices-api";
import type { DeviceFilterData } from "../schemas/device-schema";

/**
 * 관리자 장치 목록 조회 훅
 */
export function useAdminDevices(filters?: DeviceFilterData) {
  return useQuery({
    queryKey: ["admin", "devices", filters],
    queryFn: async () => {
      const response = await devicesApi.getDevices(filters);
      return {
        devices: response.devices,
        totalCount: response.totalCount,
      };
    },
  });
}

/**
 * 장치 상세 정보 조회 훅
 */
export function useAdminDeviceDetail(id: string) {
  return useQuery({
    queryKey: ["admin", "devices", id],
    queryFn: () => devicesApi.getDeviceById(id),
    enabled: !!id,
  });
}

/**
 * 장치 통계 조회 훅
 */
export function useAdminDeviceStatistics() {
  return useQuery({
    queryKey: ["admin", "device-statistics"],
    queryFn: devicesApi.getDeviceStatistics,
  });
}

/**
 * 기존 호환성을 위한 래퍼 훅
 * @deprecated useAdminDevices를 직접 사용하세요
 */
export function useDevices(filters?: DeviceFilterData) {
  const { data, isLoading, error, refetch } = useAdminDevices(filters);

  return {
    devices: data?.devices || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
    refetch,
  };
}

/**
 * @deprecated useAdminDeviceDetail을 직접 사용하세요
 */
export function useDeviceDetail(id: string) {
  const { data, isLoading, error, refetch } = useAdminDeviceDetail(id);

  return {
    device: data || null,
    isLoading,
    error,
    refetch,
  };
}

/**
 * @deprecated useAdminDeviceStatistics를 직접 사용하세요
 */
export function useDeviceStatistics() {
  const { data, isLoading, error, refetch } = useAdminDeviceStatistics();

  return {
    statistics: data || null,
    isLoading,
    error,
    refetch,
  };
}
