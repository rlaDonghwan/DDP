/**
 * 서비스 이력 API 클라이언트
 */

import { apiClient } from "@/lib/axios";
import type { ServiceRecord } from "../types/service-record";

/**
 * 서비스 이력 API
 */
export const serviceRecordApi = {
  /**
   * 업체의 서비스 이력 목록 조회
   */
  getCompanyServiceRecords: async (companyId: number): Promise<ServiceRecord[]> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 업체 서비스 이력 조회");

    try {
      const response = await apiClient.get<ServiceRecord[]>(
        `/api/v1/company/service-records/company/${companyId}`
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 업체 서비스 이력 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 업체 서비스 이력 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 서비스 이력 상세 조회
   */
  getServiceRecord: async (id: string): Promise<ServiceRecord> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 서비스 이력 상세 조회");

    try {
      const response = await apiClient.get<ServiceRecord>(
        `/api/v1/company/service-records/${id}`
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 서비스 이력 상세 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 서비스 이력 상세 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 사용자별 서비스 이력 조회
   */
  getUserServiceRecords: async (subjectId: string): Promise<ServiceRecord[]> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 사용자 서비스 이력 조회");

    try {
      const response = await apiClient.get<ServiceRecord[]>(
        `/api/v1/company/service-records/user/${subjectId}`
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 사용자 서비스 이력 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 사용자 서비스 이력 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 장치별 서비스 이력 조회
   */
  getDeviceServiceRecords: async (deviceId: string): Promise<ServiceRecord[]> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 장치 서비스 이력 조회");

    try {
      const response = await apiClient.get<ServiceRecord[]>(
        `/api/v1/company/service-records/device/${deviceId}`
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 장치 서비스 이력 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 장치 서비스 이력 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },
};
