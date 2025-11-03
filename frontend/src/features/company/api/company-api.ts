import { apiClient } from "@/lib/axios";
import type {
  Company,
  CompanyStats,
  UpdateCompanyProfileRequest,
  CompanyCustomer,
  CompanyDevice,
  RegisterDeviceRequest,
  UpdateDeviceRequest,
  AssignDeviceRequest,
} from "../types/company";
import type { Reservation } from "@/features/reservation/types/reservation";

/**
 * 업체 API 함수들
 */
export const companyApi = {
  /**
   * 업체 프로필 조회
   */
  getProfile: async (): Promise<Company> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 업체 프로필 조회");

    try {
      const response = await apiClient.get<Company>("/company/profile");

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 업체 프로필 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 업체 프로필 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 업체 프로필 수정
   */
  updateProfile: async (data: UpdateCompanyProfileRequest): Promise<Company> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 업체 프로필 수정");

    try {
      const response = await apiClient.put<Company>("/company/profile", data);

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 업체 프로필 수정 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 업체 프로필 수정 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 업체 통계 조회
   */
  getStats: async (): Promise<CompanyStats> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 업체 통계 조회");

    try {
      const response = await apiClient.get<CompanyStats>("/company/stats");

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 업체 통계 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 업체 통계 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 업체 예약 목록 조회
   */
  getReservations: async (status?: string): Promise<Reservation[]> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 업체 예약 목록 조회");

    try {
      const params = status ? { status } : {};
      const response = await apiClient.get<Reservation[]>(
        "/api/v1/reservations/company",
        { params }
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 업체 예약 목록 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 업체 예약 목록 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 예약 확정
   */
  approveReservation: async (reservationId: string): Promise<Reservation> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 예약 확정");

    try {
      const response = await apiClient.post<Reservation>(
        `/api/v1/reservations/company/${reservationId}/confirm`
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 예약 확정 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 예약 확정 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 예약 거절
   */
  rejectReservation: async (
    reservationId: string,
    reason: string
  ): Promise<Reservation> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 예약 거절");

    try {
      const response = await apiClient.post<Reservation>(
        `/api/v1/reservations/company/${reservationId}/reject`,
        { reason }
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 예약 거절 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 예약 거절 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 예약 완료 처리
   */
  completeReservation: async (reservationId: string): Promise<Reservation> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 예약 완료 처리");

    try {
      const response = await apiClient.post<Reservation>(
        `/api/v1/reservations/company/${reservationId}/complete`
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 예약 완료 처리 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 예약 완료 처리 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 고객 목록 조회
   */
  getCustomers: async (): Promise<CompanyCustomer[]> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 고객 목록 조회");

    try {
      const response = await apiClient.get<CompanyCustomer[]>(
        "/company/customers"
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 고객 목록 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 고객 목록 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 고객 상세 조회
   */
  getCustomer: async (customerId: string): Promise<CompanyCustomer> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 고객 상세 조회");

    try {
      const response = await apiClient.get<CompanyCustomer>(
        `/company/customers/${customerId}`
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 고객 상세 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 고객 상세 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 장치 목록 조회
   */
  getDevices: async (status?: string): Promise<CompanyDevice[]> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 장치 목록 조회");

    try {
      const params = status ? { status } : {};
      const response = await apiClient.get<CompanyDevice[]>("/company/devices", {
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
  getDevice: async (deviceId: string): Promise<CompanyDevice> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 장치 상세 조회");

    try {
      const response = await apiClient.get<CompanyDevice>(
        `/company/devices/${deviceId}`
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
  registerDevice: async (data: RegisterDeviceRequest): Promise<CompanyDevice> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 장치 등록");

    try {
      const response = await apiClient.post<CompanyDevice>(
        "/company/devices",
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
    deviceId: string,
    data: UpdateDeviceRequest
  ): Promise<CompanyDevice> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 장치 수정");

    try {
      const response = await apiClient.put<CompanyDevice>(
        `/company/devices/${deviceId}`,
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
  deleteDevice: async (deviceId: string): Promise<void> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 장치 삭제");

    try {
      await apiClient.delete(`/company/devices/${deviceId}`);

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 장치 삭제 (${(endTime - startTime).toFixed(2)}ms)`
      );
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 장치 삭제 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 장치를 고객에게 할당
   */
  assignDeviceToCustomer: async (
    deviceId: string,
    data: AssignDeviceRequest
  ): Promise<CompanyDevice> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 장치 고객 할당");

    try {
      const response = await apiClient.post<CompanyDevice>(
        `/company/devices/${deviceId}/assign`,
        data
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 장치 고객 할당 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 장치 고객 할당 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },
};
