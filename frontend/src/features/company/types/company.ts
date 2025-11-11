/**
 * 업체 정보 타입
 */
export interface Company {
  id: string;
  name: string;
  businessNumber: string;
  representativeName: string;
  phone: string;
  email: string;
  address: string;
  detailAddress?: string;
  serviceTypes: ServiceType[];
  certificationStatus: CertificationStatus;
  certificationNumber?: string;
  businessHours: BusinessHours;
  description?: string;
  rating: number;
  reviewCount: number;
  totalInstallations: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * 서비스 타입
 */
export type ServiceType =
  | "INSTALLATION" // 설치
  | "REPAIR" // 수리
  | "INSPECTION" // 검교정
  | "MAINTENANCE" // 유지보수
  | "ALL"; // 전체

/**
 * 인증 상태
 */
export type CertificationStatus = "CERTIFIED" | "PENDING" | "EXPIRED";

/**
 * 영업 시간
 */
export interface BusinessHours {
  weekday: string;
  weekend: string;
  holiday: string;
}

/**
 * 업체 통계
 */
export interface CompanyStats {
  totalReservations: number;
  pendingReservations: number;
  completedReservations: number;
  totalCustomers: number;
  totalDevices: number;
  monthlyRevenue: number;
  averageRating: number;
}

/**
 * 업체 프로필 수정 요청
 */
export interface UpdateCompanyProfileRequest {
  phone?: string;
  email?: string;
  address?: string;
  detailAddress?: string;
  serviceTypes?: ServiceType[];
  businessHours?: BusinessHours;
  description?: string;
}

/**
 * 업체 고객 정보
 */
export interface CompanyCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  licenseNumber: string;
  licenseStatus: "정상" | "조건부";
  deviceInstalled: boolean;
  deviceSerialNumber?: string;
  installationDate?: string;
  lastServiceDate?: string;
  totalReservations: number;
  createdAt: string;
}

/**
 * 업체 장치 정보
 */
export interface CompanyDevice {
  id: string;
  serialNumber: string;
  model: string;
  manufacturer: string;
  status: DeviceStatus;
  assignedTo?: string;
  assignedToName?: string;
  installationDate?: string;
  lastInspectionDate?: string;
  nextInspectionDate?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 장치 상태 (백엔드 DeviceStatus 열거형과 일치)
 */
export type DeviceStatus = "AVAILABLE" | "INSTALLED" | "UNDER_MAINTENANCE" | "DEACTIVATED";

/**
 * 장치 등록 요청
 */
export interface RegisterDeviceRequest {
  serialNumber: string;
  model: string;
  manufacturer: string;
  purchaseDate: string;
}

/**
 * 장치 수정 요청
 */
export interface UpdateDeviceRequest {
  status?: DeviceStatus;
  assignedTo?: string;
  installationDate?: string;
  lastInspectionDate?: string;
  nextInspectionDate?: string;
}

/**
 * 장치 할당 요청
 */
export interface AssignDeviceRequest {
  customerId: string; // 고객 ID
  installationDate: string; // 설치일 (ISO 날짜)
  installationNote?: string; // 설치 메모
}

/**
 * 검사 결과 타입
 */
export type InspectionResult = "PASS" | "FAIL" | "CONDITIONAL_PASS";

/**
 * 예약 완료 요청 (서비스 타입별 필드 포함)
 */
export interface CompleteReservationRequest {
  // 공통 필드
  completedDate: string; // ISO 날짜 시간
  cost?: number; // 비용 (원)
  notes?: string; // 특이사항

  // INSTALLATION (신규 설치) 전용
  deviceSerialNumber?: string; // 장치 S/N
  modelName?: string; // 장치 모델명
  manufacturerId?: number; // 제조업체 ID
  warrantyEndDate?: string; // 보증 종료일 (ISO 날짜)

  // INSPECTION (검·교정) 전용
  inspectionResult?: InspectionResult; // 검사 결과
  nextInspectionDate?: string; // 다음 검사일 (ISO 날짜)
  deviceId?: number; // 검사 대상 장치 ID

  // REPAIR/MAINTENANCE (수리/유지보수) 전용
  workDescription?: string; // 작업 내용
  replacedParts?: string; // 교체 부품
  repairDeviceId?: number; // 수리 대상 장치 ID
}
