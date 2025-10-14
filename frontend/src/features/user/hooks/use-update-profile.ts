"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../api/user-api";
import type {
  UpdateProfileRequest,
  ChangePasswordRequest,
} from "../types/user";
import { toast } from "sonner";

/**
 * 사용자 프로필 수정 훅
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => userApi.updateProfile(data),
    onSuccess: (response) => {
      // 성공 시 캐시 갱신
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      toast.success(response.message || "프로필이 성공적으로 수정되었습니다");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "프로필 수정에 실패했습니다";
      toast.error(errorMessage);
    },
  });
}

/**
 * 비밀번호 변경 훅
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) => userApi.changePassword(data),
    onSuccess: (response) => {
      toast.success(
        response.message || "비밀번호가 성공적으로 변경되었습니다"
      );
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "비밀번호 변경에 실패했습니다";
      toast.error(errorMessage);
    },
  });
}
