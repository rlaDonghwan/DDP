import { z } from "zod";

/**
 * 로그 업로드 스키마
 */
export const uploadLogSchema = z.object({
  deviceId: z.string().min(1, "장치를 선택해주세요"),
  recordStartDate: z.string().min(1, "기록 시작 날짜를 선택해주세요"),
  recordEndDate: z.string().min(1, "기록 종료 날짜를 선택해주세요"),
  file: z
    .instanceof(File, { message: "파일을 선택해주세요" })
    .refine((file) => file.size > 0, "파일을 선택해주세요")
    .refine(
      (file) => file.size <= 50 * 1024 * 1024, // 50MB
      "파일 크기는 50MB 이하여야 합니다"
    )
    .refine(
      (file) =>
        ["text/plain", "text/csv", "application/json"].includes(file.type) ||
        file.name.endsWith(".log") ||
        file.name.endsWith(".txt") ||
        file.name.endsWith(".csv"),
      "지원되지 않는 파일 형식입니다 (.log, .txt, .csv, .json)"
    ),
});

export type UploadLogInput = z.infer<typeof uploadLogSchema>;
