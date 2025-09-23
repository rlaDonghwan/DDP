'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getRedirectPath } from '@/lib/auth';

export default function Home() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated && user) {
      router.push(getRedirectPath(user.role));
    }
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-4xl font-bold text-blue-900 mb-4">
              음주운전 방지장치 시스템
            </CardTitle>
            <CardDescription className="text-xl text-gray-600">
              안전한 운전을 위한 통합 관리 플랫폼
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-8 leading-relaxed">
              음주운전 방지장치 이용자, 제조·수리 업체, 그리고 관리자를 위한
              <br />
              체계적이고 효율적인 통합 관리 시스템입니다.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">사용자 포털</h3>
                <p className="text-sm text-blue-700">
                  운행기록 제출, 검사 예약, 교육 신청 등 개인 사용자를 위한 서비스
                </p>
              </div>
              <div className="p-6 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">업체 포털</h3>
                <p className="text-sm text-green-700">
                  고객 관리, 예약 처리, 검사 결과 등록 등 업체를 위한 업무 도구
                </p>
              </div>
              <div className="p-6 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-900 mb-2">관리자 시스템</h3>
                <p className="text-sm text-purple-700">
                  통계 분석, 사용자 관리, 시스템 모니터링 등 관리자 기능
                </p>
              </div>
            </div>

            <Button 
              onClick={() => router.push('/login')}
              className="px-8 py-3 text-lg"
            >
              시스템 접속하기
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
