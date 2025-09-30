"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * 음주운전자 계정 관리 페이지
 * Admin 역할만 접근 가능 (layout.tsx에서 권한 체크)
 */
export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: 백엔드 API 연동 필요
  const mockUsers = [
    {
      id: 1,
      name: "김철수",
      email: "kim@example.com",
      phone: "010-1234-5678",
      licenseNumber: "12-34-567890-12",
      status: "active",
      deviceId: "DV-001",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "이영희",
      email: "lee@example.com",
      phone: "010-2345-6789",
      licenseNumber: "23-45-678901-23",
      status: "active",
      deviceId: "DV-002",
      createdAt: "2024-02-20",
    },
    {
      id: 3,
      name: "박민수",
      email: "park@example.com",
      phone: "010-3456-7890",
      licenseNumber: "34-56-789012-34",
      status: "suspended",
      deviceId: null,
      createdAt: "2024-03-10",
    },
  ];

  /**
   * 상태 뱃지 렌더링
   */
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">활성</Badge>;
      case "suspended":
        return <Badge variant="destructive">정지</Badge>;
      case "pending":
        return <Badge variant="secondary">대기</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  /**
   * 검색 필터링
   */
  const filteredUsers = mockUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          음주운전자 계정 관리
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
            <div className="text-2xl font-bold">{mockUsers.length}</div>
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
              {mockUsers.filter((u) => u.status === "active").length}
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
              {mockUsers.filter((u) => u.status === "suspended").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle>계정 목록</CardTitle>
          <CardDescription>
            음주운전자 계정을 검색하고 상세 정보를 확인할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Input
              placeholder="이름, 이메일, 전화번호로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Button variant="outline">필터</Button>
            <Button>새 계정 추가</Button>
          </div>

          {/* 계정 테이블 */}
          <div className="rounded-md border">
            <Table>
              <TableCaption>
                음주운전자 계정 목록 ({filteredUsers.length}건)
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>이름</TableHead>
                  <TableHead>이메일</TableHead>
                  <TableHead>전화번호</TableHead>
                  <TableHead>면허번호</TableHead>
                  <TableHead>장치 ID</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>등록일</TableHead>
                  <TableHead className="text-right">작업</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      검색 결과가 없습니다.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {user.licenseNumber}
                      </TableCell>
                      <TableCell>
                        {user.deviceId ? (
                          <span className="font-mono text-xs">
                            {user.deviceId}
                          </span>
                        ) : (
                          <span className="text-gray-400">미할당</span>
                        )}
                      </TableCell>
                      <TableCell>{renderStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.createdAt}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          상세
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}