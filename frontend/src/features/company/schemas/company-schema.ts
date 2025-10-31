import { z } from "zod";

/**
 * 업체 프로필 수정 스키마
 */
export const updateCompanyProfileSchema = z.object({
  phone: z
    .string()
    .transform((val) => val.replace(/[-\s]/g, ""))
    .pipe(
      z
        .string()
        .min(10, "전화번호는 최소 10자리 이상이어야 합니다")
        .max(11, "전화번호는 최대 11자리까지 입력 가능합니다")
        .regex(/^[0-9]+$/, "전화번호는 숫자만 입력 가능합니다")
    )
    .optional(),
  email: z.string().email("올바른 이메일 형식이 아닙니다").optional(),
  address: z.string().min(1, "주소를 입력하세요").optional(),
  detailAddress: z.string().optional(),
  serviceTypes: z.array(z.enum(["INSTALLATION", "REPAIR", "INSPECTION", "MAINTENANCE", "ALL"])).optional(),
  businessHours: z
    .object({
      weekday: z.string().min(1, "평일 영업시간을 입력하세요"),
      weekend: z.string().min(1, "주말 영업시간을 입력하세요"),
      holiday: z.string().min(1, "공휴일 영업시간을 입력하세요"),
    })
    .optional(),
  description: z.string().max(500, "소개는 최대 500자까지 입력 가능합니다").optional(),
});

export type UpdateCompanyProfileInput = z.infer<typeof updateCompanyProfileSchema>;
