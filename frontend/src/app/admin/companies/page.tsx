"use client";

import { useState } from "react";
import {
  useCompanies,
  useApproveCompany,
  useRejectCompany,
} from "@/features/admin/hooks/use-companies";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CheckCircle, XCircle } from "lucide-react";
import { CreateCompanyDialog } from "@/features/admin/components/create-company-dialog";
import { CompanyDetailModal } from "@/features/admin/components/company-detail-modal";

/**
 * 업체 관리 페이지
 * 시스템에 등록된 전체 설치/관리 업체를 조회하고 신규 업체를 등록/승인
 */
export default function AdminCompaniesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCompanyIdForDetail, setSelectedCompanyIdForDetail] = useState<
    string | null
  >(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { companies, totalCount, isLoading, error } = useCompanies();
  const approveMutation = useApproveCompany();
  const rejectMutation = useRejectCompany();

  // 데이터가 없을 때 기본값 설정
  const safeCompanies = companies ?? [];
  const safeTotalCount = totalCount ?? 0;

  // 검색 필터링
  const filteredCompanies = safeCompanies.filter(
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

      {/* 에러 알림 배너 */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-4">
            <p className="text-sm text-red-600">
              일부 데이터를 불러오는 중 오류가 발생했습니다. 기본 데이터를
              표시합니다.
            </p>
          </CardContent>
        </Card>
      )}

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              전체 업체
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeTotalCount}</div>
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
              {safeCompanies.filter((c) => c.status === "approved").length}
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
              {safeCompanies.filter((c) => c.status === "pending").length}
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
                safeCompanies.filter(
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
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              새 업체 등록
            </Button>
          </div>

          {/* 로딩 상태 */}
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
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
                  {filteredCompanies.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center text-gray-500 py-8"
                      >
                        {searchQuery
                          ? "검색 결과가 없습니다."
                          : "등록된 업체가 없습니다."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCompanies.map((company) => (
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
                        <TableCell>
                          {renderStatusBadge(company.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {company.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={() =>
                                    approveMutation.mutate(company.id)
                                  }
                                  disabled={approveMutation.isPending}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  승인
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() =>
                                        setSelectedCompanyId(company.id)
                                      }
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      거절
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        업체 거절
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        이 업체를 거절하시겠습니까? 거절 사유를
                                        입력해주세요.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="space-y-4 py-4">
                                      <div className="space-y-2">
                                        <Label htmlFor="reason">
                                          거절 사유
                                        </Label>
                                        <Textarea
                                          id="reason"
                                          value={rejectionReason}
                                          onChange={(e) =>
                                            setRejectionReason(e.target.value)
                                          }
                                          placeholder="거절 사유를 입력하세요"
                                          className="min-h-[100px]"
                                        />
                                      </div>
                                    </div>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel
                                        onClick={() => {
                                          setRejectionReason("");
                                          setSelectedCompanyId(null);
                                        }}
                                      >
                                        취소
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => {
                                          if (
                                            selectedCompanyId &&
                                            rejectionReason.trim()
                                          ) {
                                            rejectMutation.mutate({
                                              companyId: selectedCompanyId,
                                              reason: rejectionReason,
                                            });
                                            setRejectionReason("");
                                            setSelectedCompanyId(null);
                                          }
                                        }}
                                        disabled={
                                          !rejectionReason.trim() ||
                                          rejectMutation.isPending
                                        }
                                      >
                                        거절 확인
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </>
                            )}
                            {company.status !== "pending" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedCompanyIdForDetail(company.id);
                                  setIsDetailModalOpen(true);
                                }}
                              >
                                상세
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 업체 등록 다이얼로그 */}
      <CreateCompanyDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />

      {/* 업체 상세 모달 */}
      <CompanyDetailModal
        open={isDetailModalOpen}
        onOpenChange={(open) => {
          setIsDetailModalOpen(open);
          if (!open) {
            setSelectedCompanyIdForDetail(null);
          }
        }}
        companyId={selectedCompanyIdForDetail}
      />
    </div>
  );
}
