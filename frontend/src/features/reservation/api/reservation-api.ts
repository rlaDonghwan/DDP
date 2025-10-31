import api from "@/lib/axios";
import type {
  Reservation,
  CancelReservationRequest,
  ConfirmReservationRequest,
  RejectReservationRequest,
} from "../types/reservation";

/**
 * 예약(Reservation) API 함수 모음
 */
export const reservationApi = {
  /**
   * 내 예약 목록 조회 (사용자)
   */
  getMyReservations: async (userId: string): Promise<Reservation[]> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 내 예약 목록 조회");

    try {
      const response = await api.get<Reservation[]>(
        `/api/v1/reservations/user/${userId}`
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 내 예약 목록 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 내 예약 목록 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );
      throw error;
    }
  },

  /**
   * 예약 상세 조회
   */
  getReservation: async (id: string): Promise<Reservation> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 예약 상세 조회");

    try {
      const response = await api.get<Reservation>(`/api/v1/reservations/${id}`);

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 예약 상세 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 예약 상세 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 예약 취소 (사용자)
   */
  cancelReservation: async (
    id: string,
    data?: CancelReservationRequest
  ): Promise<void> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 예약 취소");

    try {
      await api.patch(`/api/v1/reservations/${id}/cancel`, data);

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 예약 취소 (${(endTime - startTime).toFixed(2)}ms)`
      );
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 예약 취소 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 예약 확정 (업체)
   */
  confirmReservation: async (
    id: string,
    data?: ConfirmReservationRequest
  ): Promise<void> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 예약 확정");

    try {
      await api.patch(`/api/v1/reservations/${id}/confirm`, data);

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 예약 확정 (${(endTime - startTime).toFixed(2)}ms)`
      );
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 예약 확정 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 예약 거절 (업체)
   */
  rejectReservation: async (
    id: string,
    data: RejectReservationRequest
  ): Promise<void> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 예약 거절");

    try {
      await api.patch(`/api/v1/reservations/${id}/reject`, data);

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 예약 거절 (${(endTime - startTime).toFixed(2)}ms)`
      );
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 예약 거절 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 업체의 예약 목록 조회 (업체용)
   */
  getOperatorReservations: async (
    operatorId: string
  ): Promise<Reservation[]> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 업체 예약 목록 조회");

    try {
      const response = await api.get<Reservation[]>(
        `/api/v1/reservations/operator/${operatorId}`
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 업체 예약 목록 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 업체 예약 목록 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );
      throw error;
    }
  },
};
