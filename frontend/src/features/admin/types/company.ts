/**
 * 업체 상태
 */
export type CompanyStatus = "approved" | "pending" | "rejected" | "suspended";

/**
 * 계약 상태
 */
export type ContractStatus = "active" | "pending" | "expired";

/**
 * 업체 정보
 */
export interface Company {
  id: string;
  name: string; // 업체명
  businessNumber: string; // 사업자번호
  representativeName: string; // 대표자명
  email: string;
  phone: string;
  address: string;
  region: string; // 지역 (서울, 경기 등)
  status: CompanyStatus;
  approvedAt?: string | null; // 승인일 (ISO)
  rejectedReason?: string | null; // 반려 사유
  deviceCount: number; // 관리 중인 장치 수
  customerCount: number; // 담당 고객(대상자) 수
  createdAt: string;
  updatedAt: string;
}

/**
 * 업체 상세 정보
 */
export interface CompanyDetail extends Company {
  serviceHistory: ServiceRecord[]; // 서비스 이력
  managedDevices: ManagedDevice[]; // 관리 중인 장치 목록
  customers: Customer[]; // 담당 고객 목록
}

/**
 * 서비스 이력
 */
export interface ServiceRecord {
  id: string;
  type: "installation" | "repair" | "inspection" | "replacement";
  subjectId: string;
  subjectName: string;
  deviceId: string;
  deviceSerialNumber: string;
  description: string;
  performedAt: string; // ISO 날짜시간
  performedBy: string; // 담당자 이름
  cost?: number; // 비용 (옵션)
}

/**
 * 관리 중인 장치 (업체 상세용)
 */
export interface ManagedDevice {
  id: string;
  serialNumber: string;
  modelName: string;
  status: string;
  assignedSubjectName?: string;
}

/**
 * 담당 고객 (업체 상세용)
 */
export interface Customer {
  id: string;
  name: string;
  phone: string;
  deviceSerialNumber?: string;
  lastServiceDate?: string; // ISO 날짜
}

/**
 * 업체 목록 조회 응답
 */
export interface CompanyListResponse {
  success: boolean;
  totalCount: number;
  companies: Company[];
}

/**
 * 업체 상세 조회 응답
 */
export interface CompanyDetailResponse {
  success: boolean;
  company: CompanyDetail;
}

/**
 * 업체 등록 요청
 */
export interface CreateCompanyRequest {
  name: string;
  businessNumber: string;
  representativeName: string;
  email: string;
  phone: string;
  address: string;
  region: string;
  certificationValidUntil: string; // 인증 유효 기간 (ISO 날짜)
  contractStatus: ContractStatus; // 계약 상태
  businessRegistrationNumber: string; // 사업자등록증 번호
  sealInfo: string; // 직인 정보
  initialAccountId: string; // 초기 계정 ID
  initialPassword: string; // 초기 비밀번호
}

/**
 * 업체 승인/반려 요청
 */
export interface ApproveCompanyRequest {
  companyId: string;
  status: "approved" | "rejected";
  rejectedReason?: string; // 반려 시 필수
}

/**
 * 업체 수정 요청
 */
export interface UpdateCompanyRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  region?: string;
  status?: CompanyStatus;
}
