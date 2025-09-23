'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Calendar, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';

export default function UserDashboard() {
  const { user } = useAuthStore();
  const [nextInspectionDate] = useState(addDays(new Date(), 7));
  const [pendingRecords] = useState(2);
  const [totalRecords] = useState(28);
  const [upcomingBookings] = useState([
    {
      id: '1',
      type: '정기 검사',
      date: addDays(new Date(), 3),
      company: 'ABC 정비소',
      status: 'confirmed' as const,
    },
    {
      id: '2',
      type: '교육 이수',
      date: addDays(new Date(), 10),
      company: 'DEF 교육센터',
      status: 'pending' as const,
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">대시보드</h1>
        <p className="text-muted-foreground">
          안녕하세요, {user?.name}님
        </p>
      </div>

      {/* 긴급 알림 */}
      <div className="grid gap-4">
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>D-{Math.ceil((nextInspectionDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} 다음 정기 검사</strong>
            : {format(nextInspectionDate, 'yyyy년 MM월 dd일 (EEE)', { locale: ko })}
          </AlertDescription>
        </Alert>
        
        {pendingRecords > 0 && (
          <Alert className="border-red-200 bg-red-50">
            <FileText className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>제출하지 않은 운행기록이 {pendingRecords}건 있습니다.</strong> 빠른 시일 내에 제출해주세요.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* 주요 통계 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이번 달 운행기록</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRecords}건</div>
            <p className="text-xs text-muted-foreground">
              +2건 지난달 대비
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">미제출 기록</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{pendingRecords}건</div>
            <p className="text-xs text-red-600">
              즉시 제출 필요
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">다음 검사까지</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7일</div>
            <p className="text-xs text-muted-foreground">
              정기 검사 예정
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">준수율</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">96%</div>
            <p className="text-xs text-green-600">
              매우 양호
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 할 일 목록 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            다음에 할 일
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-red-500" />
              <div>
                <h4 className="font-medium">운행기록 제출</h4>
                <p className="text-sm text-muted-foreground">
                  {pendingRecords}건의 미제출 기록이 있습니다
                </p>
              </div>
            </div>
            <Button size="sm">제출하기</Button>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <h4 className="font-medium">정기 검사 예약</h4>
                <p className="text-sm text-muted-foreground">
                  {format(nextInspectionDate, 'MM월 dd일까지', { locale: ko })} 예약 필요
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline">예약하기</Button>
          </div>
        </CardContent>
      </Card>

      {/* 예약 현황 */}
      <Card>
        <CardHeader>
          <CardTitle>예정된 예약</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{booking.type}</h4>
                      <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                        {booking.status === 'confirmed' ? '확정' : '대기중'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(booking.date, 'yyyy년 MM월 dd일 (EEE)', { locale: ko })} • {booking.company}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  상세보기
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}