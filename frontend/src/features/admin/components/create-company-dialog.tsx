"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Shield, UserCircle } from "lucide-react";
import {
  createCompanySchema,
  type CreateCompanyFormData,
} from "../schemas/company-schema";
import { companiesApi } from "../api/companies-api";
import { useQueryClient } from "@tanstack/react-query";

interface CreateCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * 업체 등록 다이얼로그 컴포넌트
 * 관리자가 새로운 업체를 시스템에 등록합니다
 */
export function CreateCompanyDialog({
  open,
  onOpenChange,
}: CreateCompanyDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateCompanyFormData>({
    resolver: zodResolver(createCompanySchema),
  });

  /**
   * 사업자번호 자동 포맷 함수
   */
  const formatBusinessNumber = (value: string): string => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, "");

    // 길이에 따라 포맷 적용: 123-45-67890
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 5) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(
        5,
        10
      )}`;
    }
  };

  /**
   * 사업자번호 입력 핸들러
   */
  const handleBusinessNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const formatted = formatBusinessNumber(e.target.value);
    setValue("businessNumber", formatted);
  };

  /**
   * 전화번호 자동 포맷 함수
   */
  const formatPhoneNumber = (value: string): string => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, "");

    // 길이에 따라 포맷 적용
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 6) {
      // 02-1234 형식 또는 010-123 형식
      if (numbers.startsWith("02")) {
        return `${numbers.slice(0, 2)}-${numbers.slice(2)}`;
      }
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length <= 10) {
      // 02-1234-5678 형식 또는 010-1234-567 형식
      if (numbers.startsWith("02")) {
        return `${numbers.slice(0, 2)}-${numbers.slice(2, 6)}-${numbers.slice(
          6
        )}`;
      }
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
        7
      )}`;
    } else {
      // 010-1234-5678 형식
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
        7,
        11
      )}`;
    }
  };

  /**
   * 전화번호 입력 핸들러
   */
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue("phone", formatted);
  };

  /**
   * 폼 제출 핸들러
   */
  const onSubmit = async (data: CreateCompanyFormData) => {
    try {
      setIsSubmitting(true);
      await companiesApi.createCompany(data);

      // 성공 시 목록 새로고침
      queryClient.invalidateQueries({ queryKey: ["admin", "companies"] });

      // 다이얼로그 닫기 및 폼 리셋
      onOpenChange(false);
      reset();

      // 성공 토스트
      toast.success("업체가 성공적으로 등록되었습니다.");
    } catch (error) {
      console.error("업체 등록 실패:", error);
      // 실패 토스트
      toast.error("업체 등록에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * 다이얼로그 닫기 핸들러
   */
  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Building2 className="h-6 w-6 text-blue-600" />새 업체 등록
            </DialogTitle>
            <DialogDescription>
              오프라인 심사를 통과한 업체의 정보를 입력하여 시스템에 등록합니다
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-6">
            {/* 기본 정보 */}
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2 text-blue-900">
                  <Building2 className="h-5 w-5" />
                  기본 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      업체명 <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="name"
                      {...register("name")}
                      placeholder="예: 한국음주방지시스템"
                      className="bg-white"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="businessNumber"
                      className="text-sm font-medium"
                    >
                      사업자번호 <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="businessNumber"
                      {...register("businessNumber")}
                      onChange={handleBusinessNumberChange}
                      placeholder="123-45-67890"
                      className="bg-white font-mono"
                    />
                    {errors.businessNumber && (
                      <p className="text-sm text-red-600">
                        {errors.businessNumber.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="representativeName"
                      className="text-sm font-medium"
                    >
                      대표자명 <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="representativeName"
                      {...register("representativeName")}
                      placeholder="홍길동"
                      className="bg-white"
                    />
                    {errors.representativeName && (
                      <p className="text-sm text-red-600">
                        {errors.representativeName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      이메일 <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      placeholder="example@company.com"
                      className="bg-white"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">
                      전화번호 <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      onChange={handlePhoneChange}
                      placeholder="02-1234-5678"
                      className="bg-white"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="region" className="text-sm font-medium">
                      지역 <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="region"
                      {...register("region")}
                      placeholder="예: 서울"
                      className="bg-white"
                    />
                    {errors.region && (
                      <p className="text-sm text-red-600">
                        {errors.region.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    주소 <span className="text-red-600">*</span>
                  </Label>
                  <Textarea
                    id="address"
                    {...register("address")}
                    placeholder="서울특별시 강남구..."
                    rows={2}
                    className="bg-white resize-none"
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600">
                      {errors.address.message}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 초기 계정 정보 */}
            <Card className="border-purple-200 bg-purple-50/30">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center gap-2 text-purple-900">
                  <UserCircle className="h-5 w-5" />
                  초기 계정 정보
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 bg-white p-3 rounded-md border border-purple-200">
                  <Shield className="h-4 w-4 inline mr-2 text-purple-600" />
                  업체가 시스템에 로그인할 수 있는 초기 계정을 생성합니다.
                  업체에 전달 후 변경을 권장합니다.
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="initialAccountId"
                      className="text-sm font-medium"
                    >
                      초기 계정 ID <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="initialAccountId"
                      {...register("initialAccountId")}
                      placeholder="예: company123"
                      className="bg-white"
                    />
                    {errors.initialAccountId && (
                      <p className="text-sm text-red-600">
                        {errors.initialAccountId.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="initialPassword"
                        className="text-sm font-medium"
                      >
                        비밀번호 <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="initialPassword"
                        type="password"
                        {...register("initialPassword")}
                        placeholder="8자 이상, 대소문자, 숫자, 특수문자 포함"
                        className="bg-white"
                      />
                      {errors.initialPassword && (
                        <p className="text-sm text-red-600">
                          {errors.initialPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="passwordConfirm"
                        className="text-sm font-medium"
                      >
                        비밀번호 확인 <span className="text-red-600">*</span>
                      </Label>
                      <Input
                        id="passwordConfirm"
                        type="password"
                        {...register("passwordConfirm")}
                        placeholder="비밀번호 재입력"
                        className="bg-white"
                      />
                      {errors.passwordConfirm && (
                        <p className="text-sm text-red-600">
                          {errors.passwordConfirm.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button type="submit" disabled={isSubmitting} className="min-w-24">
              {isSubmitting ? "등록 중..." : "등록"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
