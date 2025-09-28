"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getRedirectPath } from "@/lib/auth";
import { Header } from "@/components/landing/header";
import { ShieldCheck, Users } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { login, isLoading } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      const user = useAuthStore.getState().user;
      if (user) router.push(getRedirectPath(user.role));
    } catch (err) {
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-white to-slate-100">
      <Header hideNav />
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid w-full max-w-5xl gap-10 lg:grid-cols-2 items-center">
          {/* Left marketing panel */}
          <div className="hidden lg:block space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                안전하고 신뢰할 수 있는
                <br />
                <span className="text-indigo-600">통합 운영 플랫폼</span>
              </h1>
              <p className="mt-4 text-lg text-gray-600 leading-relaxed">
                조건부 면허 대상자, 제조·수리 업체, 행정 담당자를 하나의
                흐름으로 연결합니다. 데이터 기반 의사결정과 효율적 운영을 지금
                시작하세요.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-xl border bg-white/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition">
                <Users className="h-6 w-6 text-indigo-600" />
                <h3 className="mt-3 font-semibold text-gray-900">
                  역할별 포털
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  사용자 · 업체 · 관리자 맞춤형 업무 화면
                </p>
              </div>
              <div className="rounded-xl border bg-white/70 backdrop-blur-sm p-5 shadow-sm hover:shadow-md transition">
                <ShieldCheck className="h-6 w-6 text-indigo-600" />
                <h3 className="mt-3 font-semibold text-gray-900">
                  보안/감사 추적
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  접근 제어 및 감사 로그로 신뢰성 확보
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500">© 2025 DDP Platform</p>
          </div>

          {/* Right form card */}
          <Card className="w-full shadow-lg border-indigo-100/60">
            <CardHeader className="space-y-3 text-center pb-6">
              <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
                시스템 로그인
              </CardTitle>
              <CardDescription className="text-sm text-gray-500">
                승인된 계정으로 접속하여 서비스를 이용하세요
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    이메일
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
                  <Label
                    htmlFor="password"
                    className="text-gray-700 font-medium"
                  >
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

                {error && (
                  <Alert variant="destructive" className="animate-shake">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold tracking-wide"
                  disabled={isLoading}
                >
                  {isLoading ? "로그인 중..." : "로그인"}
                </Button>

                <div className="pt-2 text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-md p-3 border">
                  <p className="font-semibold mb-1 text-gray-600">
                    테스트 계정
                  </p>
                  <div className="grid grid-cols-1 gap-1 font-mono">
                    <span>user@ddp.com / password</span>
                    <span>company@ddp.com / password</span>
                    <span>admin@ddp.com / password</span>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
