import api from "@/lib/axios";
import type {
  LoginRequest,
  LoginResponse,
  SessionResponse,
  UserRole,
} from "@/types/auth";

/**
 * 인증 API 함수 모음
 */
export const authApi = {
  /**
   * 사용자 로그인 (모든 역할)
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 사용자 로그인");

    try {
      const response = await api.post<LoginResponse>(
        "/api/v1/auth/login",
        data
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 사용자 로그인 (${(endTime - startTime).toFixed(2)}ms)`
      );

      // 백엔드 응답 반환 (TokenResponse 구조 그대로)
      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 사용자 로그인 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 로그아웃
   */
  logout: async (): Promise<void> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 로그아웃");

    try {
      await api.post("/api/v1/auth/logout");

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 로그아웃 (${(endTime - startTime).toFixed(2)}ms)`
      );
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 로그아웃 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 토큰 갱신 (쿠키 기반)
   */
  refreshToken: async (): Promise<LoginResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 토큰 갱신");

    try {
      const response = await api.post<LoginResponse>("/api/v1/auth/refresh");

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 토큰 갱신 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 토큰 갱신 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 세션 조회 (현재 로그인된 사용자 정보)
   */
  getSession: async (): Promise<SessionResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 세션 조회");

    try {
      const response = await api.get<SessionResponse>("/api/auth/me");

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 세션 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 세션 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },
};

/**
 * 역할에 따른 리다이렉트 경로 반환
 */
export const getRedirectPath = (role: UserRole): string => {
  switch (role) {
    case "admin":
      return "/admin/dashboard";
    case "company":
      return "/company/dashboard";
    case "user":
    default:
      return "/user/dashboard";
  }
};
