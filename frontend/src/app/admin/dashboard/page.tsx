"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminDuiApi } from "@/features/admin/api";
import type { DuiSubject } from "@/features/admin/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCcw, Plus, Filter } from "lucide-react";

/**
 * Admin 대시보드 페이지
 * 시스템 전체 통계 및 모니터링 정보를 표시합니다.
 */
export default function AdminDashboardPage() {
  // 상단 KPIs (임시 mock - 추후 subjects 기반/백엔드 연동 예정)
  const [stats, setStats] = useState({
    totalUsers: 156,
    activeUsers: 142,
    totalCompanies: 23,
    totalDevices: 178,
    pendingRequests: 8,
  });

  // 음주운전자 목록 상태
  const [subjects, setSubjects] = useState<DuiSubject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOnlyAccountCreated, setShowOnlyAccountCreated] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // 신규 계정 생성 폼 상태 (모달)
  const [form, setForm] = useState({
    licenseNumber: "",
    name: "",
    birthDate: "",
    phoneNumber: "",
  });

  // 목록 필터링 memo
  const filteredSubjects = useMemo(() => {
    if (!showOnlyAccountCreated) return subjects;
    return subjects.filter((s) => s.accountCreated);
  }, [subjects, showOnlyAccountCreated]);

  const fetchSubjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminDuiApi.getSubjects();
      if (res.success) {
        // API 응답 데이터를 그대로 사용 (accountCreated 포함)
        setSubjects(res.subjects.map(s => ({
          ...s,
          accountCreated: s.accountCreated || false
        })));
      } else {
        setError(res.errorMessage || "데이터를 가져오지 못했습니다.");
      }
    } catch (e: any) {
      setError(e?.message || "요청 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const handleCreateAccount = () => {
    // 간단한 유효성 검사
    if (!form.licenseNumber || !form.name) {
      toast.error("필수 항목을 입력하세요.");
      return;
    }
    // 실제 API 연동 전: subjects 목록에서 해당 licenseNumber 찾아 accountCreated 표시 또는 새 항목 추가
    setSubjects((prev) => {
      const exists = prev.find((p) => p.licenseNumber === form.licenseNumber);
      if (exists) {
        return prev.map((p) =>
          p.licenseNumber === form.licenseNumber
            ? { ...p, accountCreated: true }
            : p
        );
      }
      return [
        {
          licenseNumber: form.licenseNumber,
          name: form.name,
          birthDate: form.birthDate || "",
          address: "-",
          phoneNumber: form.phoneNumber || "",
          violationCount: 0,
          lastViolationDate: "-",
          accountCreated: true,
        },
        ...prev,
      ];
    });
    toast.success("계정이 생성되었습니다.");
    setIsCreateOpen(false);
    setForm({ licenseNumber: "", name: "", birthDate: "", phoneNumber: "" });
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          관리자 대시보드
        </h1>
        <p className="text-gray-600 mt-2">
          시스템 전체 통계 및 현황을 한눈에 확인하세요.
        </p>
      </div>

      {/* 통계 카드 그리드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 사용자</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              활성: {stats.activeUsers}명
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">등록 업체</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCompanies}</div>
            <p className="text-xs text-muted-foreground mt-1">제조·수리 업체</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">관리 장치</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDevices}</div>
            <p className="text-xs text-muted-foreground mt-1">전체 등록 장치</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">대기 요청</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.pendingRequests}
            </div>
            <p className="text-xs text-muted-foreground mt-1">처리 대기 중</p>
          </CardContent>
        </Card>
      </div>

      {/* 음주운전자 목록 섹션 */}
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>음주운전자 대상 목록</CardTitle>
            <CardDescription>
              TCS 연동 데이터 · 계정 생성/필터 가능
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <Button
              size="sm"
              variant="outline"
              onClick={fetchSubjects}
              disabled={isLoading}
            >
              <RefreshCcw className="h-4 w-4 mr-1" /> 새로고침
            </Button>
            <div className="flex items-center gap-2 border rounded-md px-3 py-1.5 text-xs bg-white">
              <Filter className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-gray-600">계정생성됨만</span>
              <input
                type="checkbox"
                className="h-4 w-4 accent-indigo-600 cursor-pointer"
                checked={showOnlyAccountCreated}
                onChange={(e) => setShowOnlyAccountCreated(e.target.checked)}
                aria-label="계정 생성됨만 보기"
              />
            </div>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" /> 계정 생성
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>음주운전자 계정 생성</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="grid gap-2">
                    <Label htmlFor="licenseNumber">면허번호 *</Label>
                    <Input
                      id="licenseNumber"
                      placeholder="예: 12-34-567890-11"
                      value={form.licenseNumber}
                      onChange={(e) =>
                        setForm((f) => ({
                          ...f,
                          licenseNumber: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name">이름 *</Label>
                    <Input
                      id="name"
                      placeholder="이름"
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                    />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="birthDate">생년월일</Label>
                      <Input
                        id="birthDate"
                        type="date"
                        value={form.birthDate}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, birthDate: e.target.value }))
                        }
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phoneNumber">전화번호</Label>
                      <Input
                        id="phoneNumber"
                        placeholder="010-0000-0000"
                        value={form.phoneNumber}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            phoneNumber: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <Separator />
                  <div className="text-xs text-gray-500 leading-relaxed">
                    실제 계정 생성 API 연동 전 임시 로컬 반영입니다. 면허번호가
                    기존 목록에 있으면 해당 레코드가 "계정 생성됨" 상태로
                    표시됩니다.
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateOpen(false)}
                  >
                    취소
                  </Button>
                  <Button onClick={handleCreateAccount}>생성</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="p-6 text-sm text-red-600 bg-red-50 rounded-md border border-red-200">
              {error}
            </div>
          ) : filteredSubjects.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-500">
              표시할 대상이 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[140px]">면허번호</TableHead>
                    <TableHead>이름</TableHead>
                    <TableHead className="hidden lg:table-cell">
                      생년월일
                    </TableHead>
                    <TableHead className="hidden xl:table-cell">
                      전화번호
                    </TableHead>
                    <TableHead className="hidden xl:table-cell">주소</TableHead>
                    <TableHead className="text-center">위반횟수</TableHead>
                    <TableHead className="hidden md:table-cell">
                      최종 위반일
                    </TableHead>
                    <TableHead className="text-center">계정</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSubjects.map((s) => (
                    <TableRow
                      key={s.licenseNumber}
                      className="hover:bg-gray-50/60"
                    >
                      <TableCell className="font-mono text-xs font-medium">
                        {s.licenseNumber}
                      </TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="hidden lg:table-cell text-xs text-gray-600">
                        {s.birthDate}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-xs text-gray-600">
                        {s.phoneNumber}
                      </TableCell>
                      <TableCell className="hidden xl:table-cell text-xs text-gray-600 max-w-[240px] truncate">
                        {s.address}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            s.violationCount >= 5
                              ? "destructive"
                              : s.violationCount >= 3
                              ? "default"
                              : "secondary"
                          }
                        >
                          {s.violationCount}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-xs text-gray-600">
                        {s.lastViolationDate}
                      </TableCell>
                      <TableCell className="text-center">
                        {s.accountCreated ? (
                          <Badge variant="default">생성됨</Badge>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSubjects((prev) =>
                                prev.map((p) =>
                                  p.licenseNumber === s.licenseNumber
                                    ? { ...p, accountCreated: true }
                                    : p
                                )
                              );
                              toast.success("계정 생성됨으로 표시했습니다.");
                            }}
                          >
                            계정 생성
                          </Button>
                        )}
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
