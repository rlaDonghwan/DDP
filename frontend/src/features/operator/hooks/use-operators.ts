"use client";

import { useQuery } from "@tanstack/react-query";
import { operatorApi } from "../api/operator-api";
import type { OperatorFilter, NearbyOperatorsRequest } from "../types/operator";

/**
 * 업체 목록 조회 훅
 */
export function useOperators(filter?: OperatorFilter) {
  return useQuery({
    queryKey: ["operators", filter],
    queryFn: () => operatorApi.getOperators(filter),
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh 상태 유지
    gcTime: 1000 * 60 * 10, // 10분 동안 캐시 보관
    retry: 1, // 실패 시 1회 재시도
  });
}

/**
 * 업체 상세 조회 훅
 */
export function useOperator(id: string | undefined) {
  return useQuery({
    queryKey: ["operator", id],
    queryFn: () => operatorApi.getOperator(id!),
    enabled: !!id, // id가 있을 때만 쿼리 실행
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh 상태 유지
    gcTime: 1000 * 60 * 10, // 10분 동안 캐시 보관
    retry: 1,
  });
}

/**
 * 주변 업체 검색 훅 (위치 기반)
 */
export function useNearbyOperators(request: NearbyOperatorsRequest | undefined) {
  return useQuery({
    queryKey: ["nearbyOperators", request],
    queryFn: () => operatorApi.getNearbyOperators(request!),
    enabled: !!request && !!request.latitude && !!request.longitude, // 위치 정보가 있을 때만 실행
    staleTime: 1000 * 60 * 2, // 2분 동안 fresh 상태 유지 (위치 기반이므로 짧게)
    gcTime: 1000 * 60 * 5, // 5분 동안 캐시 보관
    retry: 1,
  });
}

/**
 * 업체 예약 가능 일정 조회 훅
 */
export function useOperatorAvailability(operatorId: string | undefined) {
  return useQuery({
    queryKey: ["operatorAvailability", operatorId],
    queryFn: () => operatorApi.getOperatorAvailability(operatorId!),
    enabled: !!operatorId, // operatorId가 있을 때만 쿼리 실행
    staleTime: 1000 * 60, // 1분 동안 fresh 상태 유지 (예약 가능 일정은 자주 변경됨)
    gcTime: 1000 * 60 * 3, // 3분 동안 캐시 보관
    retry: 1,
  });
}
