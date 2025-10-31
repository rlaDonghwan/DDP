import { z } from "zod";

/**
 * 예약 취소 스키마
 */
export const cancelReservationSchema = z.object({
  reason: z
    .string()
    .max(200, "취소 사유는 200자 이내로 입력해주세요")
    .optional(),
});

export type CancelReservationInput = z.infer<typeof cancelReservationSchema>;
