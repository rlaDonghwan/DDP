import api from "@/lib/axios";
import type {
  UserProfile,
  UpdateProfileRequest,
  UpdateProfileResponse,
  ChangePasswordRequest,
  UserStatus,
  Notification,
  Announcement,
} from "../types/user";

/**
 * 사용자 API 함수 모음
 */
export const userApi = {
  /**
   * 사용자 프로필 조회
   */
  getProfile: async (): Promise<UserProfile> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 사용자 프로필 조회");

    try {
      const response = await api.get<UserProfile>("/api/v1/users/profile");

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 사용자 프로필 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 사용자 프로필 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );
      throw error;
    }
  },

  /**
   * 사용자 프로필 수정
   */
  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<UpdateProfileResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 사용자 프로필 수정");

    try {
      const response = await api.patch<UpdateProfileResponse>(
        "/api/v1/users/profile",
        data
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 사용자 프로필 수정 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 사용자 프로필 수정 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );
      throw error;
    }
  },

  /**
   * 비밀번호 변경
   */
  changePassword: async (
    data: ChangePasswordRequest
  ): Promise<UpdateProfileResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 비밀번호 변경");

    try {
      const response = await api.post<UpdateProfileResponse>(
        "/api/v1/users/password",
        data
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 비밀번호 변경 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 비밀번호 변경 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 사용자 현황 정보 조회
   */
  getUserStatus: async (): Promise<UserStatus> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 사용자 현황 조회");

    try {
      const response = await api.get<UserStatus>("/api/v1/users/status");

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 사용자 현황 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 사용자 현황 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 알림 목록 조회
   */
  getNotifications: async (limit: number = 5): Promise<Notification[]> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 알림 목록 조회");

    try {
      const response = await api.get<Notification[]>(
        `/api/v1/users/notifications?limit=${limit}`
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 알림 목록 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 알림 목록 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 공지사항 목록 조회
   */
  getAnnouncements: async (limit: number = 5): Promise<Announcement[]> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 공지사항 조회");

    try {
      const response = await api.get<Announcement[]>(
        `/api/v1/users/announcements?limit=${limit}`
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 공지사항 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 공지사항 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },
};
