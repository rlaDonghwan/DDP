"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { loginSchema, type LoginFormData } from "../schemas";
import { authApi, getRedirectPath } from "../api";

/**
 * 통합 로그인 폼 컴포넌트 (모든 역할 지원)
 */
export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /**
   * 로그인 제출 핸들러
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authApi.login(data);

      if (response.success && response.user) {
        // 역할에 따라 리다이렉트
        const redirectPath = getRedirectPath(response.user.role);
        router.push(redirectPath);
      } else {
        setError(response.message || "로그인에 실패했습니다");
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다");
      console.error("로그인 오류:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg border-indigo-100/60">
      <CardHeader className="space-y-3 text-center pb-4">
        <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
          <span className="text-2xl font-bold">A</span>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
          시스템 로그인
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          승인된 계정으로 접속하여 서비스를 이용하세요
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="font-medium text-gray-700">
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="admin@ddp.com"
              {...register("email")}
              className="h-11"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="font-medium text-gray-700">
              비밀번호
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
              className="h-11"
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-red-600">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 text-base font-semibold"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}