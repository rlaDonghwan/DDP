"use client";

import { useState, useEffect } from "react";
import { authApi } from "../api";
import type { User } from "@/types/auth";

/**
 * 세션 관리 훅
 * 현재 로그인된 사용자 정보를 관리하고 인증 상태를 체크합니다.
 */
export function useSession() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  /**
   * 세션 조회
   */
  const fetchSession = async () => {
    try {
      setIsLoading(true);
      const response = await authApi.getSession();

      if (response.authenticated && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
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
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  // 컴포넌트 마운트 시 세션 조회
  useEffect(() => {
    fetchSession();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated,
    refetchSession: fetchSession,
    logout,
  };
}