import { z } from "zod";

/**
 * 예약 신청 스키마
 */
export const createReservationSchema = z.object({
  operatorId: z.string().min(1, "업체를 선택해주세요"),
  serviceType: z.enum(["INSTALL", "REPAIR", "INSPECTION"], {
    required_error: "서비스 타입을 선택해주세요",
  }),
  reservationDate: z.string().min(1, "예약 날짜를 선택해주세요"),
  reservationTime: z.string().min(1, "예약 시간을 선택해주세요"),
  notes: z.string().max(500, "요청사항은 500자 이내로 입력해주세요").optional(),
});

/**
 * 예약 취소 스키마
 */
export const cancelReservationSchema = z.object({
  reason: z
    .string()
    .max(200, "취소 사유는 200자 이내로 입력해주세요")
    .optional(),
});

export type CreateReservationInput = z.infer<typeof createReservationSchema>;
export type CancelReservationInput = z.infer<typeof cancelReservationSchema>;
