"use client";

import { useState } from "react";
import { useCompanies } from "@/features/admin/hooks/use-companies";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * 업체 관리 페이지
 * 시스템에 등록된 전체 설치/관리 업체를 조회하고 신규 업체를 등록/승인
 */
export default function AdminCompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { companies, totalCount, isLoading, error } = useCompanies();

  // 검색 필터링
  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.businessNumber.includes(searchQuery) ||
      company.representativeName
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // 상태 뱃지 렌더링
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="default">승인</Badge>;
      case "pending":
        return <Badge>대기</Badge>;
      case "rejected":
        return <Badge variant="destructive">반려</Badge>;
      case "suspended":
        return <Badge variant="secondary">정지</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          업체 관리
        </h1>
        <p className="text-gray-600 mt-2">
          장치 설치 및 관리 업체를 조회하고 승인 처리합니다.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              전체 업체
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              승인 완료
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {companies.filter((c) => c.status === "approved").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              승인 대기
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {companies.filter((c) => c.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              반려/정지
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {
                companies.filter(
                  (c) => c.status === "rejected" || c.status === "suspended"
                ).length
              }
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>업체 목록</CardTitle>
          <CardDescription>
            등록된 업체를 검색하고 승인 처리할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Input
              placeholder="업체명, 사업자번호, 대표자명으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Button variant="outline">필터</Button>
            <Button>새 업체 등록</Button>
          </div>

          {/* 로딩 상태 */}
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="py-10 text-center text-red-600">
              데이터를 불러오는 중 오류가 발생했습니다.
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              검색 결과가 없습니다.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>업체명</TableHead>
                    <TableHead>사업자번호</TableHead>
                    <TableHead>대표자</TableHead>
                    <TableHead>연락처</TableHead>
                    <TableHead>지역</TableHead>
                    <TableHead>관리 장치</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">
                        {company.name}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {company.businessNumber}
                      </TableCell>
                      <TableCell>{company.representativeName}</TableCell>
                      <TableCell>{company.phone}</TableCell>
                      <TableCell>{company.region}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>장치: {company.deviceCount}개</div>
                          <div className="text-gray-500">
                            고객: {company.customerCount}명
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{renderStatusBadge(company.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          상세
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
