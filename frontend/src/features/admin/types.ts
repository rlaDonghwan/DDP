// Admin 관련 타입 정의

export interface DuiSubject {
  licenseNumber: string;
  name: string;
  birthDate: string; // ISO (yyyy-MM-dd)
  address: string;
  phoneNumber: string;
  violationCount: number;
  lastViolationDate: string; // ISO
  // 프론트 전용 상태 (계정 생성됨 여부)
  accountCreated?: boolean;
}

export interface DuiSubjectListResponse {
  success: boolean;
  totalCount: number;
  subjects: DuiSubject[];
  errorMessage?: string | null;
}
