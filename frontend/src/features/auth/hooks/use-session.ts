"use client";

import { useState, useEffect } from "react";
import { authApi } from "../api";
import { useTokenExpiry } from "./use-token-expiry";
import { hasAuthCookie } from "@/lib/utils";
import type { User } from "@/types/auth";

/**
 * 세션 관리 훅
 * 현재 로그인된 사용자 정보를 관리하고 인증 상태를 체크합니다.
 * 토큰 만료 타이머를 통합하여 자동 갱신 기능을 제공합니다.
 */
export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { startExpiryTimer, clearExpiryTimer } = useTokenExpiry();

  /**
   * 세션 조회 (백엔드에서 검증된 사용자 정보 + Role 포함)
   */
  const fetchSession = async () => {
    try {
      setIsLoading(true);

      // 백엔드 토큰 검증 API 호출 (Role 정보 포함)
      const response = await authApi.validateToken();

      if (response.success && response.userId && response.role) {
        // 역할 소문자 정규화 (백엔드가 ADMIN/Company 등 다양한 케이스를 줄 수 있음)
        const normalizedRole = String(response.role).toLowerCase();
        // 허용되지 않은 값이 온 경우 대비 fallback
        const allowedRoles = ["admin", "company", "user"] as const;
        const finalRole = (allowedRoles as readonly string[]).includes(
          normalizedRole
        )
          ? (normalizedRole as User["role"])
          : "user"; // 알 수 없는 경우 기본 user

        // 사용자 정보 설정
        const userData: User = {
          id: String(response.userId),
          email: response.email || "",
          name: response.name || "",
          role: finalRole,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        setUser(userData);
        setIsAuthenticated(true);

        // 인증 성공 시 토큰 만료 타이머 시작
        startExpiryTimer();
      } else {
        setUser(null);
        setIsAuthenticated(false);
        clearExpiryTimer();
      }
    } catch (error: any) {
      // 쿠키가 없는 경우 (로그아웃 후 등)는 조용히 처리
      const hasCookie = hasAuthCookie();
      const statusCode = error?.response?.status;

      // 400/401 에러 + 쿠키 없음 = 정상적인 비인증 상태 (에러 로그 출력 안 함)
      if (!hasCookie && (statusCode === 400 || statusCode === 401)) {
        // 조용히 처리 (콘솔 에러 출력 안 함)
      } else {
        // 그 외의 에러는 로그 출력 (실제 문제 상황)
        console.error("세션 조회 실패:", error?.message || error);
      }

      setUser(null);
      setIsAuthenticated(false);
      clearExpiryTimer();
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 로그아웃
   */
  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
      setIsAuthenticated(false);
      clearExpiryTimer();
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  // 컴포넌트 마운트 시 세션 조회
  useEffect(() => {
    fetchSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // fetchSession은 startExpiryTimer에 의존하지만, 무한 루프 방지를 위해 빈 배열 사용

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      clearExpiryTimer();
    };
  }, [clearExpiryTimer]);

  return {
    user,
    isLoading,
    isAuthenticated,
    refetchSession: fetchSession,
    logout,
  };
}
