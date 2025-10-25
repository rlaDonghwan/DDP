"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Trash2,
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Users,
  Cpu,
  FileText,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import {
  useAdminCompanyDetail,
  useDeleteCompany,
} from "../hooks/use-companies";
import type { CompanyStatus } from "../types/company";

interface CompanyDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyId: string | null;
}

/**
 * 업체 상세 정보 모달
 * 업체의 상세 정보, 서비스 이력, 관리 장치, 담당 고객 등을 표시하고 삭제 기능 제공
 */
export function CompanyDetailModal({
  open,
  onOpenChange,
  companyId,
}: CompanyDetailModalProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // 업체 상세 정보 조회
  const {
    data: response,
    isLoading,
    error,
  } = useAdminCompanyDetail(companyId || "");
  const deleteMutation = useDeleteCompany();

  // 삭제 처리
  const handleDelete = async () => {
    if (!companyId) return;

    await deleteMutation.mutateAsync(companyId);
    setIsDeleteDialogOpen(false);
    onOpenChange(false);
  };

  // 상태 뱃지 렌더링
  const renderStatusBadge = (status: CompanyStatus) => {
    const statusConfig = {
      approved: {
        icon: CheckCircle2,
        variant: "default" as const,
        label: "승인",
        className: "bg-green-500 hover:bg-green-600",
      },
      pending: {
        icon: Clock,
        variant: "secondary" as const,
        label: "대기",
        className: "bg-orange-500 hover:bg-orange-600 text-white",
      },
      rejected: {
        icon: XCircle,
        variant: "destructive" as const,
        label: "반려",
        className: "bg-red-500 hover:bg-red-600",
      },
      suspended: {
        icon: AlertCircle,
        variant: "secondary" as const,
        label: "정지",
        className: "bg-gray-500 hover:bg-gray-600 text-white",
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  // 서비스 타입 한글 변환
  const getServiceTypeLabel = (type: string) => {
    const labels: Record<string, { label: string; color: string }> = {
      installation: {
        label: "설치",
        color: "bg-blue-100 text-blue-700 border-blue-300",
      },
      repair: {
        label: "수리",
        color: "bg-orange-100 text-orange-700 border-orange-300",
      },
      inspection: {
        label: "검사",
        color: "bg-green-100 text-green-700 border-green-300",
      },
      replacement: {
        label: "교체",
        color: "bg-purple-100 text-purple-700 border-purple-300",
      },
    };
    return (
      labels[type] || {
        label: type,
        color: "bg-gray-100 text-gray-700 border-gray-300",
      }
    );
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 날짜시간 포맷팅
  const formatDateTime = (dateString: string | null | undefined) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const company = response?.company;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            업체 상세 정보
          </DialogTitle>
          <DialogDescription>
            업체의 상세 정보 및 서비스 이력을 확인할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        {/* 로딩 상태 */}
        {isLoading && (
          <div className="space-y-4 py-6">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        )}

        {/* 에러 상태 */}
        {error && (
          <div className="flex items-center justify-center py-12">
            <Card className="border-red-200 bg-red-50">
              <CardContent className="py-6 px-8">
                <div className="flex items-center gap-3 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  <p className="font-medium">
                    업체 정보를 불러오는 중 오류가 발생했습니다.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 업체 정보 표시 */}
        {company && (
          <div className="space-y-6 py-4">
            {/* 헤더 상태 및 통계 */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {company.name}
                  </h2>
                  <p className="text-sm text-gray-600 font-mono">
                    {company.businessNumber}
                  </p>
                </div>
              </div>
              <div>{renderStatusBadge(company.status)}</div>
            </div>

            {/* 통계 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">
                        관리 장치
                      </p>
                      <p className="text-3xl font-bold text-blue-700 mt-1">
                        {company.deviceCount}
                        <span className="text-lg ml-1">개</span>
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-blue-200 flex items-center justify-center">
                      <Cpu className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-gradient-to-br from-green-50 to-green-100/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">
                        담당 고객
                      </p>
                      <p className="text-3xl font-bold text-green-700 mt-1">
                        {company.customerCount}
                        <span className="text-lg ml-1">명</span>
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-green-200 flex items-center justify-center">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 기본 정보 */}
            <Card>
              <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100/50">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-gray-700" />
                  기본 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <Building2 className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">
                          업체명
                        </p>
                        <p className="text-base font-semibold text-gray-900 mt-0.5">
                          {company.name}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">
                          사업자번호
                        </p>
                        <p className="text-base font-mono font-semibold text-gray-900 mt-0.5">
                          {company.businessNumber}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                        <Users className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">
                          대표자명
                        </p>
                        <p className="text-base font-semibold text-gray-900 mt-0.5">
                          {company.representativeName}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                        <Phone className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">
                          연락처
                        </p>
                        <p className="text-base font-semibold text-gray-900 mt-0.5">
                          {company.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center shrink-0">
                        <Mail className="h-5 w-5 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">
                          이메일
                        </p>
                        <p className="text-base font-semibold text-gray-900 mt-0.5 break-all">
                          {company.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                        <MapPin className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">
                          지역
                        </p>
                        <p className="text-base font-semibold text-gray-900 mt-0.5">
                          {company.region}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                        <MapPin className="h-5 w-5 text-teal-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 font-medium">
                          주소
                        </p>
                        <p className="text-base font-semibold text-gray-900 mt-0.5">
                          {company.address}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">등록일</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(company.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">최종 수정일</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {formatDate(company.updatedAt)}
                      </p>
                    </div>
                  </div>

                  {company.approvedAt && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-xs text-green-600">승인일</p>
                        <p className="text-sm font-semibold text-green-700">
                          {formatDate(company.approvedAt)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {company.rejectedReason && (
                  <div className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200">
                    <div className="flex items-start gap-3">
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-red-700">
                          거절 사유
                        </p>
                        <p className="text-sm text-red-600 mt-1">
                          {company.rejectedReason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 서비스 이력 */}
            {company.serviceHistory && company.serviceHistory.length > 0 && (
              <Card>
                <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100/50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5 text-purple-700" />
                    서비스 이력
                    <Badge variant="secondary" className="ml-2">
                      {company.serviceHistory.length}건
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">
                            서비스 타입
                          </TableHead>
                          <TableHead className="font-semibold">
                            대상자
                          </TableHead>
                          <TableHead className="font-semibold">
                            장치 일련번호
                          </TableHead>
                          <TableHead className="font-semibold">
                            담당자
                          </TableHead>
                          <TableHead className="font-semibold">
                            수행일
                          </TableHead>
                          <TableHead className="text-right font-semibold">
                            비용
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {company.serviceHistory.map((service) => {
                          const serviceType = getServiceTypeLabel(service.type);
                          return (
                            <TableRow
                              key={service.id}
                              className="hover:bg-gray-50"
                            >
                              <TableCell>
                                <Badge
                                  variant="outline"
                                  className={serviceType.color}
                                >
                                  {serviceType.label}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">
                                {service.subjectName}
                              </TableCell>
                              <TableCell className="font-mono text-xs text-gray-600">
                                {service.deviceSerialNumber}
                              </TableCell>
                              <TableCell>{service.performedBy}</TableCell>
                              <TableCell className="text-sm text-gray-600">
                                {formatDateTime(service.performedAt)}
                              </TableCell>
                              <TableCell className="text-right font-semibold">
                                {service.cost ? (
                                  `${service.cost.toLocaleString()}원`
                                ) : (
                                  <span className="text-gray-400">-</span>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 관리 중인 장치 */}
            {company.managedDevices && company.managedDevices.length > 0 && (
              <Card>
                <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100/50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-blue-700" />
                    관리 중인 장치
                    <Badge variant="secondary" className="ml-2">
                      {company.managedDevices.length}개
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">
                            일련번호
                          </TableHead>
                          <TableHead className="font-semibold">
                            모델명
                          </TableHead>
                          <TableHead className="font-semibold">상태</TableHead>
                          <TableHead className="font-semibold">
                            할당 대상자
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {company.managedDevices.map((device) => (
                          <TableRow
                            key={device.id}
                            className="hover:bg-gray-50"
                          >
                            <TableCell className="font-mono text-xs text-gray-700 font-semibold">
                              {device.serialNumber}
                            </TableCell>
                            <TableCell className="font-medium">
                              {device.modelName}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{device.status}</Badge>
                            </TableCell>
                            <TableCell>
                              {device.assignedSubjectName || (
                                <span className="text-gray-400">미할당</span>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 담당 고객 */}
            {company.customers && company.customers.length > 0 && (
              <Card>
                <CardHeader className="bg-gradient-to-r from-green-50 to-green-100/50">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-700" />
                    담당 고객
                    <Badge variant="secondary" className="ml-2">
                      {company.customers.length}명
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="font-semibold">이름</TableHead>
                          <TableHead className="font-semibold">
                            연락처
                          </TableHead>
                          <TableHead className="font-semibold">
                            장치 일련번호
                          </TableHead>
                          <TableHead className="font-semibold">
                            최근 서비스
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {company.customers.map((customer) => (
                          <TableRow
                            key={customer.id}
                            className="hover:bg-gray-50"
                          >
                            <TableCell className="font-medium">
                              {customer.name}
                            </TableCell>
                            <TableCell>{customer.phone}</TableCell>
                            <TableCell className="font-mono text-xs text-gray-600">
                              {customer.deviceSerialNumber || (
                                <span className="text-gray-400">-</span>
                              )}
                            </TableCell>
                            <TableCell className="text-sm text-gray-600">
                              {formatDate(customer.lastServiceDate)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 하단 버튼 */}
            <div className="flex justify-between items-center pt-4 border-t">
              <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    업체 삭제
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                      업체 삭제 확인
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      정말로 이 업체를 삭제하시겠습니까?
                    </AlertDialogDescription>
                    <div className="space-y-3 pt-2">
                      <p className="text-sm text-red-600 font-semibold">
                        이 작업은 되돌릴 수 없습니다.
                      </p>
                      <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                        <p className="text-sm text-gray-600">업체명</p>
                        <p className="font-semibold text-gray-900">
                          {company.name}
                        </p>
                      </div>
                    </div>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={deleteMutation.isPending}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {deleteMutation.isPending ? "삭제 중..." : "삭제"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button variant="outline" onClick={() => onOpenChange(false)}>
                닫기
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
