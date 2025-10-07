"use client";

import { useState } from "react";
import { useDevices } from "@/features/admin/hooks/use-devices";
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
 * 장치 관리 페이지
 * 시스템에 등록된 모든 장치의 현황과 상세 내역을 조회하고 검색
 */
export default function AdminDevicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { devices, totalCount, isLoading, error } = useDevices();

  // 검색 필터링
  const filteredDevices = devices.filter(
    (device) =>
      device.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.assignedSubjectName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // 상태 뱃지 렌더링
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">정상</Badge>;
      case "inactive":
        return <Badge variant="secondary">비활성</Badge>;
      case "maintenance":
        return <Badge>점검중</Badge>;
      case "error":
        return <Badge variant="destructive">오류</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          장치 관리
        </h1>
        <p className="text-gray-600 mt-2">
          음주운전 방지장치의 현황과 상태를 관리합니다.
        </p>
      </div>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              전체 장치
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              정상 작동
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {devices.filter((d) => d.status === "active").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              점검 필요
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {devices.filter((d) => d.status === "maintenance").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              오류 발생
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {devices.filter((d) => d.status === "error").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 목록 */}
      <Card>
        <CardHeader>
          <CardTitle>장치 목록</CardTitle>
          <CardDescription>
            등록된 장치를 검색하고 상세 정보를 확인할 수 있습니다.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <Input
              placeholder="S/N, 모델명, 할당 대상자로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Button variant="outline">필터</Button>
            <Button>새 장치 등록</Button>
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
          ) : filteredDevices.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              검색 결과가 없습니다.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>S/N</TableHead>
                    <TableHead>모델명</TableHead>
                    <TableHead>제조사</TableHead>
                    <TableHead>할당 대상자</TableHead>
                    <TableHead>차량번호</TableHead>
                    <TableHead>상태</TableHead>
                    <TableHead>담당 업체</TableHead>
                    <TableHead className="text-right">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDevices.map((device) => (
                    <TableRow key={device.id}>
                      <TableCell className="font-mono text-xs font-medium">
                        {device.serialNumber}
                      </TableCell>
                      <TableCell>{device.modelName}</TableCell>
                      <TableCell>{device.manufacturer}</TableCell>
                      <TableCell>
                        {device.assignedSubjectName || (
                          <span className="text-gray-400">미할당</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {device.vehicleNumber || (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>{renderStatusBadge(device.status)}</TableCell>
                      <TableCell>
                        {device.companyName || (
                          <span className="text-gray-400">-</span>
                        )}
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
