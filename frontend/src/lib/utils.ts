import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 클라이언트 측에서 특정 쿠키의 존재 여부를 확인
 * @param name 쿠키 이름
 * @returns 쿠키가 존재하면 true, 아니면 false
 */
export function hasCookie(name: string): boolean {
  if (typeof document === "undefined") {
    return false; // 서버 사이드에서는 false 반환
  }
  const cookies = document.cookie.split("; ");
  return cookies.some((cookie) => cookie.startsWith(`${name}=`));
}

/**
 * 인증 토큰(jwt 또는 refreshToken) 쿠키가 존재하는지 확인
 * @returns 인증 토큰이 하나라도 있으면 true
 */
export function hasAuthCookie(): boolean {
  return hasCookie("jwt") || hasCookie("refreshToken");
}
