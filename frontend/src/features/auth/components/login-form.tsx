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
 * 로그인 폼 컴포넌트
 */
interface LoginFormProps {
  userType: "admin" | "user";
}

export function LoginForm({ userType }: LoginFormProps) {
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
        const actualRole =
          (response as any).normalizedRole || response.role.toLowerCase();

        // 역할 검증: userType과 실제 로그인한 역할이 일치하는지 확인 (대소문자 무시)
        if (userType === "admin" && actualRole !== "admin") {
          toast.error("로그인 실패", {
            description:
              "관리자 계정이 아닙니다. 일반 로그인 페이지를 이용해주세요.",
          });
          setIsLoading(false);
          return;
        }
        if (userType === "user" && actualRole === "admin") {
          toast.error("로그인 실패", {
            description: "관리자 계정은 관리자 로그인 페이지를 이용해주세요.",
          });
          setIsLoading(false);
          return;
        }

        // 로그인 성공 Toast 표시
        toast.success("로그인 성공", {
          description: `${response.name}님, 환영합니다!`,
        });

        // 역할에 따라 리다이렉트
        const redirectPath = getRedirectPath(actualRole as any);

        // 지연 후 페이지 이동 (쿠키 저장 대기 + Toast 표시 시간 확보)
        setTimeout(() => {
          router.push(redirectPath);
        }, 1000);
      } else {
        // 로그인 실패 Toast 표시 (비밀번호 틀림, 계정 없음 등)
        toast.error("로그인 실패", {
          description:
            response.message || "이메일 또는 비밀번호를 확인해주세요",
        });
      }
    } catch (err) {
      // 예외 발생 시 Toast 표시 (네트워크 오류 등)
      toast.error("로그인 오류", {
        description:
          "로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      });
      console.error("로그인 오류:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // userType에 따른 UI 설정
  const config = {
    admin: {
      icon: "A",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      title: "관리자 로그인",
      description: "관리자 권한으로 시스템에 접속합니다",
      placeholder: "admin@ddp.com",
    },
    user: {
      icon: "U",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      title: "사용자 로그인",
      description: "승인된 계정으로 접속하여 서비스를 이용하세요",
      placeholder: "user@ddp.com",
    },
  }[userType];

  return (
    <Card className="w-full max-w-md shadow-lg border-indigo-100/60">
      <CardHeader className="space-y-3 text-center pb-4">
        <div
          className={`mx-auto h-12 w-12 flex items-center justify-center rounded-full ${config.iconBg} ${config.iconColor}`}
        >
          <span className="text-2xl font-bold">{config.icon}</span>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-gray-900">
          {config.title}
        </CardTitle>
        <CardDescription className="text-sm text-gray-500">
          {config.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="font-medium text-gray-700">
              이메일
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={config.placeholder}
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

          {userType === "user" && (
            <div className="pt-4 border-t space-y-3">
              <p className="text-sm text-center text-gray-600">
                아직 계정이 없으신가요?
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full h-11 text-base font-semibold"
                onClick={() => router.push("/register")}
                disabled={isLoading}
              >
                회원가입
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
