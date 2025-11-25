/**
 * 관리자 조치 API
 */

import { apiClient } from "@/lib/axios";
import type {
  AdminAction,
  CreateActionRequest,
  MarkAsReadRequest,
} from "../types/action";

export const actionApi = {
  /**
   * 조치 생성 및 실행 (관리자용)
   */
  createAction: async (data: CreateActionRequest): Promise<AdminAction> => {
    const response = await apiClient.post<AdminAction>("/api/v1/admin/actions", data);
    return response.data;
  },

  /**
   * 사용자별 조치 목록 조회 (사용자용)
   */
  getUserActions: async (userId: number): Promise<AdminAction[]> => {
    const response = await apiClient.get<AdminAction[]>(
      `/api/v1/users/${userId}/actions`
    );
    return response.data;
  },

  /**
   * 조치 확인 처리 (사용자용)
   */
  markAsRead: async (
    actionId: string,
    data: MarkAsReadRequest
  ): Promise<AdminAction> => {
    const response = await apiClient.patch<AdminAction>(
      `/api/v1/actions/${actionId}/read`,
      data
    );
    return response.data;
  },

  /**
   * 로그별 조치 목록 조회 (관리자용)
   */
  getActionsByLogId: async (logId: string): Promise<AdminAction[]> => {
    const response = await apiClient.get<AdminAction[]>(
      `/api/v1/admin/logs/${logId}/actions`
    );
    return response.data;
  },

  /**
   * 미확인 조치 목록 조회 (관리자용)
   */
  getUnreadActions: async (): Promise<AdminAction[]> => {
    const response = await apiClient.get<AdminAction[]>(
      "/api/v1/admin/actions/unread"
    );
    return response.data;
  },

  /**
   * 관리자별 조치 목록 조회 (관리자용)
   */
  getActionsByAdminId: async (adminId: number): Promise<AdminAction[]> => {
    const response = await apiClient.get<AdminAction[]>(
      `/api/v1/admin/${adminId}/actions`
    );
    return response.data;
  },
};
