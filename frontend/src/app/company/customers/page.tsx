"use client";

import { useCompanyCustomers } from "@/features/company/hooks/use-company";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { User, Phone, Calendar, Wrench, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { formatKoreanDate } from "@/lib/date-utils";
import { useState } from "react";

/**
 * 업체 고객 관리 페이지
 */
export default function CompanyCustomersPage() {
  const { data: customers, isLoading } = useCompanyCustomers();
  const [searchTerm, setSearchTerm] = useState("");

  /**
   * 검색 필터링
   */
  const filteredCustomers = customers?.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.licenseNumber.includes(searchTerm)
  );

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          고객 관리
        </h1>
        <p className="text-gray-600 mt-2">
          서비스를 이용한 고객 정보를 확인하고 관리합니다
        </p>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>고객 목록</CardTitle>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                총{" "}
                <span className="font-semibold">
                  {filteredCustomers?.length || 0}
                </span>
                명
              </div>
            </div>
          </div>
          <CardDescription className="mt-2">
            <Input
              type="text"
              placeholder="이름, 전화번호, 면허번호로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!filteredCustomers || filteredCustomers.length === 0 ? (
            <div className="text-center py-20">
              <User className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2">
                {searchTerm
                  ? "검색 결과가 없습니다"
                  : "등록된 고객이 없습니다"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <Card
                  key={customer.id}
                  className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <User className="h-5 w-5" />
                          {customer.name}
                          {customer.deviceInstalled ? (
                            <Badge variant="default" className="ml-2">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              장치 설치됨
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="ml-2">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              미설치
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-2 space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-4 w-4" />
                            {customer.phone}
                          </div>
                          {customer.email && (
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-4 w-4" />
                              {customer.email}
                            </div>
                          )}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          customer.licenseStatus === "정상"
                            ? "default"
                            : "secondary"
                        }
                      >
                        면허: {customer.licenseStatus}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          면허번호
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {customer.licenseNumber}
                        </p>
                      </div>
                      {customer.deviceSerialNumber && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                            <Wrench className="h-4 w-4" />
                            장치 S/N
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {customer.deviceSerialNumber}
                          </p>
                        </div>
                      )}
                      {customer.installationDate && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            설치일
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatKoreanDate(customer.installationDate)}
                          </p>
                        </div>
                      )}
                      {customer.lastServiceDate && (
                        <div>
                          <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            최근 서비스
                          </p>
                          <p className="text-sm font-semibold text-gray-900">
                            {formatKoreanDate(customer.lastServiceDate)}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        총 예약 {customer.totalReservations}건 • 가입일{" "}
                        {formatKoreanDate(customer.createdAt)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
