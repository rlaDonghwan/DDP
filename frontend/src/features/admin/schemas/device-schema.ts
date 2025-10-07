import { z } from "zod";

/**
 * 장치 등록 폼 스키마
 */
export const createDeviceSchema = z.object({
  serialNumber: z
    .string()
    .min(1, "시리얼 번호를 입력해주세요")
    .min(5, "시리얼 번호는 최소 5자 이상이어야 합니다")
    .max(50, "시리얼 번호는 최대 50자까지 입력 가능합니다"),
  modelName: z
    .string()
    .min(1, "모델명을 입력해주세요")
    .max(100, "모델명은 최대 100자까지 입력 가능합니다"),
  manufacturer: z
    .string()
    .min(1, "제조사를 입력해주세요")
    .max(100, "제조사는 최대 100자까지 입력 가능합니다"),
  manufacturingDate: z
    .string()
    .min(1, "제조일을 입력해주세요")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "올바른 날짜 형식이 아닙니다 (yyyy-MM-dd)"),
});

/**
 * 장치 수정 폼 스키마
 */
export const updateDeviceSchema = z.object({
  status: z
    .enum(["active", "inactive", "maintenance", "error"], {
      message: "올바른 상태를 선택해주세요",
    })
    .optional(),
  assignedSubjectId: z.string().nullable().optional(),
  vehicleNumber: z
    .string()
    .regex(
      /^\d{2,3}[가-힣]\d{4}$/,
      "올바른 차량번호 형식이 아닙니다 (예: 12가1234)"
    )
    .nullable()
    .optional(),
  companyId: z.string().optional(),
});

/**
 * 장치 검색 필터 스키마
 */
export const deviceFilterSchema = z.object({
  searchQuery: z.string().optional(),
  status: z
    .enum(["active", "inactive", "maintenance", "error", "all"])
    .optional(),
  isAssigned: z.boolean().optional(),
  companyId: z.string().optional(),
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
});

/**
 * 유지보수 기록 등록 스키마
 */
export const createMaintenanceSchema = z.object({
  deviceId: z.string().min(1, "장치를 선택해주세요"),
  type: z.enum(["installation", "repair", "inspection", "replacement"], {
    errorMap: () => ({ message: "작업 유형을 선택해주세요" }),
  }),
  description: z
    .string()
    .min(1, "작업 내용을 입력해주세요")
    .min(10, "작업 내용은 최소 10자 이상이어야 합니다"),
  companyId: z.string().min(1, "담당 업체를 선택해주세요"),
  performedBy: z.string().min(1, "담당자 이름을 입력해주세요"),
  cost: z.number().min(0, "비용은 0 이상이어야 합니다").optional(),
});

/**
 * 장치 등록 폼 타입
 */
export type CreateDeviceFormData = z.infer<typeof createDeviceSchema>;

/**
 * 장치 수정 폼 타입
 */
export type UpdateDeviceFormData = z.infer<typeof updateDeviceSchema>;

/**
 * 장치 검색 필터 타입
 */
export type DeviceFilterData = z.infer<typeof deviceFilterSchema>;

/**
 * 유지보수 기록 등록 타입
 */
export type CreateMaintenanceFormData = z.infer<typeof createMaintenanceSchema>;
