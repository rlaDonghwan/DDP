import api from "@/lib/axios";
import type {
  AccountListResponse,
  CreateAccountRequest,
  UpdateAccountRequest,
  PermissionResponse,
  SavePermissionRequest,
  NoticeListResponse,
  NoticeDetailResponse,
  CreateNoticeRequest,
  UpdateNoticeRequest,
} from "../types/system";

/**
 * 시스템 관리 API 함수 모음
 */
export const systemApi = {
  // ========== 계정 관리 ==========

  /**
   * 계정 목록 조회
   */
  getAccounts: async (params?: {
    searchQuery?: string;
    role?: string;
    status?: string;
    page?: number;
    pageSize?: number;
  }): Promise<AccountListResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 계정 목록 조회");

    try {
      const response = await api.get<AccountListResponse>(
        "/api/v1/admin/accounts",
        {
          params,
        }
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 계정 목록 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 계정 목록 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 계정 생성
   */
  createAccount: async (
    data: CreateAccountRequest
  ): Promise<{ success: boolean }> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 계정 생성");

    try {
      const response = await api.post<{ success: boolean }>(
        "/api/v1/admin/accounts",
        data
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 계정 생성 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 계정 생성 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 계정 수정
   */
  updateAccount: async (
    id: string,
    data: UpdateAccountRequest
  ): Promise<{ success: boolean }> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 계정 수정");

    try {
      const response = await api.put<{ success: boolean }>(
        `/api/admin/accounts/${id}`,
        data
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 계정 수정 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 계정 수정 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 계정 삭제
   */
  deleteAccount: async (id: string): Promise<{ success: boolean }> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 계정 삭제");

    try {
      const response = await api.delete<{ success: boolean }>(
        `/api/admin/accounts/${id}`
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 계정 삭제 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 계정 삭제 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  // ========== 권한 관리 ==========

  /**
   * 권한 설정 조회
   */
  getPermissions: async (): Promise<PermissionResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 권한 설정 조회");

    try {
      const response = await api.get<PermissionResponse>(
        "/api/v1/admin/permissions"
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 권한 설정 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 권한 설정 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 권한 설정 저장
   */
  savePermission: async (
    data: SavePermissionRequest
  ): Promise<{ success: boolean }> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 권한 설정 저장");

    try {
      const response = await api.post<{ success: boolean }>(
        "/api/v1/admin/permissions",
        data
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 권한 설정 저장 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 권한 설정 저장 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  // ========== 공지사항 관리 ==========

  /**
   * 공지사항 목록 조회
   */
  getNotices: async (params?: {
    searchQuery?: string;
    targetRole?: string;
    page?: number;
    pageSize?: number;
  }): Promise<NoticeListResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 공지사항 목록 조회");

    try {
      const response = await api.get<NoticeListResponse>("/api/v1/admin/notices", {
        params,
      });

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 공지사항 목록 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 공지사항 목록 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );
      throw error;
    }
  },

  /**
   * 공지사항 상세 조회
   */
  getNoticeById: async (id: string): Promise<NoticeDetailResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 공지사항 상세 조회");

    try {
      const response = await api.get<NoticeDetailResponse>(
        `/api/admin/notices/${id}`
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 공지사항 상세 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 공지사항 상세 조회 (${(endTime - startTime).toFixed(
          2
        )}ms)`
      );
      throw error;
    }
  },

  /**
   * 공지사항 작성
   */
  createNotice: async (
    data: CreateNoticeRequest
  ): Promise<{ success: boolean }> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 공지사항 작성");

    try {
      const response = await api.post<{ success: boolean }>(
        "/api/v1/admin/notices",
        data
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 공지사항 작성 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 공지사항 작성 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 공지사항 수정
   */
  updateNotice: async (
    id: string,
    data: UpdateNoticeRequest
  ): Promise<{ success: boolean }> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 공지사항 수정");

    try {
      const response = await api.put<{ success: boolean }>(
        `/api/admin/notices/${id}`,
        data
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 공지사항 수정 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 공지사항 수정 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 공지사항 삭제
   */
  deleteNotice: async (id: string): Promise<{ success: boolean }> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 공지사항 삭제");

    try {
      const response = await api.delete<{ success: boolean }>(
        `/api/admin/notices/${id}`
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 공지사항 삭제 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 공지사항 삭제 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },
};
