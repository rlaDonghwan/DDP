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
import { FileText, Upload, Info } from "lucide-react";
import type { LogStatus } from "@/features/log/types/log";
import { formatKoreanDate } from "@/lib/date-utils";

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
   * 상태 뱃지 스타일
   */
  const getStatusBadge = (status: LogStatus) => {
    const styles = {
      PENDING: { variant: "secondary" as const, text: "검토 중" },
      APPROVED: { variant: "default" as const, text: "승인" },
      REJECTED: { variant: "destructive" as const, text: "반려" },
    };
    const config = styles[status];
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
    const statusMap = {
      ALL: "전체",
      PENDING: "검토 중",
      APPROVED: "승인",
      REJECTED: "반려",
    };
    return statusMap[status];
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
        <Button onClick={() => router.push("/user/logs/submit")}>
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
                onClick={() => router.push("/user/logs/submit")}
              >
                운행기록 제출하기
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <Card key={log.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          {log.fileName}
                          {getStatusBadge(log.status)}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          제출일: {formatKoreanDate(log.uploadDate)}
                        </CardDescription>
                      </div>
                      <div className="text-right text-sm text-gray-600">
                        <p>파일 크기: {(log.fileSize / 1024).toFixed(2)} KB</p>
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
                          {formatKoreanDate(log.recordStartDate)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          기록 종료일
                        </p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatKoreanDate(log.recordEndDate)}
                        </p>
                      </div>
                    </div>

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

                    {log.status === "REJECTED" && log.rejectionReason && (
                      <div className="mt-4 p-3 bg-red-50 rounded-lg">
                        <p className="text-sm font-medium text-red-800 mb-1">
                          반려 사유:
                        </p>
                        <p className="text-sm text-red-700">
                          {log.rejectionReason}
                        </p>
                        {log.reviewedAt && (
                          <p className="text-xs text-red-600 mt-2">
                            반려일: {formatKoreanDate(log.reviewedAt)}
                          </p>
                        )}
                      </div>
                    )}

                    {log.status === "PENDING" && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          관리자 검토 중입니다. 승인까지 영업일 기준 1-2일이
                          소요됩니다.
                        </p>
                      </div>
                    )}
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
