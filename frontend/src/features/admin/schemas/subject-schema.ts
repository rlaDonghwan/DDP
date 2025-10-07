// 2025-01-07 - 대상자 관리 Zod 스키마

import { z } from "zod";

/**
 * 면허번호 형식 검증 정규식 (12-34-567890-12 형식)
 */
const LICENSE_NUMBER_REGEX = /^\d{2}-\d{2}-\d{6}-\d{2}$/;

/**
 * 대상자 등록 폼 스키마
 */
export const createSubjectSchema = z.object({
  licenseNumber: z
    .string()
    .min(1, "면허번호를 입력해주세요")
    .regex(
      LICENSE_NUMBER_REGEX,
      "올바른 면허번호 형식이 아닙니다 (예: 12-34-567890-12)"
    ),
  name: z
    .string()
    .min(1, "이름을 입력해주세요")
    .min(2, "이름은 최소 2자 이상이어야 합니다")
    .max(50, "이름은 최대 50자까지 입력 가능합니다"),
  birthDate: z
    .string()
    .min(1, "생년월일을 입력해주세요")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "올바른 날짜 형식이 아닙니다 (yyyy-MM-dd)"),
  phone: z
    .string()
    .min(1, "전화번호를 입력해주세요")
    .regex(
      /^010-\d{4}-\d{4}$/,
      "올바른 전화번호 형식이 아닙니다 (010-0000-0000)"
    ),
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),
  address: z
    .string()
    .min(1, "주소를 입력해주세요")
    .min(5, "주소는 최소 5자 이상이어야 합니다"),
});

/**
 * 대상자 수정 폼 스키마
 */
export const updateSubjectSchema = z.object({
  phone: z
    .string()
    .regex(
      /^010-\d{4}-\d{4}$/,
      "올바른 전화번호 형식이 아닙니다 (010-0000-0000)"
    )
    .optional(),
  email: z.string().email("올바른 이메일 형식이 아닙니다").optional(),
  address: z.string().min(5, "주소는 최소 5자 이상이어야 합니다").optional(),
  status: z
    .enum(["active", "suspended", "pending", "completed"], {
      errorMap: () => ({ message: "올바른 상태를 선택해주세요" }),
    })
    .optional(),
  deviceId: z.string().nullable().optional(),
});

/**
 * 대상자 검색 필터 스키마
 */
export const subjectFilterSchema = z.object({
  searchQuery: z.string().optional(),
  status: z
    .enum(["active", "suspended", "pending", "completed", "all"])
    .optional(),
  hasDevice: z.boolean().optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
});

/**
 * 대상자 등록 폼 타입
 */
export type CreateSubjectFormData = z.infer<typeof createSubjectSchema>;

/**
 * 대상자 수정 폼 타입
 */
export type UpdateSubjectFormData = z.infer<typeof updateSubjectSchema>;

/**
 * 대상자 검색 필터 타입
 */
export type SubjectFilterData = z.infer<typeof subjectFilterSchema>;
