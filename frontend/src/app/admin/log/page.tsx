"use client";

import { useState } from "react";
import { useLogs, useApproveLog, useRejectLog } from "@/features/admin/hooks/use-logs";
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

/**
 * 로그 관리 페이지
 * 사용자가 제출한 모든 운행기록(로그)을 조회하고, 이상 로그(알코올 감지 등)를 분석
 */
export default function AdminLogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  const { logs, totalCount, isLoading, error } = useLogs();
  const approveMutation = useApproveLog();
  const rejectMutation = useRejectLog();

  // 데이터가 없을 때 기본값 설정
  const safeLogs = logs ?? [];
  const safeTotalCount = totalCount ?? 0;

  // 검색 필터링
  const filteredLogs = safeLogs.filter(
    (log) =>
      log.subjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.vehicleNumber.includes(searchQuery) ||
      log.deviceSerialNumber.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          로그 관리
        </h1>
        <p className="text-gray-600 mt-2">
          운행기록 로그를 조회하고 알코올 감지 이벤트를 분석합니다.
        </p>
      </div>

      {/* 에러 알림 배너 */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="py-4">
            <p className="text-sm text-red-600">
              일부 데이터를 불러오는 중 오류가 발생했습니다. 기본 데이터를 표시합니다.
            </p>
          </CardContent>
        </Card>
      )}

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              전체 로그
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{safeTotalCount}</div>
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
              {safeLogs.filter((l) => !l.hasViolation).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              위반 로그
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {safeLogs.filter((l) => l.hasViolation).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              위반율
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {safeTotalCount > 0
                ? (
                    (safeLogs.filter((l) => l.hasViolation).length / safeTotalCount) *
                    100
                  ).toFixed(1)
                : 0}
              %
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
          <div className="mb-4 flex items-center gap-2">
            <Input
              placeholder="대상자명, 차량번호, 장치 S/N으로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Button variant="outline">필터</Button>
            <Button variant="outline">위반만 보기</Button>
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
                    <TableHead>제출 일시</TableHead>
                    <TableHead>대상자</TableHead>
                    <TableHead>장치 S/N</TableHead>
                    <TableHead>차량번호</TableHead>
                    <TableHead>운행 시간</TableHead>
                    <TableHead>테스트 횟수</TableHead>
                    <TableHead>위반 여부</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-gray-500 py-8">
                        {searchQuery
                          ? "검색 결과가 없습니다."
                          : "등록된 로그가 없습니다."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="text-xs">
                          {new Date(log.submittedAt).toLocaleString("ko-KR")}
                        </TableCell>
                        <TableCell className="font-medium">
                          {log.subjectName}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {log.deviceSerialNumber}
                        </TableCell>
                        <TableCell>{log.vehicleNumber}</TableCell>
                        <TableCell className="text-xs">
                          {new Date(log.startTime).toLocaleTimeString("ko-KR")} ~{" "}
                          {new Date(log.endTime).toLocaleTimeString("ko-KR")}
                        </TableCell>
                        <TableCell>{log.alcoholTestResults.length}</TableCell>
                        <TableCell>
                          {log.hasViolation ? (
                            <Badge variant="destructive">위반</Badge>
                          ) : (
                            <Badge variant="default">정상</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => approveMutation.mutate(log.id)}
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
                                  onClick={() => setSelectedLogId(log.id)}
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
                                        rejectMutation.mutate({
                                          logId: selectedLogId,
                                          reason: rejectionReason,
                                        });
                                        setRejectionReason("");
                                        setSelectedLogId(null);
                                      }
                                    }}
                                    disabled={
                                      !rejectionReason.trim() ||
                                      rejectMutation.isPending
                                    }
                                  >
                                    반려 확인
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
