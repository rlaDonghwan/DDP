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

/**
 * 사용자 현황 정보
 */
export interface UserStatus {
  deviceInstalled: boolean; // 장치 설치 여부
  deviceStatus: "normal" | "maintenance" | "warning"; // 장치 상태
  nextInspectionDate?: string; // 다음 검교정 예정일 (ISO 8601)
  lastLogSubmitDate?: string; // 최근 로그 제출일 (ISO 8601)
  totalLogSubmits: number; // 총 로그 제출 횟수
  pendingNotifications: number; // 미확인 알림 수
}

/**
 * 알림 타입
 */
export type NotificationType = "inspection" | "log_submit" | "system" | "warning";

/**
 * 알림 정보
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean; // 읽음 여부
  createdAt: string; // ISO 8601
}

/**
 * 공지사항 정보
 */
export interface Announcement {
  id: string;
  title: string;
  content: string;
  important: boolean; // 중요 공지 여부
  createdAt: string; // ISO 8601
  author: string; // 작성자 (관리자)
}
