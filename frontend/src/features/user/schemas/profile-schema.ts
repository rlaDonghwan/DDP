import { z } from "zod";

/**
 * 프로필 수정 스키마
 */
export const updateProfileSchema = z.object({
  phone: z
    .string()
    .min(10, "전화번호는 최소 10자 이상이어야 합니다")
    .max(11, "전화번호는 최대 11자까지 입력 가능합니다")
    .regex(/^[0-9]+$/, "전화번호는 숫자만 입력 가능합니다")
    .optional(),
  address: z
    .string()
    .min(5, "주소는 최소 5자 이상이어야 합니다")
    .max(200, "주소는 최대 200자까지 입력 가능합니다")
    .optional(),
});

/**
 * 비밀번호 변경 스키마
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "현재 비밀번호를 입력해주세요"),
    newPassword: z
      .string()
      .min(8, "새 비밀번호는 최소 8자 이상이어야 합니다")
      .max(20, "새 비밀번호는 최대 20자까지 입력 가능합니다")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다"
      ),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "새 비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
