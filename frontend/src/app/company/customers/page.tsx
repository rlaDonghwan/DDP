"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Users,
  Search,
  Filter,
  Eye,
  Phone,
  Mail,
  Calendar,
  MapPin,
  FileText,
} from "lucide-react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const mockCustomers = [
  {
    id: "1",
    name: "김철수",
    phone: "010-1234-5678",
    email: "kim@example.com",
    address: "서울시 강남구 테헤란로 123",
    deviceModel: "DDP-2024A",
    deviceSerial: "DD24A001234",
    installDate: new Date(2024, 0, 15),
    lastInspection: new Date(2024, 7, 15),
    nextInspection: new Date(2024, 11, 15),
    status: "active" as const,
    violationCount: 0,
    educationStatus: "completed" as const,
  },
  {
    id: "2",
    name: "이영희",
    phone: "010-9876-5432",
    email: "lee@example.com",
    address: "서울시 서초구 강남대로 456",
    deviceModel: "DDP-2023B",
    deviceSerial: "DD23B005678",
    installDate: new Date(2023, 5, 20),
    lastInspection: new Date(2024, 6, 20),
    nextInspection: new Date(2024, 9, 20),
    status: "warning" as const,
    violationCount: 1,
    educationStatus: "required" as const,
  },
  {
    id: "3",
    name: "박민준",
    phone: "010-5555-1234",
    email: "park@example.com",
    address: "경기도 성남시 분당구 정자로 789",
    deviceModel: "DDP-2024A",
    deviceSerial: "DD24A001235",
    installDate: new Date(2024, 2, 10),
    lastInspection: new Date(2024, 8, 10),
    nextInspection: new Date(2025, 2, 10),
    status: "active" as const,
    violationCount: 0,
    educationStatus: "completed" as const,
  },
];

export default function CustomersPage() {
  const [customers] = useState(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<
    (typeof mockCustomers)[0] | null
  >(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            정상
          </Badge>
        );
      case "warning":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            주의
          </Badge>
        );
      case "inactive":
        return <Badge variant="outline">비활성</Badge>;
      case "violation":
        return <Badge variant="destructive">위반</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getEducationStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            완료
          </Badge>
        );
      case "required":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-800">
            필요
          </Badge>
        );
      case "in_progress":
        return <Badge variant="outline">진행중</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.deviceSerial.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCustomerDetail = (customer: (typeof mockCustomers)[0]) => {
    setSelectedCustomer(customer);
    setIsDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">고객 관리</h1>
        <Button className="gap-2">
          <Users className="h-4 w-4" />새 고객 등록
        </Button>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">고객 검색</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="고객명, 전화번호, 장치번호로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="active">정상</SelectItem>
                <SelectItem value="warning">주의</SelectItem>
                <SelectItem value="violation">위반</SelectItem>
                <SelectItem value="inactive">비활성</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 고객 현황 */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 고객</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}명</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">정상 고객</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {customers.filter((c) => c.status === "active").length}명
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">주의 고객</CardTitle>
            <Users className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {customers.filter((c) => c.status === "warning").length}명
            </div>
          </CardContent>
        </Card>

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">위반 고객</CardTitle>
            <Users className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {customers.filter((c) => c.status === "violation").length}명
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* 고객 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            고객 목록 ({filteredCustomers.length}명)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>고객명</TableHead>
                <TableHead>연락처</TableHead>
                <TableHead>장치 정보</TableHead>
                <TableHead>설치일</TableHead>
                <TableHead>다음 검사</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>교육</TableHead>
                <TableHead>위반횟수</TableHead>
                <TableHead className="text-right">작업</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{customer.deviceModel}</div>
                      <div className="text-sm text-muted-foreground font-mono">
                        {customer.deviceSerial}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(customer.installDate, "yyyy.MM.dd", { locale: ko })}
                  </TableCell>
                  <TableCell>
                    {format(customer.nextInspection, "yyyy.MM.dd", {
                      locale: ko,
                    })}
                  </TableCell>
                  <TableCell>{getStatusBadge(customer.status)}</TableCell>
                  <TableCell>
                    {getEducationStatusBadge(customer.educationStatus)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        customer.violationCount > 0
                          ? "text-red-600 font-medium"
                          : ""
                      }
                    >
                      {customer.violationCount}회
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCustomerDetail(customer)}
                      className="gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      상세
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 고객 상세 정보 다이얼로그 */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>고객 상세 정보</DialogTitle>
            <DialogDescription>
              {selectedCustomer?.name}님의 상세 정보
            </DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* 기본 정보 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      기본 정보
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">고객명</Label>
                      <p>{selectedCustomer.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">연락처</Label>
                      <p>{selectedCustomer.phone}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">이메일</Label>
                      <p>{selectedCustomer.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">주소</Label>
                      <p className="text-sm">{selectedCustomer.address}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* 장치 정보 */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      장치 정보
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">장치 모델</Label>
                      <p>{selectedCustomer.deviceModel}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">시리얼 번호</Label>
                      <p className="font-mono">
                        {selectedCustomer.deviceSerial}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">설치일</Label>
                      <p>
                        {format(
                          selectedCustomer.installDate,
                          "yyyy년 MM월 dd일",
                          { locale: ko }
                        )}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">상태</Label>
                      <div>{getStatusBadge(selectedCustomer.status)}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* 검사 및 교육 정보 */}
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      검사 이력
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">최근 검사</Label>
                      <p>
                        {format(
                          selectedCustomer.lastInspection,
                          "yyyy년 MM월 dd일",
                          { locale: ko }
                        )}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">
                        다음 검사 예정
                      </Label>
                      <p>
                        {format(
                          selectedCustomer.nextInspection,
                          "yyyy년 MM월 dd일",
                          { locale: ko }
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">교육 및 위반</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">교육 상태</Label>
                      <div>
                        {getEducationStatusBadge(
                          selectedCustomer.educationStatus
                        )}
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">위반 횟수</Label>
                      <p
                        className={
                          selectedCustomer.violationCount > 0
                            ? "text-red-600 font-medium"
                            : ""
                        }
                      >
                        {selectedCustomer.violationCount}회
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailDialogOpen(false)}
            >
              닫기
            </Button>
            <Button>편집</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Label({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`text-sm font-medium text-muted-foreground mb-1 ${className}`}
    >
      {children}
    </div>
  );
}
