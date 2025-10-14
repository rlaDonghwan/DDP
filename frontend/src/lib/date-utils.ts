import { differenceInDays, format } from "date-fns";
import { ko } from "date-fns/locale";

/**
 * D-day 계산 함수
 * @param targetDate - 목표 날짜 (ISO 8601 형식)
 * @returns D-day 문자열 (예: "D-7", "D-Day", "D+3")
 */
export function calculateDday(targetDate: string | undefined): string {
  if (!targetDate) return "정보 없음";

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(targetDate);
    target.setHours(0, 0, 0, 0);

    const diff = differenceInDays(target, today);

    if (diff === 0) return "D-Day";
    if (diff > 0) return `D-${diff}`;
    return `D+${Math.abs(diff)}`;
  } catch {
    return "날짜 오류";
  }
}

/**
 * 날짜 포맷팅 함수 (한국어)
 * @param dateString - ISO 8601 형식 날짜 문자열
 * @param formatString - date-fns 포맷 문자열 (기본: "yyyy년 MM월 dd일")
 * @returns 포맷된 날짜 문자열
 */
export function formatKoreanDate(
  dateString: string | undefined,
  formatString: string = "yyyy년 MM월 dd일"
): string {
  if (!dateString) return "정보 없음";

  try {
    return format(new Date(dateString), formatString, { locale: ko });
  } catch {
    return "날짜 오류";
  }
}

/**
 * D-day와 날짜를 함께 표시하는 함수
 * @param dateString - ISO 8601 형식 날짜 문자열
 * @returns "D-7 (2025-10-21)" 형식의 문자열
 */
export function formatDdayWithDate(dateString: string | undefined): string {
  if (!dateString) return "정보 없음";

  const dday = calculateDday(dateString);
  const formattedDate = formatKoreanDate(dateString, "yyyy-MM-dd");

  if (dday === "날짜 오류" || formattedDate === "날짜 오류") {
    return "날짜 오류";
  }

  return `${dday} (${formattedDate})`;
}

/**
 * D-day 배지 색상 반환
 * @param dateString - ISO 8601 형식 날짜 문자열
 * @param urgentDays - 긴급 표시할 일수 (기본: 7일)
 * @returns "urgent" | "warning" | "normal" | "expired"
 */
export function getDdayVariant(
  dateString: string | undefined,
  urgentDays: number = 7
): "urgent" | "warning" | "normal" | "expired" {
  if (!dateString) return "normal";

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const target = new Date(dateString);
    target.setHours(0, 0, 0, 0);

    const diff = differenceInDays(target, today);

    if (diff < 0) return "expired"; // 기한 지남
    if (diff === 0) return "urgent"; // D-Day
    if (diff <= urgentDays) return "urgent"; // 긴급 (7일 이내)
    if (diff <= urgentDays * 2) return "warning"; // 주의 (14일 이내)
    return "normal"; // 정상
  } catch {
    return "normal";
  }
}
