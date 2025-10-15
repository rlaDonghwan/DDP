import api from "@/lib/axios";
import type {
  LoginRequest,
  LoginResponse,
  SessionResponse,
  UserRole,
  SmsVerificationResponse,
  CompleteRegistrationResponse,
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

      // 백엔드 응답 역할 문자열 정규화 (ADMIN/Company/User 등 대문자 변 variation 대응)
      const normalized = { ...response.data } as LoginResponse & {
        normalizedRole?: string;
      };
      if (normalized.role) {
        normalized.normalizedRole = normalized.role.toLowerCase();
      }
      return normalized;
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
   * 토큰 검증 (백엔드에서 Role 정보 포함하여 반환)
   */
  validateToken: async (): Promise<LoginResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 토큰 검증");

    try {
      const response = await api.post<LoginResponse>("/api/v1/auth/validate");

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 토큰 검증 (${(endTime - startTime).toFixed(2)}ms)`
      );

      // 응답 역할 정규화 (login과 동일한 패턴 유지)
      const normalized = { ...response.data } as LoginResponse & {
        normalizedRole?: string;
      };
      if (normalized.role) {
        normalized.normalizedRole = normalized.role.toLowerCase();
      }
      return normalized;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 토큰 검증 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * SMS 인증번호 전송
   */
  sendVerificationCode: async (
    phone: string
  ): Promise<SmsVerificationResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: SMS 인증번호 전송");

    try {
      const response = await api.post<SmsVerificationResponse>(
        "/api/v1/users/registration/send-sms",
        { phone }
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: SMS 인증번호 전송 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: SMS 인증번호 전송 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );
      throw error;
    }
  },

  /**
   * SMS 인증번호 확인
   */
  verifyCode: async (
    phone: string,
    verificationCode: string
  ): Promise<SmsVerificationResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: SMS 인증번호 확인");

    try {
      const response = await api.post<SmsVerificationResponse>(
        "/api/v1/users/registration/verify-sms",
        {
          phone,
          verificationCode,
        }
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: SMS 인증번호 확인 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: SMS 인증번호 확인 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );
      throw error;
    }
  },

  /**
   * 면허번호 TCS 검증
   */
  verifyLicense: async (licenseNumber: string): Promise<void> => {
    const startTime = performance.now();
    console.log("API 호출 시작: TCS 면허번호 검증");

    try {
      await api.post("/api/v1/tcs/license/verify", {
        licenseNumber,
      });

      const endTime = performance.now();
      console.log(
        `API 호출 완료: TCS 면허번호 검증 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: TCS 면허번호 검증 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );
      throw error;
    }
  },

  /**
   * 회원가입 완료 (이메일/비밀번호 설정 및 계정 활성화)
   */
  completeRegistration: async (
    verificationToken: string,
    email: string,
    password: string
  ): Promise<CompleteRegistrationResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 회원가입 완료");

    try {
      const response = await api.post<CompleteRegistrationResponse>(
        "/api/v1/users/registration/complete",
        {
          verificationToken,
          email,
          password,
        }
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 회원가입 완료 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 회원가입 완료 (${(endTime - startTime).toFixed(2)}ms)`
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
      return "/admin/dashboard"; // 관리자 대시보드로 이동
    case "company":
      return "/company/dashboard";
    case "user":
    default:
      return "/user";
  }
};
