'use client';

import { useState } from 'react';
import { useAuthStore } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users, Calendar, CheckCircle, Clock, AlertTriangle, FileText, TrendingUp } from 'lucide-react';
import { format, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function CompanyDashboard() {
  const { user } = useAuthStore();
  
  const [todayTasks] = useState([
    {
      id: '1',
      type: '검사',
      customerName: '김철수',
      time: '09:00',
      status: 'pending' as const,
      deviceModel: 'DDP-2024A',
    },
    {
      id: '2',
      type: '수리',
      customerName: '이영희',
      time: '10:30',
      status: 'in_progress' as const,
      deviceModel: 'DDP-2023B',
    },
    {
      id: '3',
      type: '교육',
      customerName: '박민준',
      time: '14:00',
      status: 'completed' as const,
      note: '초기 교육 완료',
    },
    {
      id: '4',
      type: '검사',
      customerName: '정수연',
      time: '15:30',
      status: 'pending' as const,
      deviceModel: 'DDP-2024A',
    },
  ]);

  const [weeklyStats] = useState({
    totalBookings: 28,
    completedTasks: 23,
    pendingTasks: 5,
    revenue: 2840000,
  });

  const [recentCustomers] = useState([
    {
      id: '1',
      name: '김철수',
      phone: '010-1234-5678',
      deviceModel: 'DDP-2024A',
      lastVisit: new Date(2024, 8, 10),
      status: 'active' as const,
    },
    {
      id: '2',
      name: '이영희',
      phone: '010-9876-5432',
      deviceModel: 'DDP-2023B',
      lastVisit: new Date(2024, 8, 8),
      status: 'pending' as const,
    },
  ]);

  const getTaskStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">완료</Badge>;
      case 'in_progress':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">진행중</Badge>;
      case 'pending':
        return <Badge variant="secondary">대기</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const getCustomerStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800">정상</Badge>;
      case 'pending':
        return <Badge variant="secondary">처리중</Badge>;
      case 'inactive':
        return <Badge variant="outline">비활성</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const pendingTasksCount = todayTasks.filter(task => task.status === 'pending').length;
  const completedTasksCount = todayTasks.filter(task => task.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">업체 대시보드</h1>
        <p className="text-muted-foreground">
          안녕하세요, {user?.name}님
        </p>
      </div>

      {/* 긴급 알림 */}
      {pendingTasksCount > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>오늘 처리해야 할 업무가 {pendingTasksCount}건 있습니다.</strong>
            일정을 확인하고 고객에게 안내해주세요.
          </AlertDescription>
        </Alert>
      )}

      {/* 주요 통계 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이번 주 예약</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyStats.totalBookings}건</div>
            <p className="text-xs text-muted-foreground">
              +4건 지난주 대비
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">완료된 업무</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{weeklyStats.completedTasks}건</div>
            <p className="text-xs text-green-600">
              82% 완료율
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">대기중 업무</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{weeklyStats.pendingTasks}건</div>
            <p className="text-xs text-orange-600">
              처리 필요
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이번 주 매출</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(weeklyStats.revenue / 10000).toFixed(0)}만원
            </div>
            <p className="text-xs text-muted-foreground">
              +12% 증가
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* 오늘 처리할 업무 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              오늘 처리할 업무
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="font-mono text-sm font-medium">
                    {task.time}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{task.type}</h4>
                      <Badge variant="outline">{task.customerName}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {task.deviceModel && `${task.deviceModel} | `}
                      {task.note}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getTaskStatusBadge(task.status)}
                  <Button variant="ghost" size="sm">
                    처리
                  </Button>
                </div>
              </div>
            ))}
            {todayTasks.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                오늘 예정된 업무가 없습니다.
              </div>
            )}
          </CardContent>
        </Card>

        {/* 최근 고객 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              최근 고객
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentCustomers.map((customer) => (
              <div key={customer.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{customer.name}</h4>
                      {getCustomerStatusBadge(customer.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {customer.phone} • {customer.deviceModel}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      최종 방문: {format(customer.lastVisit, 'MM월 dd일', { locale: ko })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    상세보기
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              전체 고객 보기
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 주간 업무 요약 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            이번 주 업무 요약
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">검사 업무</h4>
              <p className="text-2xl font-bold text-blue-700">15건</p>
              <p className="text-sm text-blue-600">정기검사 12건, 특별검사 3건</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">수리 업무</h4>
              <p className="text-2xl font-bold text-green-700">8건</p>
              <p className="text-sm text-green-600">장치 수리 6건, 교체 2건</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">교육 업무</h4>
              <p className="text-2xl font-bold text-purple-700">5건</p>
              <p className="text-sm text-purple-600">초기교육 3건, 보수교육 2건</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}