// 사용자 관련 타입 정의

/**
 * 사용자 프로필 정보
 */
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  licenseNumber?: string; // 마스킹된 면허번호
  deviceId?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 프로필 수정 요청
 */
export interface UpdateProfileRequest {
  phone?: string;
  address?: string;
}

/**
 * 비밀번호 변경 요청
 */
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

/**
 * 프로필 수정 응답
 */
export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  user?: UserProfile;
}

/**
 * 바로가기 메뉴 아이템
 */
export interface QuickMenuItem {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: string;
}
