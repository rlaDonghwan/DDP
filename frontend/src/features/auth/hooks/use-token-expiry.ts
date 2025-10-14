"use client";

import { useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { authApi } from "../api";
import { useRouter } from "next/navigation";

/**
 * 토큰 만료 타이머 관리 훅
 * Access Token 만료 1분 전에 Sonner 알림을 표시하고 사용자에게 연장 선택권 제공
 */
export function useTokenExpiry() {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const toastIdRef = useRef<string | number | null>(null);
  const userActionTakenRef = useRef<boolean>(false); // 사용자가 버튼을 눌렀는지 추적

  /**
   * 로그아웃 처리
   */
  const handleLogout = useCallback(async () => {
    try {
      await authApi.logout();
      toast.info("로그아웃되었습니다");
      router.push("/login");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      router.push("/login");
    }
  }, [router]);

  /**
   * 토큰 갱신 처리
   * (handleLogout을 참조하므로 그 다음에 정의)
   */
  const handleRefreshToken = useCallback(async () => {
    // 사용자 액션 플래그 설정
    userActionTakenRef.current = true;

    // 토스트 먼저 닫기 (onAutoClose 실행 방지)
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }

    try {
      await authApi.refreshToken();
      toast.success("로그인 시간이 연장되었습니다", {
        description: "30분 동안 계속 이용하실 수 있습니다.",
      });
      // 타이머 재시작 (순환 참조 방지를 위해 직접 구현)
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      const EXPIRY_WARNING_TIME = 29 * 60 * 1000;
      timerRef.current = setTimeout(() => {
        showExpiryWarning();
      }, EXPIRY_WARNING_TIME);
      console.log("토큰 갱신 완료: 29분 후 알림 표시 예정");

      // 플래그 초기화
      userActionTakenRef.current = false;
    } catch (error) {
      console.error("토큰 갱신 실패:", error);
      toast.error("로그인 연장 실패", {
        description: "다시 로그인해주세요.",
      });
      userActionTakenRef.current = false;
      await handleLogout();
    }
  }, [handleLogout]);

  /**
   * 로그아웃 버튼 클릭 핸들러
   */
  const handleLogoutClick = useCallback(() => {
    // 사용자 액션 플래그 설정
    userActionTakenRef.current = true;

    // 토스트 먼저 닫기
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }

    // 로그아웃 실행
    handleLogout();
    userActionTakenRef.current = false;
  }, [handleLogout]);

  /**
   * 만료 알림 표시 (만료 1분 전)
   * (handleRefreshToken, handleLogout을 참조하므로 그 다음에 정의)
   */
  const showExpiryWarning = useCallback(() => {
    // 플래그 초기화 (새로운 경고 표시 시작)
    userActionTakenRef.current = false;

    // 이미 표시된 Toast가 있으면 제거
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
    }

    toastIdRef.current = toast.warning("로그인 시간이 곧 만료됩니다", {
      description: "로그인을 연장하시겠습니까?",
      duration: 10000, // 10초간 표시
      action: {
        label: "연장",
        onClick: handleRefreshToken,
      },
      cancel: {
        label: "로그아웃",
        onClick: handleLogoutClick,
      },
      onAutoClose: () => {
        // 10초 후 자동으로 닫힐 때만 로그아웃 처리
        // 사용자가 버튼을 눌렀으면 로그아웃하지 않음
        if (!userActionTakenRef.current) {
          handleLogout();
        }
      },
    });
  }, [handleRefreshToken, handleLogout, handleLogoutClick]);

  /**
   * 만료 타이머 시작 함수 (내부용)
   * (showExpiryWarning을 참조하므로 그 다음에 정의)
   */
  const startTimerInternal = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    const EXPIRY_WARNING_TIME = 29 * 60 * 1000;
    timerRef.current = setTimeout(() => {
      showExpiryWarning();
    }, EXPIRY_WARNING_TIME);
    console.log("토큰 만료 타이머 시작: 29분 후 알림 표시 예정");
  }, [showExpiryWarning]);

  /**
   * 만료 타이머 시작 (외부 노출용)
   * Access Token 유효 시간: 30분 (1800초)
   * 알림 표시 시점: 만료 1분 전 (29분 후)
   */
  const startExpiryTimer = useCallback(() => {
    startTimerInternal();
  }, [startTimerInternal]);

  /**
   * 타이머 정리
   */
  const clearExpiryTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (toastIdRef.current) {
      toast.dismiss(toastIdRef.current);
      toastIdRef.current = null;
    }
  }, []);

  /**
   * 컴포넌트 언마운트 시 타이머 정리
   */
  useEffect(() => {
    return () => {
      clearExpiryTimer();
    };
  }, [clearExpiryTimer]);

  return {
    startExpiryTimer,
    clearExpiryTimer,
    handleRefreshToken,
  };
}
