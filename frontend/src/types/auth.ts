// 인증 관련 타입 정의 (통합)

/**
 * 사용자 역할
 * NOTE: 모든 로직(미들웨어/훅/가드)에서 role은 소문자("admin" | "company" | "user")로 다룹니다.
 * 백엔드에서 ADMIN / Admin / COMPANY 등 다양한 케이스가 올 수 있으므로
 * 최초 수신 지점(login, validateToken, useSession)에서 반드시 toLowerCase() 후 이 타입에 맞춥니다.
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
  companyId?: number; // 업체 사용자인 경우 업체 ID
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
 * 로그인 응답 (백엔드 TokenResponse 구조)
 */
export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  refreshExpiresIn?: number;
  userId?: number;
  email?: string;
  name?: string;
  role?: string;
  companyId?: number; // 업체 사용자인 경우 업체 ID
}

/**
 * 세션 조회 응답
 */
export interface SessionResponse {
  authenticated: boolean;
  user?: User;
}

/**
 * SMS 인증 응답
 */
export interface SmsVerificationResponse {
  success: boolean;
  message: string;
  expiresIn?: number; // 만료 시간 (초)
  verificationToken?: string; // 인증 완료 시 토큰
  name?: string; // 사용자 이름 (인증 완료 시)
  licenseNumber?: string; // 마스킹된 면허번호 (인증 완료 시)
}

/**
 * 회원가입 완료 응답
 */
export interface CompleteRegistrationResponse {
  success: boolean;
  message: string;
  userId?: number;
  email?: string;
  name?: string;
}
