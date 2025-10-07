/**
 * 운행기록 로그
 */
export interface DrivingLog {
  id: string;
  subjectId: string; // 대상자 ID
  subjectName: string; // 대상자 이름
  deviceId: string; // 장치 ID
  deviceSerialNumber: string; // 장치 S/N
  vehicleNumber: string; // 차량번호
  submittedAt: string; // 제출 일시 (ISO)
  startTime: string; // 운행 시작 시간 (ISO)
  endTime: string; // 운행 종료 시간 (ISO)
  alcoholTestResults: AlcoholTestResult[]; // 알코올 테스트 결과 목록
  hasViolation: boolean; // 음주 감지 여부
  gpsData?: GpsCoordinate[]; // GPS 위치 데이터
  createdAt: string;
}

/**
 * 알코올 테스트 결과
 */
export interface AlcoholTestResult {
  testTime: string; // 테스트 시간 (ISO)
  alcoholLevel: number; // 알코올 농도 (mg/L)
  isPassed: boolean; // 통과 여부 (0.0 기준)
  photoUrl?: string; // 인증 사진 URL (옵션)
}

/**
 * GPS 좌표
 */
export interface GpsCoordinate {
  timestamp: string; // ISO 날짜시간
  latitude: number; // 위도
  longitude: number; // 경도
  speed: number; // 속도 (km/h)
}

/**
 * 로그 상세 정보
 */
export interface DrivingLogDetail extends DrivingLog {
  subjectInfo: {
    email: string;
    phone: string;
  };
  deviceInfo: {
    modelName: string;
    status: string;
  };
}

/**
 * 로그 목록 조회 응답
 */
export interface DrivingLogListResponse {
  success: boolean;
  totalCount: number;
  logs: DrivingLog[];
}

/**
 * 로그 상세 조회 응답
 */
export interface DrivingLogDetailResponse {
  success: boolean;
  log: DrivingLogDetail;
}

/**
 * 로그 필터 옵션
 */
export interface LogFilterOptions {
  subjectId?: string; // 대상자 ID 필터
  deviceId?: string; // 장치 ID 필터
  startDate?: string; // 시작일 (ISO)
  endDate?: string; // 종료일 (ISO)
  hasViolation?: boolean; // 위반만 조회
  page?: number;
  pageSize?: number;
}

/**
 * 로그 통계
 */
export interface LogStatistics {
  totalLogs: number; // 전체 로그 수
  violationLogs: number; // 위반 로그 수
  violationRate: number; // 위반율 (%)
  avgAlcoholLevel: number; // 평균 알코올 농도
}
