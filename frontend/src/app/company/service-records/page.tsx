"use client";

import { useState, useMemo } from "react";
import { useCompanyServiceRecords } from "@/features/company/hooks/use-service-records";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ClipboardList,
  Search,
  FileText,
  Wrench,
  CheckCircle,
  User,
} from "lucide-react";
import { formatKoreanDate } from "@/lib/date-utils";
import type { ServiceType } from "@/features/company/types/service-record";

/**
 * 업체 서비스 이력 관리 페이지
 */
export default function ServiceRecordsPage() {
  const [typeFilter, setTypeFilter] = useState<ServiceType | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: serviceRecords, isLoading } = useCompanyServiceRecords();

  /**
   * 필터링된 서비스 이력 목록
   */
  const filteredRecords = useMemo(() => {
    if (!serviceRecords) return [];

    let filtered = serviceRecords;

    // 타입 필터
    if (typeFilter !== "ALL") {
      filtered = filtered.filter((record) => record.type === typeFilter);
    }

    // 검색 쿼리 (사용자명, 장치 S/N, 설명)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (record) =>
          record.subjectName.toLowerCase().includes(query) ||
          record.deviceSerialNumber.toLowerCase().includes(query) ||
          record.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [serviceRecords, typeFilter, searchQuery]);

  /**
   * 서비스 타입 뱃지 스타일
   */
  const getServiceTypeBadge = (type: ServiceType) => {
    const styles = {
      INSTALLATION: {
        variant: "default" as const,
        text: "설치",
        icon: FileText,
      },
      INSPECTION: {
        variant: "secondary" as const,
        text: "검·교정",
        icon: CheckCircle,
      },
      REPAIR: { variant: "outline" as const, text: "수리", icon: Wrench },
      MAINTENANCE: {
        variant: "outline" as const,
        text: "유지보수",
        icon: Wrench,
      },
    };

    const config = styles[type] || {
      variant: "outline" as const,
      text: getServiceTypeText(type),
      icon: ClipboardList,
    };
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  /**
   * 서비스 타입 텍스트
   */
  const getServiceTypeText = (type: string) => {
    const typeMap = {
      installation: "설치",
      inspection: "검·교정",
      repair: "수리",
      maintenance: "유지보수",
      all: "전체",
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  /**
   * 비용 포맷팅
   */
  const formatCost = (cost: number) => {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: "KRW",
    }).format(cost);
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          서비스 이력
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          완료된 서비스 이력을 확인하고 관리합니다
        </p>
      </div>

      {/* 필터 및 검색 */}
      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* 왼쪽: 타입 필터 및 검색 */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
              {/* 타입 필터 */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  서비스 타입
                </span>
                <Select
                  value={typeFilter}
                  onValueChange={(value) =>
                    setTypeFilter(value as ServiceType | "ALL")
                  }
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="전체" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">전체</SelectItem>
                    <SelectItem value="INSTALLATION">설치</SelectItem>
                    <SelectItem value="INSPECTION">검·교정</SelectItem>
                    <SelectItem value="REPAIR">수리</SelectItem>
                    <SelectItem value="MAINTENANCE">유지보수</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 검색 */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="사용자명, 장치 S/N, 설명으로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* 오른쪽: 통계 */}
            <div className="text-sm text-gray-600">
              총{" "}
              <span className="font-semibold text-gray-900">
                {filteredRecords.length}
              </span>
              건
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 서비스 이력 테이블 */}
      {!filteredRecords || filteredRecords.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-20 text-center">
            <ClipboardList className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-2">
              {searchQuery || typeFilter !== "ALL"
                ? "검색 결과가 없습니다"
                : "서비스 이력이 없습니다"}
            </p>
            {(searchQuery || typeFilter !== "ALL") && (
              <p className="text-sm text-gray-400">
                필터를 변경하거나 검색어를 수정해보세요
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">서비스 타입</TableHead>
                    <TableHead className="font-semibold">사용자</TableHead>
                    <TableHead className="font-semibold">장치 S/N</TableHead>
                    <TableHead className="font-semibold">서비스 내용</TableHead>
                    <TableHead className="font-semibold">수행일</TableHead>
                    <TableHead className="font-semibold">담당자</TableHead>
                    <TableHead className="font-semibold text-right">
                      비용
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow
                      key={record.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* 서비스 타입 */}
                      <TableCell>{getServiceTypeBadge(record.type)}</TableCell>

                      {/* 사용자 */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900">
                            {record.subjectName}
                          </span>
                        </div>
                      </TableCell>

                      {/* 장치 S/N */}
                      <TableCell>
                        <span className="font-mono text-sm text-gray-600">
                          {record.deviceSerialNumber}
                        </span>
                      </TableCell>

                      {/* 서비스 내용 */}
                      <TableCell>
                        <p className="text-sm text-gray-700 max-w-md truncate">
                          {record.description}
                        </p>
                      </TableCell>

                      {/* 수행일 */}
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {formatKoreanDate(record.performedAt, "yyyy-MM-dd")}
                        </span>
                      </TableCell>

                      {/* 담당자 */}
                      <TableCell>
                        <span className="text-sm text-gray-600">
                          {record.performedBy}
                        </span>
                      </TableCell>

                      {/* 비용 */}
                      <TableCell className="text-right">
                        <span className="font-semibold text-gray-900">
                          {formatCost(record.cost)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
