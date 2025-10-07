/**
 * 계정 역할
 */
export type AccountRole = "admin" | "company" | "user";

/**
 * 계정 상태
 */
export type AccountStatus = "active" | "inactive" | "locked";

/**
 * 시스템 계정 정보
 */
export interface SystemAccount {
  id: string;
  email: string;
  name: string;
  role: AccountRole;
  status: AccountStatus;
  phone?: string;
  lastLoginAt?: string | null; // 마지막 로그인 (ISO)
  createdAt: string;
  updatedAt: string;
}

/**
 * 계정 목록 조회 응답
 */
export interface AccountListResponse {
  success: boolean;
  totalCount: number;
  accounts: SystemAccount[];
}

/**
 * 계정 생성 요청
 */
export interface CreateAccountRequest {
  email: string;
  name: string;
  password: string;
  role: AccountRole;
  phone?: string;
}

/**
 * 계정 수정 요청
 */
export interface UpdateAccountRequest {
  name?: string;
  phone?: string;
  status?: AccountStatus;
  password?: string; // 비밀번호 변경 시
}

/**
 * 메뉴 항목
 */
export interface MenuItem {
  id: string;
  name: string; // 메뉴명
  path: string; // 경로
  parentId?: string | null; // 상위 메뉴 ID
  order: number; // 정렬 순서
}

/**
 * 역할별 권한 설정
 */
export interface RolePermission {
  role: AccountRole;
  menuIds: string[]; // 접근 가능한 메뉴 ID 목록
}

/**
 * 권한 설정 조회 응답
 */
export interface PermissionResponse {
  success: boolean;
  menus: MenuItem[]; // 전체 메뉴 목록
  permissions: RolePermission[]; // 역할별 권한
}

/**
 * 권한 설정 저장 요청
 */
export interface SavePermissionRequest {
  role: AccountRole;
  menuIds: string[];
}

/**
 * 공지사항
 */
export interface Notice {
  id: string;
  title: string;
  content: string; // 마크다운 또는 HTML
  authorId: string;
  authorName: string;
  isImportant: boolean; // 중요 공지 여부
  isPinned: boolean; // 상단 고정 여부
  targetRole?: AccountRole | "all"; // 대상 역할 (all, admin, company, user)
  viewCount: number; // 조회수
  publishedAt?: string | null; // 게시일 (ISO, null이면 미게시)
  createdAt: string;
  updatedAt: string;
}

/**
 * 공지사항 목록 조회 응답
 */
export interface NoticeListResponse {
  success: boolean;
  totalCount: number;
  notices: Notice[];
}

/**
 * 공지사항 상세 조회 응답
 */
export interface NoticeDetailResponse {
  success: boolean;
  notice: Notice;
}

/**
 * 공지사항 생성 요청
 */
export interface CreateNoticeRequest {
  title: string;
  content: string;
  isImportant: boolean;
  isPinned: boolean;
  targetRole: AccountRole | "all";
  publishedAt?: string | null; // 즉시 게시 또는 예약
}

/**
 * 공지사항 수정 요청
 */
export interface UpdateNoticeRequest {
  title?: string;
  content?: string;
  isImportant?: boolean;
  isPinned?: boolean;
  targetRole?: AccountRole | "all";
  publishedAt?: string | null;
}
