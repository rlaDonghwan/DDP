/**
 * 서비스 이력 관련 커스텀 훅
 */

import { useQuery } from "@tanstack/react-query";
import { serviceRecordApi } from "../api/service-record-api";
import { useSession } from "@/features/auth/hooks/use-session";

/**
 * 업체의 서비스 이력 목록 조회 훅
 */
export function useCompanyServiceRecords() {
  const { user } = useSession();
  const companyId = user?.companyId;

  return useQuery({
    queryKey: ["company-service-records", companyId],
    queryFn: () => {
      if (!companyId) {
        throw new Error("업체 정보가 없습니다");
      }
      return serviceRecordApi.getCompanyServiceRecords(companyId);
    },
    enabled: !!companyId,
  });
}

/**
 * 서비스 이력 상세 조회 훅
 */
export function useServiceRecord(id: string | null) {
  return useQuery({
    queryKey: ["service-record", id],
    queryFn: () => {
      if (!id) {
        throw new Error("서비스 이력 ID가 없습니다");
      }
      return serviceRecordApi.getServiceRecord(id);
    },
    enabled: !!id,
  });
}

/**
 * 사용자별 서비스 이력 조회 훅
 */
export function useUserServiceRecords(subjectId: string | null) {
  return useQuery({
    queryKey: ["user-service-records", subjectId],
    queryFn: () => {
      if (!subjectId) {
        throw new Error("사용자 ID가 없습니다");
      }
      return serviceRecordApi.getUserServiceRecords(subjectId);
    },
    enabled: !!subjectId,
  });
}

/**
 * 장치별 서비스 이력 조회 훅
 */
export function useDeviceServiceRecords(deviceId: string | null) {
  return useQuery({
    queryKey: ["device-service-records", deviceId],
    queryFn: () => {
      if (!deviceId) {
        throw new Error("장치 ID가 없습니다");
      }
      return serviceRecordApi.getDeviceServiceRecords(deviceId);
    },
    enabled: !!deviceId,
  });
}
