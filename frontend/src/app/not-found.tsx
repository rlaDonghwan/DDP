"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * 404 Not Found 페이지
 * 존재하지 않는 페이지 접근 시 랜딩 페이지로 자동 리다이렉트
 */
export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // 랜딩 페이지로 자동 리다이렉트
    router.replace("/");
  }, [router]);

  // 리다이렉트 중 빈 화면 표시
  return null;
}