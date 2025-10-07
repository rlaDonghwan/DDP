"use client";

import { useState } from "react";
import { useSubjects } from "@/features/admin/hooks/use-subjects";
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
 * 대상자 관리 페이지
 * 음주운전 방지장치 부착 대상자를 조회, 등록, 수정, 삭제
 */
export default function AdminSubjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { subjects, totalCount, isLoading, error } = useSubjects();

  // 검색 필터링
  const filteredSubjects = subjects.filter(
    (subject) =>
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.phone.includes(searchQuery) ||
      subject.licenseNumber.includes(searchQuery)
  );

  // 상태 뱃지 렌더링
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">활성</Badge>;
      case "suspended":
        return <Badge variant="destructive">정지</Badge>;
      case "pending":
        return <Badge variant="secondary">대기</Badge>;
      case "completed":
        return <Badge>완료</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          대상자 관리
        </h1>
        <p className="text-gray-600 mt-2">
          조건부 면허 대상자 계정을 조회하고 관리합니다.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              전체 계정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              활성 계정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {subjects.filter((s) => s.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              정지 계정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {subjects.filter((s) => s.status === "suspended").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>대상자 목록</CardTitle>
          <CardDescription>
            대상자 계정을 검색하고 상세 정보를 확인할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Input
              placeholder="이름, 이메일, 전화번호, 면허번호로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Button variant="outline">필터</Button>
            <Button>새 대상자 추가</Button>
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
          ) : filteredSubjects.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              검색 결과가 없습니다.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>이름</TableHead>
                    <TableHead>면허번호</TableHead>
                    <TableHead>이메일</TableHead>
                    <TableHead>전화번호</TableHead>
                    <TableHead>장치 ID</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>위반 횟수</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell className="font-medium">
                        {subject.name}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {subject.licenseNumber}
                      </TableCell>
                      <TableCell>{subject.email}</TableCell>
                      <TableCell>{subject.phone}</TableCell>
                      <TableCell>
                        {subject.deviceId ? (
                          <span className="font-mono text-xs">
                            {subject.deviceId}
                          </span>
                        ) : (
                          <span className="text-gray-400">미할당</span>
                        )}
                      </TableCell>
                      <TableCell>{renderStatusBadge(subject.status)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            subject.violationCount >= 3
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {subject.violationCount}
                        </Badge>
                      </TableCell>
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
