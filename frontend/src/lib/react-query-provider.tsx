"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

/**
 * React Query Provider 컴포넌트
 * 전역 상태 관리 및 서버 상태 캐싱을 제공합니다
 */
export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // QueryClient는 컴포넌트 레벨에서 생성하여 리렌더링 시 재생성 방지
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60, // 1분 동안 데이터가 fresh 상태 유지
            gcTime: 1000 * 60 * 5, // 5분 동안 캐시 보관
            retry: 1, // 실패 시 1회 재시도
            refetchOnWindowFocus: false, // 창 포커스 시 자동 갱신 비활성화
          },
          mutations: {
            retry: 0, // 뮤테이션은 재시도 하지 않음
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
