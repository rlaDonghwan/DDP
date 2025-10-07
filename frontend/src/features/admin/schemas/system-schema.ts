import { z } from "zod";

/**
 * 계정 생성 폼 스키마
 */
export const createAccountSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요")
      .email("올바른 이메일 형식이 아닙니다"),
    name: z
      .string()
      .min(1, "이름을 입력해주세요")
      .min(2, "이름은 최소 2자 이상이어야 합니다")
      .max(50, "이름은 최대 50자까지 입력 가능합니다"),
    password: z
      .string()
      .min(1, "비밀번호를 입력해주세요")
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/,
        "비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다"
      ),
    confirmPassword: z.string().min(1, "비밀번호 확인을 입력해주세요"),
    role: z.enum(["admin", "company", "user"], {
      errorMap: () => ({ message: "역할을 선택해주세요" }),
    }),
    phone: z
      .string()
      .regex(
        /^010-\d{4}-\d{4}$/,
        "올바른 전화번호 형식이 아닙니다 (010-0000-0000)"
      )
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

/**
 * 계정 수정 폼 스키마
 */
export const updateAccountSchema = z.object({
  name: z
    .string()
    .min(2, "이름은 최소 2자 이상이어야 합니다")
    .max(50, "이름은 최대 50자까지 입력 가능합니다")
    .optional(),
  phone: z
    .string()
    .regex(
      /^010-\d{4}-\d{4}$/,
      "올바른 전화번호 형식이 아닙니다 (010-0000-0000)"
    )
    .optional(),
  status: z
    .enum(["active", "inactive", "locked"], {
      errorMap: () => ({ message: "올바른 상태를 선택해주세요" }),
    })
    .optional(),
  password: z
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/,
      "비밀번호는 대소문자, 숫자, 특수문자를 포함해야 합니다"
    )
    .optional(),
});

/**
 * 권한 설정 폼 스키마
 */
export const savePermissionSchema = z.object({
  role: z.enum(["admin", "company", "user"], {
    errorMap: () => ({ message: "역할을 선택해주세요" }),
  }),
  menuIds: z.array(z.string()).min(1, "최소 1개 이상의 메뉴를 선택해주세요"),
});

/**
 * 공지사항 작성 폼 스키마
 */
export const createNoticeSchema = z.object({
  title: z
    .string()
    .min(1, "제목을 입력해주세요")
    .min(5, "제목은 최소 5자 이상이어야 합니다")
    .max(200, "제목은 최대 200자까지 입력 가능합니다"),
  content: z
    .string()
    .min(1, "내용을 입력해주세요")
    .min(10, "내용은 최소 10자 이상이어야 합니다"),
  isImportant: z.boolean().default(false),
  isPinned: z.boolean().default(false),
  targetRole: z.enum(["all", "admin", "company", "user"], {
    errorMap: () => ({ message: "대상 역할을 선택해주세요" }),
  }),
  publishedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "올바른 날짜시간 형식이 아닙니다")
    .nullable()
    .optional(),
});

/**
 * 공지사항 수정 폼 스키마
 */
export const updateNoticeSchema = z.object({
  title: z
    .string()
    .min(5, "제목은 최소 5자 이상이어야 합니다")
    .max(200, "제목은 최대 200자까지 입력 가능합니다")
    .optional(),
  content: z.string().min(10, "내용은 최소 10자 이상이어야 합니다").optional(),
  isImportant: z.boolean().optional(),
  isPinned: z.boolean().optional(),
  targetRole: z.enum(["all", "admin", "company", "user"]).optional(),
  publishedAt: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "올바른 날짜시간 형식이 아닙니다")
    .nullable()
    .optional(),
});

/**
 * 계정 생성 폼 타입
 */
export type CreateAccountFormData = z.infer<typeof createAccountSchema>;

/**
 * 계정 수정 폼 타입
 */
export type UpdateAccountFormData = z.infer<typeof updateAccountSchema>;

/**
 * 권한 설정 폼 타입
 */
export type SavePermissionFormData = z.infer<typeof savePermissionSchema>;

/**
 * 공지사항 작성 폼 타입
 */
export type CreateNoticeFormData = z.infer<typeof createNoticeSchema>;

/**
 * 공지사항 수정 폼 타입
 */
export type UpdateNoticeFormData = z.infer<typeof updateNoticeSchema>;
