"use client";

import {
  useCompanyProfile,
  useUpdateCompanyProfile,
} from "@/features/company/hooks/use-company";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateCompanyProfileSchema,
  type UpdateCompanyProfileInput,
} from "@/features/company/schemas/company-schema";
import { Building2, Phone, Mail, MapPin, Clock, Star } from "lucide-react";
import { useEffect } from "react";

/**
 * 업체 프로필 수정 페이지
 */
export default function CompanyProfilePage() {
  const { data: profile, isLoading } = useCompanyProfile();
  const updateMutation = useUpdateCompanyProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateCompanyProfileInput>({
    resolver: zodResolver(updateCompanyProfileSchema),
  });

  // 프로필 데이터 로드 시 폼 초기화
  useEffect(() => {
    if (profile) {
      reset({
        phone: profile.phone,
        email: profile.email,
        address: profile.address,
        detailAddress: profile.detailAddress,
        businessHours: profile.businessHours,
        description: profile.description,
      });
    }
  }, [profile, reset]);

  /**
   * 프로필 수정 처리
   */
  const onSubmit = async (data: UpdateCompanyProfileInput) => {
    await updateMutation.mutateAsync(data);
  };

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500">업체 정보를 불러올 수 없습니다</p>
      </div>
    );
  }

  /**
   * 인증 상태 뱃지
   */
  const getCertificationBadge = () => {
    const styles = {
      CERTIFIED: { variant: "default" as const, text: "인증됨" },
      PENDING: { variant: "secondary" as const, text: "인증 대기" },
      EXPIRED: { variant: "destructive" as const, text: "인증 만료" },
    };
    const config = styles[profile.certificationStatus];
    return <Badge variant={config.variant}>{config.text}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          업체 정보
        </h1>
        <p className="text-gray-600 mt-2">업체 정보를 확인하고 수정합니다</p>
      </div>

      {/* 업체 기본 정보 (읽기 전용) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            기본 정보
          </CardTitle>
          <CardDescription>업체의 기본 정보입니다 (수정 불가)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-600">업체명</Label>
              <p className="text-lg font-semibold text-gray-900">
                {profile.name}
              </p>
            </div>
            <div>
              <Label className="text-gray-600">사업자등록번호</Label>
              <p className="text-lg font-semibold text-gray-900">
                {profile.businessNumber}
              </p>
            </div>
            <div>
              <Label className="text-gray-600">대표자명</Label>
              <p className="text-lg font-semibold text-gray-900">
                {profile.representativeName}
              </p>
            </div>
            <div>
              <Label className="text-gray-600 flex items-center gap-1">
                인증 상태
              </Label>
              <div className="mt-1">{getCertificationBadge()}</div>
              {profile.certificationNumber && (
                <p className="text-sm text-gray-500 mt-1">
                  인증번호: {profile.certificationNumber}
                </p>
              )}
            </div>
          </div>

          {/* 통계 정보 */}
          <div className="pt-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600">평균 평점</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {profile.rating.toFixed(1)} / 5.0
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">총 리뷰</p>
                <p className="text-lg font-semibold text-gray-900">
                  {profile.reviewCount}건
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">총 설치</p>
                <p className="text-lg font-semibold text-gray-900">
                  {profile.totalInstallations}대
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 수정 가능한 정보 */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>연락처 및 주소</CardTitle>
            <CardDescription>
              업체 연락처와 주소를 수정할 수 있습니다
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                전화번호
              </Label>
              <Input id="phone" type="tel" {...register("phone")} />
              {errors.phone && (
                <p className="text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                이메일
              </Label>
              <Input id="email" type="email" {...register("email")} />
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                주소
              </Label>
              <Input id="address" {...register("address")} />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="detailAddress">상세 주소</Label>
              <Input
                id="detailAddress"
                {...register("detailAddress")}
                placeholder="동, 호수 등"
              />
              {errors.detailAddress && (
                <p className="text-sm text-red-600">
                  {errors.detailAddress.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              영업 시간
            </CardTitle>
            <CardDescription>업체의 영업 시간을 입력하세요</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weekday">평일</Label>
              <Input
                id="weekday"
                {...register("businessHours.weekday")}
                placeholder="예: 09:00 - 18:00"
              />
              {errors.businessHours?.weekday && (
                <p className="text-sm text-red-600">
                  {errors.businessHours.weekday.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="weekend">주말</Label>
              <Input
                id="weekend"
                {...register("businessHours.weekend")}
                placeholder="예: 10:00 - 15:00"
              />
              {errors.businessHours?.weekend && (
                <p className="text-sm text-red-600">
                  {errors.businessHours.weekend.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="holiday">공휴일</Label>
              <Input
                id="holiday"
                {...register("businessHours.holiday")}
                placeholder="예: 휴무"
              />
              {errors.businessHours?.holiday && (
                <p className="text-sm text-red-600">
                  {errors.businessHours.holiday.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>업체 소개</CardTitle>
            <CardDescription>
              업체를 소개하는 내용을 작성하세요 (최대 500자)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              {...register("description")}
              placeholder="업체의 특징, 강점, 서비스 내용 등을 자유롭게 작성하세요"
              className="min-h-[150px]"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-2">
                {errors.description.message}
              </p>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={!isDirty}
          >
            취소
          </Button>
          <Button type="submit" disabled={!isDirty || updateMutation.isPending}>
            {updateMutation.isPending ? "저장 중..." : "저장"}
          </Button>
        </div>
      </form>
    </div>
  );
}
