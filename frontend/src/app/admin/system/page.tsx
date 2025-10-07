"use client";

import { useState } from "react";
import { useAccounts, useNotices } from "@/features/admin/hooks/use-system";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * 시스템 관리 페이지
 * 계정 관리, 권한 관리, 공지사항 관리를 탭으로 구분하여 제공
 */
export default function AdminSystemPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const {
    accounts,
    totalCount: accountCount,
    isLoading: accountLoading,
  } = useAccounts();
  const {
    notices,
    totalCount: noticeCount,
    isLoading: noticeLoading,
  } = useNotices();

  // 계정 검색 필터링
  const filteredAccounts = accounts.filter(
    (account) =>
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 공지사항 검색 필터링
  const filteredNotices = notices.filter((notice) =>
    notice.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 상태 뱃지 렌더링
  const renderAccountStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">활성</Badge>;
      case "inactive":
        return <Badge variant="secondary">비활성</Badge>;
      case "locked":
        return <Badge variant="destructive">잠김</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge variant="destructive">관리자</Badge>;
      case "company":
        return <Badge>업체</Badge>;
      case "user":
        return <Badge variant="secondary">사용자</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          시스템 관리
        </h1>
        <p className="text-gray-600 mt-2">계정, 권한, 공지사항을 관리합니다.</p>
      </div>

      {/* 탭 구조 */}
      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">계정 관리</TabsTrigger>
          <TabsTrigger value="permissions">권한 관리</TabsTrigger>
          <TabsTrigger value="notices">공지사항</TabsTrigger>
        </TabsList>

        {/* 계정 관리 탭 */}
        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>계정 목록</CardTitle>
              <CardDescription>
                시스템 사용자 계정을 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-2">
                <Input
                  placeholder="이름, 이메일로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
                <Button variant="outline">필터</Button>
                <Button>새 계정 생성</Button>
              </div>

              {accountLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>이름</TableHead>
                        <TableHead>이메일</TableHead>
                        <TableHead>역할</TableHead>
                        <TableHead>상태</TableHead>
                        <TableHead>최근 로그인</TableHead>
                        <TableHead className="text-right">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAccounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell className="font-medium">
                            {account.name}
                          </TableCell>
                          <TableCell>{account.email}</TableCell>
                          <TableCell>{renderRoleBadge(account.role)}</TableCell>
                          <TableCell>
                            {renderAccountStatusBadge(account.status)}
                          </TableCell>
                          <TableCell className="text-xs">
                            {account.lastLoginAt
                              ? new Date(account.lastLoginAt).toLocaleString(
                                  "ko-KR"
                                )
                              : "-"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              수정
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
        </TabsContent>

        {/* 권한 관리 탭 */}
        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>역할별 메뉴 접근 권한</CardTitle>
              <CardDescription>
                역할별로 접근 가능한 메뉴를 설정합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-10 text-center text-gray-500">
                권한 매트릭스 UI가 여기에 표시됩니다.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 공지사항 탭 */}
        <TabsContent value="notices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>공지사항 목록</CardTitle>
              <CardDescription>
                사용자 및 업체에게 표시할 공지사항을 관리합니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex items-center gap-2">
                <Input
                  placeholder="제목으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-sm"
                />
                <Button>새 공지 작성</Button>
              </div>

              {noticeLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>제목</TableHead>
                        <TableHead>작성자</TableHead>
                        <TableHead>대상</TableHead>
                        <TableHead>조회수</TableHead>
                        <TableHead>게시일</TableHead>
                        <TableHead className="text-right">작업</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredNotices.map((notice) => (
                        <TableRow key={notice.id}>
                          <TableCell className="font-medium">
                            {notice.isImportant && (
                              <Badge variant="destructive" className="mr-2">
                                중요
                              </Badge>
                            )}
                            {notice.title}
                          </TableCell>
                          <TableCell>{notice.authorName}</TableCell>
                          <TableCell>
                            {notice.targetRole === "all"
                              ? "전체"
                              : notice.targetRole}
                          </TableCell>
                          <TableCell>{notice.viewCount}</TableCell>
                          <TableCell className="text-xs">
                            {notice.publishedAt
                              ? new Date(notice.publishedAt).toLocaleDateString(
                                  "ko-KR"
                                )
                              : "미게시"}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              수정
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
