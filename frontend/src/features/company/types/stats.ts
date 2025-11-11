/**
 * 업체 통계 관련 타입 정의
 */

/**
 * 업체 통계 정보
 */
export interface CompanyStats {
  // 총 서비스 건수
  totalServiceCount: number;

  // 서비스 타입별 건수
  installationCount: number;
  inspectionCount: number;
  repairCount: number;
  maintenanceCount: number;

  // 총 매출
  totalRevenue: number;

  // 이번 달 서비스 건수
  thisMonthServiceCount: number;

  // 이번 달 매출
  thisMonthRevenue: number;

  // 평균 서비스 비용
  averageServiceCost: number;
}
