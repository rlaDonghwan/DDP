import api from "@/lib/axios";
import type {
  DeviceListResponse,
  DeviceDetailResponse,
  CreateDeviceRequest,
  UpdateDeviceRequest,
} from "../types/device";

/**
 * 장치 관리 API 함수 모음
 */
export const devicesApi = {
  /**
   * 장치 목록 조회
   */
  getDevices: async (params?: {
    searchQuery?: string;
    status?: string;
    isAssigned?: boolean;
    companyId?: string;
    page?: number;
    pageSize?: number;
  }): Promise<DeviceListResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 장치 목록 조회");

    try {
      const response = await api.get<DeviceListResponse>("/api/v1/admin/devices", {
        params,
      });

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 장치 목록 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 장치 목록 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 장치 상세 조회
   */
  getDeviceById: async (id: string): Promise<DeviceDetailResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 장치 상세 조회");

    try {
      const response = await api.get<DeviceDetailResponse>(
        `/api/admin/devices/${id}`
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 장치 상세 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 장치 상세 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 장치 등록
   */
  createDevice: async (
    data: CreateDeviceRequest
  ): Promise<{ success: boolean }> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 장치 등록");

    try {
      const response = await api.post<{ success: boolean }>(
        "/api/v1/admin/devices",
        data
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 장치 등록 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 장치 등록 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 장치 수정
   */
  updateDevice: async (
    id: string,
    data: UpdateDeviceRequest
  ): Promise<{ success: boolean }> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 장치 수정");

    try {
      const response = await api.put<{ success: boolean }>(
        `/api/admin/devices/${id}`,
        data
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 장치 수정 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 장치 수정 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 장치 삭제
   */
  deleteDevice: async (id: string): Promise<{ success: boolean }> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 장치 삭제");

    try {
      const response = await api.delete<{ success: boolean }>(
        `/api/admin/devices/${id}`
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 장치 삭제 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 장치 삭제 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },
};
