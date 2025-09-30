import { z } from "zod";

/**
 * 로그인 폼 Zod 스키마
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),
  password: z
    .string()
    .min(1, "비밀번호를 입력해주세요")
    .min(6, "비밀번호는 최소 6자 이상이어야 합니다"),
});

/**
 * 로그인 폼 타입 (Zod 스키마에서 추론)
 */
export type LoginFormData = z.infer<typeof loginSchema>;