/**
 * 장치 상태
 */
export type DeviceStatus = "active" | "inactive" | "maintenance" | "error";

/**
 * 장치 정보
 */
export interface Device {
  id: string;
  serialNumber: string; // S/N (시리얼 번호)
  modelName: string; // 모델명
  manufacturer: string; // 제조사
  manufacturingDate: string; // 제조일 (ISO)
  status: DeviceStatus;
  assignedSubjectId?: string | null; // 할당된 대상자 ID
  assignedSubjectName?: string | null; // 할당된 대상자 이름
  vehicleNumber?: string | null; // 장착된 차량 번호
  installationDate?: string | null; // 설치일 (ISO)
  lastCheckDate?: string; // 마지막 점검일 (ISO)
  companyId?: string; // 담당 업체 ID
  companyName?: string; // 담당 업체명
  createdAt: string;
  updatedAt: string;
}

/**
 * 장치 상세 정보
 */
export interface DeviceDetail extends Device {
  maintenanceHistory: MaintenanceRecord[]; // 유지보수 이력
  errorLogs: DeviceErrorLog[]; // 장치 오류 로그
}

/**
 * 유지보수 이력
 */
export interface MaintenanceRecord {
  id: string;
  deviceId: string;
  type: "installation" | "repair" | "inspection" | "replacement";
  description: string;
  companyId: string;
  companyName: string;
  performedAt: string; // ISO 날짜시간
  performedBy: string; // 담당자 이름
}

/**
 * 장치 오류 로그
 */
export interface DeviceErrorLog {
  id: string;
  deviceId: string;
  errorCode: string;
  errorMessage: string;
  severity: "low" | "medium" | "high" | "critical";
  occurredAt: string; // ISO 날짜시간
  resolvedAt?: string | null; // 해결 시간 (ISO)
}

/**
 * 장치 목록 조회 응답
 */
export interface DeviceListResponse {
  success: boolean;
  totalCount: number;
  devices: Device[];
}

/**
 * 장치 상세 조회 응답
 */
export interface DeviceDetailResponse {
  success: boolean;
  device: DeviceDetail;
}

/**
 * 장치 등록 요청
 */
export interface CreateDeviceRequest {
  serialNumber: string;
  modelName: string;
  manufacturer: string;
  manufacturingDate: string;
}

/**
 * 장치 수정 요청
 */
export interface UpdateDeviceRequest {
  status?: DeviceStatus;
  assignedSubjectId?: string | null;
  vehicleNumber?: string | null;
  companyId?: string;
}
