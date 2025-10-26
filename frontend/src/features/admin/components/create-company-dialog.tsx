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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Shield, UserCircle, MapPin } from "lucide-react";
import {
  createCompanySchema,
  type CreateCompanyFormData,
} from "../schemas/company-schema";
import { companiesApi } from "../api/companies-api";
import { useQueryClient } from "@tanstack/react-query";
import AddressSearchModal from "@/components/shared/address-search-modal";

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
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressData, setAddressData] = useState<{
    zipcode?: string;
    address?: string;
    addressDetail?: string;
  }>({});

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
   * 주소에서 지역 추출 함수
   */
  const extractRegionFromAddress = (address: string): string => {
    const match = address.match(
      /^(서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주)/
    );
    return match ? match[1] : "기타";
  };

  /**
   * 주소 선택 핸들러
   */
  const handleAddressSelect = (data: {
    address?: string;
    addressDetail?: string;
    zipcode?: string;
  }) => {
    setAddressData(data);

    // address와 region 필드 자동 설정
    if (data.address) {
      const fullAddress = `${data.zipcode || ""} ${data.address} ${
        data.addressDetail || ""
      }`.trim();
      setValue("address", fullAddress);

      // 주소에서 지역 자동 추출
      const region = extractRegionFromAddress(data.address);
      setValue("region", region);
    }
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
                  <Label className="text-sm font-medium">
                    주소 <span className="text-red-600">*</span>
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="주소 검색 버튼을 클릭하세요"
                      value={
                        addressData.address
                          ? `${addressData.zipcode || ""} ${
                              addressData.address
                            } ${addressData.addressDetail || ""}`.trim()
                          : ""
                      }
                      readOnly
                      className="bg-gray-50 flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddressModalOpen(true)}
                      className="bg-Navy text-black hover:bg-Navy hover:opacity-90"
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      주소 검색
                    </Button>
                  </div>
                  {errors.address && (
                    <p className="text-sm text-red-600">
                      {errors.address.message}
                    </p>
                  )}
                  {addressData.address && (
                    <p className="text-xs text-gray-500">
                      지역: {watch("region")} (자동 추출)
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

      {/* 주소 검색 모달 */}
      <AddressSearchModal
        open={isAddressModalOpen}
        onOpenChange={setIsAddressModalOpen}
        initialAddress={addressData.address}
        onSelect={handleAddressSelect}
      />
    </Dialog>
  );
}
