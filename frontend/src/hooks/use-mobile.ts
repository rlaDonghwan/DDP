"use client";

import { useEffect, useState } from "react";

/**
 * 모바일 디바이스 감지 훅
 * 화면 너비가 768px 이하면 모바일로 간주 (Tailwind md 브레이크포인트)
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 미디어 쿼리: 모바일 = 768px 이하
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    // 초기값 설정
    setIsMobile(mediaQuery.matches);

    // 화면 크기 변경 감지
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    // 리스너 등록
    mediaQuery.addEventListener("change", handleChange);

    // 클린업
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return isMobile;
}