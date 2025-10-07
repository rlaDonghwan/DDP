
/**
 * 대시보드 통계 요약
 */
export interface DashboardStats {
  totalSubjects: number; // 전체 대상자 수
  deviceInstallRate: number; // 장치 설치율 (%)
  todayLogs: number; // 금일 로그 제출 수
  pendingAlerts: number; // 미처리 알림 수
}

/**
 * 로그 제출 추이 데이터 (차트용)
 */
export interface LogTrendData {
  date: string; // ISO 날짜 (yyyy-MM-dd)
  count: number; // 로그 제출 수
  alertCount: number; // 알코올 감지 이벤트 수
}

/**
 * 지역별 분포 데이터
 */
export interface RegionDistribution {
  region: string; // 지역명 (서울, 경기 등)
  subjectCount: number; // 대상자 수
  companyCount: number; // 업체 수
  deviceCount: number; // 장치 수
}

/**
 * 시스템 알림 항목
 */
export interface SystemAlert {
  id: string;
  type: "warning" | "error" | "info"; // 알림 유형
  title: string; // 알림 제목
  message: string; // 알림 내용
  subjectId?: string; // 관련 대상자 ID (옵션)
  deviceId?: string; // 관련 장치 ID (옵션)
  createdAt: string; // ISO 날짜시간
  isRead: boolean; // 읽음 여부
}

/**
 * 대시보드 전체 응답
 */
export interface DashboardResponse {
  success: boolean;
  stats: DashboardStats;
  logTrend: LogTrendData[]; // 최근 30일 추이
  regionDistribution: RegionDistribution[];
  recentAlerts: SystemAlert[]; // 최근 10개 알림
}
