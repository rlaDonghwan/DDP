import { z } from "zod";

/**
 * 사업자번호 형식 검증 정규식 (123-45-67890 형식)
 */
const BUSINESS_NUMBER_REGEX = /^\d{3}-\d{2}-\d{5}$/;

/**
 * 업체 등록 폼 스키마
 */
export const createCompanySchema = z.object({
  name: z
    .string()
    .min(1, "업체명을 입력해주세요")
    .min(2, "업체명은 최소 2자 이상이어야 합니다")
    .max(100, "업체명은 최대 100자까지 입력 가능합니다"),
  businessNumber: z
    .string()
    .min(1, "사업자번호를 입력해주세요")
    .regex(
      BUSINESS_NUMBER_REGEX,
      "올바른 사업자번호 형식이 아닙니다 (예: 123-45-67890)"
    ),
  representativeName: z
    .string()
    .min(1, "대표자명을 입력해주세요")
    .min(2, "대표자명은 최소 2자 이상이어야 합니다")
    .max(50, "대표자명은 최대 50자까지 입력 가능합니다"),
  email: z
    .string()
    .min(1, "이메일을 입력해주세요")
    .email("올바른 이메일 형식이 아닙니다"),
  phone: z
    .string()
    .min(1, "전화번호를 입력해주세요")
    .regex(
      /^0\d{1,2}-\d{3,4}-\d{4}$/,
      "올바른 전화번호 형식이 아닙니다 (예: 02-1234-5678 또는 010-1234-5678)"
    ),
  address: z
    .string()
    .min(1, "주소를 입력해주세요")
    .min(5, "주소는 최소 5자 이상이어야 합니다"),
  region: z
    .string()
    .min(1, "지역을 선택해주세요")
    .max(50, "지역은 최대 50자까지 입력 가능합니다"),
});

/**
 * 업체 승인/반려 폼 스키마
 */
export const approveCompanySchema = z
  .object({
    companyId: z.string().min(1, "업체를 선택해주세요"),
    status: z.enum(["approved", "rejected"], {
      message: "승인 또는 반려를 선택해주세요",
    }),
    rejectedReason: z.string().optional(),
  })
  .refine(
    (data) => {
      // 반려 시 사유 필수
      if (data.status === "rejected" && !data.rejectedReason) {
        return false;
      }
      return true;
    },
    {
      message: "반려 사유를 입력해주세요",
      path: ["rejectedReason"],
    }
  );

/**
 * 업체 수정 폼 스키마
 */
export const updateCompanySchema = z.object({
  name: z
    .string()
    .min(2, "업체명은 최소 2자 이상이어야 합니다")
    .max(100, "업체명은 최대 100자까지 입력 가능합니다")
    .optional(),
  email: z.string().email("올바른 이메일 형식이 아닙니다").optional(),
  phone: z
    .string()
    .regex(
      /^0\d{1,2}-\d{3,4}-\d{4}$/,
      "올바른 전화번호 형식이 아닙니다 (예: 02-1234-5678 또는 010-1234-5678)"
    )
    .optional(),
  address: z.string().min(5, "주소는 최소 5자 이상이어야 합니다").optional(),
  region: z.string().max(50, "지역은 최대 50자까지 입력 가능합니다").optional(),
  status: z
    .enum(["approved", "pending", "rejected", "suspended"], {
      message: "올바른 상태를 선택해주세요",
    })
    .optional(),
});

/**
 * 업체 검색 필터 스키마
 */
export const companyFilterSchema = z.object({
  searchQuery: z.string().optional(),
  status: z
    .enum(["approved", "pending", "rejected", "suspended", "all"])
    .optional(),
  region: z.string().optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
});

/**
 * 업체 등록 폼 타입
 */
export type CreateCompanyFormData = z.infer<typeof createCompanySchema>;

/**
 * 업체 승인/반려 폼 타입
 */
export type ApproveCompanyFormData = z.infer<typeof approveCompanySchema>;

/**
 * 업체 수정 폼 타입
 */
export type UpdateCompanyFormData = z.infer<typeof updateCompanySchema>;

/**
 * 업체 검색 필터 타입
 */
export type CompanyFilterData = z.infer<typeof companyFilterSchema>;
