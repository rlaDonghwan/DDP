"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { logApi } from "@/features/log/api/log-api";
import type { DrivingLogResponse, LogStatus, AnomalyType } from "@/features/log/types/log";
import { useSession } from "@/features/auth/hooks/use-session";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { CheckCircle, XCircle, Download, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { formatKoreanDate } from "@/lib/date-utils";

/**
 * 로그 관리 페이지
 * 사용자가 제출한 모든 운행기록(로그)을 조회하고, 이상 로그를 관리
 */
export default function AdminLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LogStatus | "ALL">("ALL");
  const [anomalyFilter, setAnomalyFilter] = useState<AnomalyType | "ALL">("ALL");
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  const { user } = useSession();
  const queryClient = useQueryClient();

  // 로그 목록 조회
  const { data: logsData, isLoading } = useQuery({
    queryKey: ["admin", "logs"],
    queryFn: async () => {
      const response = await logApi.getAllLogs(0, 100);
      return response;
    },
  });

  // 로그 검토 뮤테이션
  const reviewMutation = useMutation({
    mutationFn: async ({ logId, status, reviewNotes }: {
      logId: string;
      status: LogStatus;
      reviewNotes?: string;
    }) => {
      if (!user?.id) throw new Error("사용자 정보가 없습니다");
      return logApi.reviewLog(logId, {
        status,
        reviewNotes,
        reviewerId: user.id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "logs"] });
      toast.success("검토 완료", {
        description: "로그 검토가 완료되었습니다.",
      });
      setRejectionReason("");
      setSelectedLogId(null);
    },
    onError: (error: any) => {
      toast.error("검토 실패", {
        description: error?.message || "로그 검토 중 오류가 발생했습니다.",
      });
    },
  });

  const logs = logsData?.content || [];
  const totalCount = logsData?.totalElements || 0;

  // 필터링 로직
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      // 검색어 필터
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        log.fileName.toLowerCase().includes(searchLower) ||
        log.logId.toLowerCase().includes(searchLower) ||
        log.deviceId.toString().includes(searchQuery) ||
        log.userId.toString().includes(searchQuery);

      // 상태 필터
      const matchesStatus = statusFilter === "ALL" || log.status === statusFilter;

      // 이상 징후 필터
      const matchesAnomaly = anomalyFilter === "ALL" || log.anomalyType === anomalyFilter;

      return matchesSearch && matchesStatus && matchesAnomaly;
    });
  }, [logs, searchQuery, statusFilter, anomalyFilter]);

  // 통계 계산
  const statistics = useMemo(() => {
    const normalLogs = logs.filter((l) => l.anomalyType === "NORMAL").length;
    const flaggedLogs = logs.filter((l) => l.status === "FLAGGED").length;
    const flaggedRate = totalCount > 0 ? ((flaggedLogs / totalCount) * 100).toFixed(1) : "0";

    return { normalLogs, flaggedLogs, flaggedRate };
  }, [logs, totalCount]);

  // CSV 내보내기 함수
  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      toast.error("내보내기 실패", {
        description: "내보낼 데이터가 없습니다.",
      });
      return;
    }

    // CSV 헤더
    const headers = [
      "로그 ID",
      "사용자 ID",
      "장치 ID",
      "제출일",
      "기간 시작",
      "기간 종료",
      "파일명",
      "파일 크기(MB)",
      "상태",
      "이상 유형",
      "분석 결과",
    ];

    // CSV 데이터 생성
    const csvRows = [
      headers.join(","),
      ...filteredLogs.map((log) =>
        [
          log.logId,
          log.userId,
          log.deviceId,
          formatKoreanDate(log.submitDate),
          formatKoreanDate(log.periodStart),
          formatKoreanDate(log.periodEnd),
          `"${log.fileName}"`,
          (log.fileSize / (1024 * 1024)).toFixed(2),
          getStatusText(log.status),
          getAnomalyTypeLabel(log.anomalyType),
          `"${log.analysisResult?.replace(/"/g, '""') || ""}"`,
        ].join(",")
      ),
    ];

    // Blob 생성 및 다운로드
    const csvContent = csvRows.join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `logs_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    toast.success("내보내기 완료", {
      description: `${filteredLogs.length}개의 로그를 CSV 파일로 내보냈습니다.`,
    });
  };

  // 상태 뱃지 스타일
  const getStatusBadge = (status: LogStatus) => {
    const styles = {
      SUBMITTED: { variant: "secondary" as const, text: "제출됨" },
      UNDER_REVIEW: { variant: "secondary" as const, text: "검토 중" },
      APPROVED: { variant: "default" as const, text: "승인" },
      REJECTED: { variant: "destructive" as const, text: "반려" },
      FLAGGED: { variant: "destructive" as const, text: "이상 징후" },
    };
    const config = styles[status];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  // 상태 텍스트
  const getStatusText = (status: LogStatus): string => {
    const statusMap = {
      SUBMITTED: "제출됨",
      UNDER_REVIEW: "검토 중",
      APPROVED: "승인",
      REJECTED: "반려",
      FLAGGED: "이상 징후",
    };
    return statusMap[status];
  };

  // 이상 유형 레이블
  const getAnomalyTypeLabel = (type: AnomalyType): string => {
    const labels: Record<AnomalyType, string> = {
      NORMAL: "정상",
      TAMPERING_ATTEMPT: "조작 시도",
      BYPASS_ATTEMPT: "우회 시도",
      EXCESSIVE_FAILURES: "과도한 실패율",
      DATA_INCONSISTENCY: "데이터 불일치",
      DEVICE_MALFUNCTION: "장치 오작동",
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          로그 관리
        </h1>
        <p className="text-gray-600 mt-2">
          운행기록 로그를 조회하고 이상 징후를 관리합니다.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              전체 로그
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              정상 로그
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {statistics.normalLogs}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              이상 징후 로그
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {statistics.flaggedLogs}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              이상 징후율
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {statistics.flaggedRate}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>로그 목록</CardTitle>
          <CardDescription>
            제출된 운행기록을 검색하고 상세 분석할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 필터 및 검색 영역 */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Input
              placeholder="로그 ID, 파일명, 장치 ID, 사용자 ID로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as LogStatus | "ALL")}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">전체 상태</SelectItem>
                <SelectItem value="SUBMITTED">제출됨</SelectItem>
                <SelectItem value="UNDER_REVIEW">검토 중</SelectItem>
                <SelectItem value="APPROVED">승인</SelectItem>
                <SelectItem value="REJECTED">반려</SelectItem>
                <SelectItem value="FLAGGED">이상 징후</SelectItem>
              </SelectContent>
            </Select>
            <Select value={anomalyFilter} onValueChange={(value) => setAnomalyFilter(value as AnomalyType | "ALL")}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="이상 유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">전체 유형</SelectItem>
                <SelectItem value="NORMAL">정상</SelectItem>
                <SelectItem value="TAMPERING_ATTEMPT">조작 시도</SelectItem>
                <SelectItem value="BYPASS_ATTEMPT">우회 시도</SelectItem>
                <SelectItem value="EXCESSIVE_FAILURES">과도한 실패율</SelectItem>
                <SelectItem value="DATA_INCONSISTENCY">데이터 불일치</SelectItem>
                <SelectItem value="DEVICE_MALFUNCTION">장치 오작동</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleExportCSV} className="ml-auto">
              <Download className="h-4 w-4 mr-2" />
              CSV 내보내기
            </Button>
          </div>

          {/* 필터 결과 표시 */}
          <div className="mb-4 text-sm text-gray-600">
            전체 {totalCount}건 중 {filteredLogs.length}건 표시
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
                    <TableHead>제출일</TableHead>
                    <TableHead>파일명</TableHead>
                    <TableHead>장치 ID</TableHead>
                    <TableHead>사용자 ID</TableHead>
                    <TableHead>기간</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>이상 유형</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                        <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p>
                          {searchQuery || statusFilter !== "ALL" || anomalyFilter !== "ALL"
                            ? "검색 결과가 없습니다."
                            : "등록된 로그가 없습니다."}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => (
                      <TableRow key={log.logId}>
                        <TableCell className="text-xs">
                          {formatKoreanDate(log.submitDate)}
                        </TableCell>
                        <TableCell className="font-medium max-w-[200px] truncate">
                          {log.fileName}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {log.deviceId}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {log.userId}
                        </TableCell>
                        <TableCell className="text-xs">
                          {formatKoreanDate(log.periodStart)} ~ {formatKoreanDate(log.periodEnd)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(log.status)}
                        </TableCell>
                        <TableCell>
                          {log.anomalyType !== "NORMAL" && (
                            <div className="flex items-center gap-1 text-red-600">
                              <AlertCircle className="h-4 w-4" />
                              <span className="text-xs">{getAnomalyTypeLabel(log.anomalyType)}</span>
                            </div>
                          )}
                          {log.anomalyType === "NORMAL" && (
                            <span className="text-xs text-gray-500">정상</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            {log.status !== "APPROVED" && (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => reviewMutation.mutate({
                                  logId: log.logId,
                                  status: "APPROVED",
                                })}
                                disabled={reviewMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                승인
                              </Button>
                            )}
                            {log.status !== "REJECTED" && (
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => setSelectedLogId(log.logId)}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    반려
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>로그 반려</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      이 로그를 반려하시겠습니까? 반려 사유를 입력해주세요.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="reason">반려 사유</Label>
                                      <Textarea
                                        id="reason"
                                        value={rejectionReason}
                                        onChange={(e) =>
                                          setRejectionReason(e.target.value)
                                        }
                                        placeholder="반려 사유를 입력하세요"
                                        className="min-h-[100px]"
                                      />
                                    </div>
                                  </div>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel
                                      onClick={() => {
                                        setRejectionReason("");
                                        setSelectedLogId(null);
                                      }}
                                    >
                                      취소
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => {
                                        if (selectedLogId && rejectionReason.trim()) {
                                          reviewMutation.mutate({
                                            logId: selectedLogId,
                                            status: "REJECTED",
                                            reviewNotes: rejectionReason,
                                          });
                                        }
                                      }}
                                      disabled={
                                        !rejectionReason.trim() ||
                                        reviewMutation.isPending
                                      }
                                    >
                                      반려 확인
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
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
    </div>
  );
}
