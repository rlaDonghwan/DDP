/**
 * 대상자 상태
 */
export type SubjectStatus = "active" | "suspended" | "pending" | "completed";

/**
 * 대상자 기본 정보
 */
export interface Subject {
  id: string;
  name: string;
  licenseNumber: string; // 면허번호 (12-34-567890-12)
  email: string;
  phone: string;
  birthDate: string; // ISO 날짜 (yyyy-MM-dd)
  address: string;
  status: SubjectStatus;
  deviceId?: string | null; // 할당된 장치 ID (옵션)
  violationCount: number; // 음주운전 위반 횟수
  lastViolationDate?: string; // 마지막 위반일 (ISO)
  installationDate?: string; // 장치 설치일 (ISO)
  createdAt: string; // 계정 생성일
  updatedAt: string; // 마지막 수정일
}

/**
 * 대상자 상세 정보 (로그 이력 포함)
 */
export interface SubjectDetail extends Subject {
  logSubmissionHistory: LogSubmission[]; // 로그 제출 이력
  deviceInfo?: DeviceInfo; // 장치 정보
  companyInfo?: CompanyInfo; // 담당 업체 정보
}

/**
 * 로그 제출 이력 항목
 */
export interface LogSubmission {
  id: string;
  submittedAt: string; // ISO 날짜시간
  vehicleNumber: string; // 차량번호
  alcoholLevel: number; // 알코올 농도 (mg/L)
  hasViolation: boolean; // 음주 감지 여부
}

/**
 * 장치 정보 (대상자 상세에서 사용)
 */
export interface DeviceInfo {
  id: string;
  serialNumber: string;
  modelName: string;
  status: "active" | "inactive" | "maintenance";
}

/**
 * 업체 정보 (대상자 상세에서 사용)
 */
export interface CompanyInfo {
  id: string;
  name: string;
  phone: string;
}

/**
 * 대상자 목록 조회 응답
 */
export interface SubjectListResponse {
  success: boolean;
  totalCount: number;
  subjects: Subject[];
}

/**
 * 대상자 상세 조회 응답
 */
export interface SubjectDetailResponse {
  success: boolean;
  subject: SubjectDetail;
}

/**
 * 대상자 등록 요청
 */
export interface CreateSubjectRequest {
  licenseNumber: string;
  name: string;
  birthDate: string;
  phone: string;
  email: string;
  address: string;
}

/**
 * 대상자 수정 요청
 */
export interface UpdateSubjectRequest {
  phone?: string;
  email?: string;
  address?: string;
  status?: SubjectStatus;
  deviceId?: string | null;
}

/**
 * 음주운전자 대상 정보 (TCS API)
 */
export interface DuiSubject {
  licenseNumber: string; // 면허번호 (99-00-901234-56)
  name: string; // 이름
  birthDate: string; // 생년월일 (yyyy-MM-dd)
  address: string; // 주소
  phoneNumber: string; // 전화번호
  violationCount: number; // 위반 횟수
  lastViolationDate: string; // 마지막 위반일 (yyyy-MM-dd)
  accountStatus: string | null; // 계정 상태
  accountCreated: boolean; // 계정 생성 여부
}

/**
 * 음주운전자 목록 조회 응답 (TCS API)
 */
export interface DuiSubjectListResponse {
  success: boolean;
  totalCount: number;
  subjects: DuiSubject[];
}
