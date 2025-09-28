"use client";

// UI 전용 관리자 로그인 화면 (후속: 실제 인증 연동 시 로직 삽입)
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Header } from "@/components/landing/header";
import { ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function AdminLoginPage() {
  // 후속 백엔드 연동 시 상태/핸들러 교체 예정
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleDummySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제 구현 시:
    // 1. API 호출 (POST /api/auth/admin-login)
    // 2. 성공 -> 토큰/세션 저장 -> router.replace('/admin/dashboard')
    // 3. 실패 -> 에러 상태 표시
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-slate-100">
      <Header hideNav />
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-lg border-indigo-100/60">
          <CardHeader className="space-y-3 text-center pb-4">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
              관리자 전용 로그인
            </CardTitle>
            <CardDescription className="text-sm text-gray-500">
              향후 관리자 인증 API 연동 예정
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleDummySubmit} className="space-y-5" noValidate>
              <div className="space-y-2">
                <Label htmlFor="email" className="font-medium text-gray-700">
                  관리자 이메일
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@ddp.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="font-medium text-gray-700">
                  비밀번호
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11"
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-semibold"
              >
                관리자 로그인 (Mock)
              </Button>

              <p className="pt-2 text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-md p-3 border">
                현재는 UI 목업 상태입니다. 백엔드 연동 후 실제 인증 로직과 권한
                검증이 적용됩니다.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
