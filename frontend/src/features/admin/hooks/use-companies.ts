"use client";

import { useState, useEffect } from "react";
import { companiesApi } from "../api/companies-api";
import type { Company, CompanyDetail } from "../types/company";
import type { CompanyFilterData } from "../schemas/company-schema";

/**
 * 업체 목록 관리 훅
 */
export function useCompanies(filters?: CompanyFilterData) {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 업체 목록 조회
   */
  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await companiesApi.getCompanies(filters);
      setCompanies(response.companies);
      setTotalCount(response.totalCount);
    } catch (err) {
      console.error("업체 목록 조회 실패:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  // 필터 변경 시 데이터 재조회
  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return {
    companies,
    totalCount,
    isLoading,
    error,
    refetch: fetchCompanies,
  };
}

/**
 * 업체 상세 정보 관리 훅
 */
export function useCompanyDetail(id: string) {
  const [company, setCompany] = useState<CompanyDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * 업체 상세 조회
   */
  const fetchCompanyDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await companiesApi.getCompanyById(id);
      setCompany(response.company);
    } catch (err) {
      console.error("업체 상세 조회 실패:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCompanyDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return {
    company,
    isLoading,
    error,
    refetch: fetchCompanyDetail,
  };
}
