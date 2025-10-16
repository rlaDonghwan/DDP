import api from "@/lib/axios";
import type {
  Operator,
  OperatorFilter,
  NearbyOperatorsRequest,
  OperatorAvailability,
} from "../types/operator";

/**
 * 업체(Operator) API 함수 모음
 */
export const operatorApi = {
  /**
   * 업체 목록 조회
   */
  getOperators: async (filter?: OperatorFilter): Promise<Operator[]> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 업체 목록 조회");

    try {
      const response = await api.get<Operator[]>("/api/v1/public/operators", {
        params: filter,
      });

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 업체 목록 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 업체 목록 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 업체 상세 조회
   */
  getOperator: async (id: string): Promise<Operator> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 업체 상세 조회");

    try {
      const response = await api.get<Operator>(
        `/api/v1/public/operators/${id}`
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 업체 상세 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 업체 상세 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 주변 업체 검색 (위치 기반)
   */
  getNearbyOperators: async (
    request: NearbyOperatorsRequest
  ): Promise<Operator[]> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 주변 업체 검색");

    try {
      const { latitude, longitude, radius = 10, serviceType } = request;

      const response = await api.get<Operator[]>(
        "/api/v1/public/operators/nearby",
        {
          params: {
            lat: latitude,
            lng: longitude,
            radius,
            serviceType,
          },
        }
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 주변 업체 검색 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 주변 업체 검색 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 업체 예약 가능 일정 조회
   */
  getOperatorAvailability: async (
    operatorId: string
  ): Promise<OperatorAvailability> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 업체 예약 가능 일정 조회");

    try {
      const response = await api.get<OperatorAvailability>(
        `/api/v1/public/operators/${operatorId}/availability`
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 업체 예약 가능 일정 조회 (${(
          endTime - startTime
        ).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 업체 예약 가능 일정 조회 (${(
          endTime - startTime
        ).toFixed(2)}ms)`
      );
      throw error;
    }
  },
};
