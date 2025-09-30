"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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

      const response = await authApi.login(data);

      if (response.success && response.name && response.role) {
        // 로그인 성공 Toast 표시
        toast.success("로그인 성공", {
          description: `${response.name}님, 환영합니다!`,
        });

        // 역할에 따라 리다이렉트
        const redirectPath = getRedirectPath(response.role as any);
        router.push(redirectPath);
      } else {
        // 로그인 실패 Toast 표시 (비밀번호 틀림, 계정 없음 등)
        toast.error("로그인 실패", {
          description: response.message || "이메일 또는 비밀번호를 확인해주세요",
        });
      }
    } catch (err) {
      // 예외 발생 시 Toast 표시 (네트워크 오류 등)
      toast.error("로그인 오류", {
        description: "로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
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