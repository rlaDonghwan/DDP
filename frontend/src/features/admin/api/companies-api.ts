import api from "@/lib/axios";
import type {
  CompanyListResponse,
  CompanyDetailResponse,
  CreateCompanyRequest,
  ApproveCompanyRequest,
  UpdateCompanyRequest,
} from "../types/company";

/**
 * 업체 관리 API 함수 모음
 */
export const companiesApi = {
  /**
   * 업체 목록 조회
   */
  getCompanies: async (params?: {
    searchQuery?: string;
    status?: string;
    region?: string;
    page?: number;
    pageSize?: number;
  }): Promise<CompanyListResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 업체 목록 조회");

    try {
      const response = await api.get<CompanyListResponse>(
        "/api/admin/companies",
        {
          params,
        }
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 업체 목록 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 업체 목록 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 업체 상세 조회
   */
  getCompanyById: async (id: string): Promise<CompanyDetailResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 업체 상세 조회");

    try {
      const response = await api.get<CompanyDetailResponse>(
        `/api/admin/companies/${id}`
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 업체 상세 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 업체 상세 조회 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 업체 등록
   */
  createCompany: async (
    data: CreateCompanyRequest
  ): Promise<{ success: boolean }> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 업체 등록");

    try {
      const response = await api.post<{ success: boolean }>(
        "/api/admin/companies",
        data
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 업체 등록 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 업체 등록 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 업체 승인
   */
  approveCompany: async (companyId: string): Promise<void> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 업체 승인");

    try {
      await api.post(`/api/admin/companies/${companyId}/approve`);

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 업체 승인 (${(endTime - startTime).toFixed(2)}ms)`
      );
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 업체 승인 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 업체 거절
   */
  rejectCompany: async (companyId: string, reason: string): Promise<void> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 업체 거절");

    try {
      await api.post(`/api/admin/companies/${companyId}/reject`, { reason });

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 업체 거절 (${(endTime - startTime).toFixed(2)}ms)`
      );
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 업체 거절 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 업체 수정
   */
  updateCompany: async (
    id: string,
    data: UpdateCompanyRequest
  ): Promise<{ success: boolean }> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 업체 수정");

    try {
      const response = await api.put<{ success: boolean }>(
        `/api/admin/companies/${id}`,
        data
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 업체 수정 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 업체 수정 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },

  /**
   * 업체 삭제
   */
  deleteCompany: async (id: string): Promise<{ success: boolean }> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 업체 삭제");

    try {
      const response = await api.delete<{ success: boolean }>(
        `/api/admin/companies/${id}`
      );

      const endTime = performance.now();
      console.log(
        `API 호출 완료: 업체 삭제 (${(endTime - startTime).toFixed(2)}ms)`
      );

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(
        `API 호출 실패: 업체 삭제 (${(endTime - startTime).toFixed(2)}ms)`
      );
      throw error;
    }
  },
};
