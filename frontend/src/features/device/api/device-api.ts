import { apiClient } from "@/lib/axios";

/**
 * 장치 응답 DTO
 */
export interface DeviceResponse {
  deviceId: number;
  serialNumber: string;
  modelName: string;
  manufacturerId?: number;
  userId?: number;
  companyId: number;
  status: "AVAILABLE" | "INSTALLED" | "UNDER_MAINTENANCE" | "DEACTIVATED";
  installDate?: string;
  lastInspectionDate?: string;
  nextInspectionDate?: string;
  warrantyEndDate?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 장치 API
 */
export const deviceApi = {
  /**
   * 업체의 장치 목록 조회
   */
  getCompanyDevices: async (companyId: number): Promise<DeviceResponse[]> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 업체 장치 목록 조회");

    try {
      const response = await apiClient.get<DeviceResponse[]>(
        `/api/v1/devices/company/${companyId}`
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 업체 장치 목록 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 업체 장치 목록 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 사용자의 장치 목록 조회
   */
  getUserDevices: async (userId: number): Promise<DeviceResponse[]> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 사용자 장치 목록 조회");

    try {
      const response = await apiClient.get<DeviceResponse[]>(
        `/api/v1/devices/user/${userId}`
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 사용자 장치 목록 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 사용자 장치 목록 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 장치 상세 조회
   */
  getDevice: async (deviceId: number): Promise<DeviceResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 장치 상세 조회");

    try {
      const response = await apiClient.get<DeviceResponse>(`/api/v1/devices/${deviceId}`);

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
   * 전체 장치 목록 조회 (관리자용)
   */
  getAllDevices: async (): Promise<DeviceResponse[]> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 전체 장치 목록 조회 (관리자)");

    try {
      const response = await apiClient.get<DeviceResponse[]>("/api/v1/devices");

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 전체 장치 목록 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 전체 장치 목록 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },
};
