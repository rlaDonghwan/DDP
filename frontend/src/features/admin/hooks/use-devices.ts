"use client";

import { useState, useEffect } from "react";
import { devicesApi } from "../api/devices-api";
import type { Device, DeviceDetail } from "../types/device";
import type { DeviceFilterData } from "../schemas/device-schema";

/**
 * 장치 목록 관리 훅
 */
export function useDevices(filters?: DeviceFilterData) {
  const [devices, setDevices] = useState<Device[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 장치 목록 조회
   */
  const fetchDevices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await devicesApi.getDevices(filters);
      setDevices(response.devices);
      setTotalCount(response.totalCount);
    } catch (err) {
      console.error("장치 목록 조회 실패:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 변경 시 데이터 재조회
  useEffect(() => {
    fetchDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return {
    devices,
    totalCount,
    isLoading,
    error,
    refetch: fetchDevices,
  };
}

/**
 * 장치 상세 정보 관리 훅
 */
export function useDeviceDetail(id: string) {
  const [device, setDevice] = useState<DeviceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 장치 상세 조회
   */
  const fetchDeviceDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await devicesApi.getDeviceById(id);
      setDevice(response.device);
    } catch (err) {
      console.error("장치 상세 조회 실패:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDeviceDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return {
    device,
    isLoading,
    error,
    refetch: fetchDeviceDetail,
  };
}
