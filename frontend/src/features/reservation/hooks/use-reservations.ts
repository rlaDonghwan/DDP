"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationApi } from "../api/reservation-api";
import type {
  CreateReservationRequest,
  CancelReservationRequest,
} from "../types/reservation";
import { toast } from "sonner";

/**
 * 내 예약 목록 조회 훅
 */
export function useMyReservations(userId: string | undefined) {
  return useQuery({
    queryKey: ["myReservations", userId],
    queryFn: () => reservationApi.getMyReservations(userId!),
    enabled: !!userId, // userId가 있을 때만 쿼리 실행
    staleTime: 1000 * 60 * 2, // 2분 동안 fresh 상태 유지
    gcTime: 1000 * 60 * 5, // 5분 동안 캐시 보관
    retry: 1,
  });
}

/**
 * 예약 상세 조회 훅
 */
export function useReservation(id: string | undefined) {
  return useQuery({
    queryKey: ["reservation", id],
    queryFn: () => reservationApi.getReservation(id!),
    enabled: !!id, // id가 있을 때만 쿼리 실행
    staleTime: 1000 * 60 * 2, // 2분 동안 fresh 상태 유지
    gcTime: 1000 * 60 * 5, // 5분 동안 캐시 보관
    retry: 1,
  });
}

/**
 * 예약 생성 훅
 */
export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReservationRequest) =>
      reservationApi.createReservation(data),
    onSuccess: () => {
      // 예약 목록 캐시 무효화 (재조회)
      queryClient.invalidateQueries({ queryKey: ["myReservations"] });
      toast.success("예약이 신청되었습니다", {
        description: "업체 확인 후 예약이 확정됩니다.",
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "예약 신청에 실패했습니다";
      toast.error("예약 실패", {
        description: message,
      });
    },
  });
}

/**
 * 예약 취소 훅
 */
export function useCancelReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data?: CancelReservationRequest;
    }) => reservationApi.cancelReservation(id, data),
    onSuccess: () => {
      // 예약 목록 및 상세 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["myReservations"] });
      queryClient.invalidateQueries({ queryKey: ["reservation"] });
      toast.success("예약이 취소되었습니다");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "예약 취소에 실패했습니다";
      toast.error("취소 실패", {
        description: message,
      });
    },
  });
}

/**
 * 업체의 예약 목록 조회 훅 (업체용)
 */
export function useOperatorReservations(operatorId: string | undefined) {
  return useQuery({
    queryKey: ["operatorReservations", operatorId],
    queryFn: () => reservationApi.getOperatorReservations(operatorId!),
    enabled: !!operatorId,
    staleTime: 1000 * 60, // 1분 동안 fresh 상태 유지
    gcTime: 1000 * 60 * 3, // 3분 동안 캐시 보관
    retry: 1,
  });
}
