"use client";

import { useState } from "react";
import { useUserLogs } from "@/features/log/hooks/use-logs";
import { useSession } from "@/features/auth/hooks/use-session";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { FileText, Upload, Info, Download, AlertCircle, CheckCircle } from "lucide-react";
import type { LogStatus, AnomalyType, AnomalyTypeKey } from "@/features/log/types/log";
import { formatKoreanDate } from "@/lib/date-utils";
import { logApi } from "@/features/log/api/log-api";
import { toast } from "sonner";

/**
 * 운행기록 제출 이력 페이지
 */
export default function LogHistoryPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<LogStatus | "ALL">("ALL");
  const { user } = useSession();

  const { data: logs, isLoading } = useUserLogs(user?.id);

  /**
   * 상태별 필터링
   */
  const filteredLogs =
    logs?.filter(
      (log) => statusFilter === "ALL" || log.status === statusFilter
    ) || [];

  /**
   * 파일 다운로드 핸들러
   */
  const handleDownload = async (logId: string, fileName: string) => {
    try {
      await logApi.downloadLogFile(logId);
      
      toast.success("다운로드 완료", {
        description: `${fileName} 파일이 다운로드되었습니다.`,
      });
    } catch (error) {
      toast.error("다운로드 실패", {
        description: "파일 다운로드 중 오류가 발생했습니다.",
      });
    }
  };

  /**
   * 상태 뱃지 스타일
   */
  const getStatusBadge = (status: LogStatus) => {
    const styles: Record<LogStatus, { variant: "default" | "secondary" | "destructive" | "outline", text: string }> = {
      SUBMITTED: { variant: "secondary", text: "제출됨" },
      UNDER_REVIEW: { variant: "outline", text: "검토 중" },
      APPROVED: { variant: "default", text: "승인" },
      REJECTED: { variant: "destructive", text: "반려" },
      FLAGGED: { variant: "destructive", text: "이상 징후" },
    };
    
    const config = styles[status] || { variant: "secondary" as const, text: status };
    
    return (
      <Badge variant={config.variant} className="ml-2">
        {config.text}
      </Badge>
    );
  };

  /**
   * 상태 텍스트
   */
  const getStatusFilterText = (status: LogStatus | "ALL") => {
    const statusMap: Record<LogStatus | "ALL", string> = {
      ALL: "전체",
      SUBMITTED: "제출됨",
      UNDER_REVIEW: "검토 중",
      APPROVED: "승인",
      REJECTED: "반려",
      FLAGGED: "이상 징후",
    };
    return statusMap[status];
  };

  /**
   * 이상 유형 레이블
   */
  const getAnomalyTypeLabel = (type?: AnomalyType): string => {
    if (!type) return "정보 없음";

    const labels: Record<AnomalyTypeKey, string> = {
      NORMAL: "정상",
      TAMPERING_ATTEMPT: "조작 시도 감지",
      BYPASS_ATTEMPT: "우회 시도 감지",
      EXCESSIVE_FAILURES: "과도한 실패율",
      DATA_INCONSISTENCY: "데이터 불일치",
      DEVICE_MALFUNCTION: "장치 오작동",
    };
    return labels[type] || "알 수 없음";
  };

  /**
   * 파일 크기 포맷
   */
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            제출 이력
          </h1>
          <p className="text-gray-600 mt-2">
            운행기록 제출 이력을 확인하고 관리합니다
          </p>
        </div>
        <Button onClick={() => router.push("/user/log/submit")}>
          <Upload className="h-4 w-4 mr-2" />새 기록 제출
        </Button>
      </div>

      {/* 안내 정보 */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>제출 이력 안내</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• 제출된 기록은 관리자의 검토를 거쳐 승인됩니다</li>
            <li>• 반려된 경우 사유를 확인하고 재제출할 수 있습니다</li>
            <li>• 승인된 기록은 수정할 수 없습니다</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* 필터 및 통계 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>제출 기록 목록</CardTitle>
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                총 <span className="font-semibold">{logs?.length || 0}</span>건
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as LogStatus | "ALL")
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="상태 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">전체</SelectItem>
                  <SelectItem value="PENDING">검토 중</SelectItem>
                  <SelectItem value="APPROVED">승인</SelectItem>
                  <SelectItem value="REJECTED">반려</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredLogs.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 mb-2">
                {statusFilter === "ALL"
                  ? "제출된 기록이 없습니다"
                  : `${getStatusFilterText(
                      statusFilter
                    )} 상태의 기록이 없습니다`}
              </p>
              <Button
                variant="outline"
                onClick={() => router.push("/user/log/submit")}
              >
                운행기록 제출하기
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <Card key={log.logId} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          {log.fileName}
                          {getStatusBadge(log.status)}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          제출일: {formatKoreanDate(log.submitDate)}
                        </CardDescription>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>파일 크기: {formatFileSize(log.fileSize)}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          장치 S/N
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {log.deviceId}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          기록 시작일
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatKoreanDate(log.periodStart)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          기록 종료일
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatKoreanDate(log.periodEnd)}
                        </p>
                      </div>
                    </div>

                    {/* 상세 통계 */}
                    {(log as any).statistics && (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="font-medium mb-2">측정 통계</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-500">총 측정 횟수:</span>{" "}
                            <span className="font-medium">{(log as any).statistics.totalTests}회</span>
                          </div>
                          <div>
                            <span className="text-gray-500">통과:</span>{" "}
                            <span className="font-medium text-green-600">
                              {(log as any).statistics.passedTests}회
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">실패:</span>{" "}
                            <span className="font-medium text-red-600">
                              {(log as any).statistics.failedTests}회
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">건너뜀:</span>{" "}
                            <span className="font-medium text-yellow-600">
                              {(log as any).statistics.skippedTests}회
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">평균 BAC:</span>{" "}
                            <span className="font-medium">
                              {(log as any).statistics.averageBAC?.toFixed(4) || "0.0000"}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">최대 BAC:</span>{" "}
                            <span className="font-medium">
                              {(log as any).statistics.maxBAC?.toFixed(4) || "0.0000"}
                            </span>
                          </div>
                          {(log as any).statistics.tamperingAttempts > 0 && (
                            <div className="col-span-2">
                              <span className="text-gray-500">조작 시도:</span>{" "}
                              <span className="font-medium text-red-600">
                                {(log as any).statistics.tamperingAttempts}회 ⚠️
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* 이상 징후 경고 */}
                    {(log as any).anomalyType && (log as any).anomalyType !== "NORMAL" && (
                      <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>이상 징후 발견:</strong> {getAnomalyTypeLabel((log as any).anomalyType)}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* 분석 결과 */}
                    {(log as any).analysisResult && (
                      <div className="mt-4 border-t pt-4">
                        <h4 className="font-medium mb-2">자동 분석 결과</h4>
                        <pre className="text-sm bg-gray-50 p-3 rounded whitespace-pre-wrap">
                          {(log as any).analysisResult}
                        </pre>
                      </div>
                    )}

                    {log.status === "APPROVED" && log.reviewedAt && (
                      <div className="mt-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">
                          <span className="font-medium">승인일:</span>{" "}
                          {formatKoreanDate(log.reviewedAt)}
                        </p>
                        {log.reviewedBy && (
                          <p className="text-sm text-green-800">
                            <span className="font-medium">승인자:</span>{" "}
                            {log.reviewedBy}
                          </p>
                        )}
                      </div>
                    )}

                    {log.status === "REJECTED" && log.reviewNotes && (
                      <div className="mt-4 p-3 bg-red-50 rounded-lg">
                        <p className="text-sm font-medium text-red-800 mb-1">
                          반려 사유:
                        </p>
                        <p className="text-sm text-red-700">
                          {log.reviewNotes}
                        </p>
                        {log.reviewedAt && (
                          <p className="text-xs text-red-600 mt-2">
                            반려일: {formatKoreanDate(log.reviewedAt)}
                          </p>
                        )}
                      </div>
                    )}

                    {log.status === "SUBMITTED" && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          관리자 검토 중입니다. 승인까지 영업일 기준 1-2일이
                          소요됩니다.
                        </p>
                      </div>
                    )}

                    {/* 파일 다운로드 버튼 */}
                    <div className="mt-4 pt-4 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(log.logId, log.fileName)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        파일 다운로드
                      </Button>
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
