// 인증 관련 타입 정의 (통합)

/**
 * 사용자 역할
 */
export type UserRole = "admin" | "company" | "user";

/**
 * 사용자 정보
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 사용자 상세 정보 (확장)
 */
export interface UserDetails extends User {
  licenseNumber?: string;
  deviceId?: string;
  companyId?: string;
}

/**
 * 로그인 요청
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * 로그인 응답
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
}

/**
 * 세션 조회 응답
 */
export interface SessionResponse {
  authenticated: boolean;
  user?: User;
}