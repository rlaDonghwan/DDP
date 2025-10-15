"use client";

import { useUserProfile } from "@/features/user/hooks/use-user-profile";
import {
  useUpdateProfile,
  useChangePassword,
} from "@/features/user/hooks/use-update-profile";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema,
  changePasswordSchema,
  type UpdateProfileInput,
  type ChangePasswordInput,
} from "@/features/user/schemas/profile-schema";
import { useRouter } from "next/navigation";

/**
 * 개인정보 수정 페이지
 * 사용자의 연락처, 주소, 비밀번호를 변경할 수 있습니다
 */
export default function ProfileEditPage() {
  const router = useRouter();
  const { data: profile, isLoading } = useUserProfile();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();

  // 프로필 수정 폼
  const {
    register: registerProfile,
    handleSubmit: handleSubmitProfile,
    formState: { errors: profileErrors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      phone: profile?.phone || "",
      address: profile?.address || "",
    },
  });

  // 비밀번호 변경 폼
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  // 프로필 수정 핸들러
  const onSubmitProfile = async (data: UpdateProfileInput) => {
    try {
      await updateProfileMutation.mutateAsync(data);
    } catch (error) {
      // 에러는 훅에서 처리됨
    }
  };

  // 비밀번호 변경 핸들러
  const onSubmitPassword = async (data: ChangePasswordInput) => {
    try {
      await changePasswordMutation.mutateAsync(data);
      resetPasswordForm(); // 성공 시 폼 초기화
    } catch (error) {
      // 에러는 훅에서 처리됨
    }
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

  // 프로필 없음
  if (!profile) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">개인정보 수정</h1>
        <Card>
          <CardContent className="py-10">
            <p className="text-center text-red-600">
              프로필 정보를 불러올 수 없습니다
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            개인정보 수정
          </h1>
          <p className="text-gray-600 mt-2">
            개인정보와 비밀번호를 변경할 수 있습니다
          </p>
        </div>
        <Button variant="outline" onClick={() => router.back()}>
          뒤로가기
        </Button>
      </div>

      {/* 기본 정보 (읽기 전용) */}
      <Card>
        <CardHeader>
          <CardTitle>기본 정보</CardTitle>
          <CardDescription>이름과 이메일은 변경할 수 없습니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>이름</Label>
              <Input value={profile.name} disabled />
            </div>
            <div>
              <Label>이메일</Label>
              <Input value={profile.email} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 프로필 수정 */}
      <Card>
        <CardHeader>
          <CardTitle>연락처 및 주소 수정</CardTitle>
          <CardDescription>
            연락처와 주소 정보를 변경할 수 있습니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitProfile(onSubmitProfile)}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="phone">연락처</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="01012345678"
                  defaultValue={profile.phone}
                  {...registerProfile("phone")}
                />
                {profileErrors.phone && (
                  <p className="text-sm text-red-600 mt-1">
                    {profileErrors.phone.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="address">주소</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="서울특별시 강남구..."
                  defaultValue={profile.address}
                  {...registerProfile("address")}
                />
                {profileErrors.address && (
                  <p className="text-sm text-red-600 mt-1">
                    {profileErrors.address.message}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending ? "저장 중..." : "저장"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 비밀번호 변경 */}
      <Card>
        <CardHeader>
          <CardTitle>비밀번호 변경</CardTitle>
          <CardDescription>
            보안을 위해 주기적으로 비밀번호를 변경하세요
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">현재 비밀번호</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="현재 비밀번호를 입력하세요"
                  {...registerPassword("currentPassword")}
                />
                {passwordErrors.currentPassword && (
                  <p className="text-sm text-red-600 mt-1">
                    {passwordErrors.currentPassword.message}
                  </p>
                )}
              </div>
              <Separator />
              <div>
                <Label htmlFor="newPassword">새 비밀번호</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="새 비밀번호를 입력하세요"
                  {...registerPassword("newPassword")}
                />
                {passwordErrors.newPassword && (
                  <p className="text-sm text-red-600 mt-1">
                    {passwordErrors.newPassword.message}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  8-20자, 대소문자, 숫자, 특수문자 포함
                </p>
              </div>
              <div>
                <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="새 비밀번호를 다시 입력하세요"
                  {...registerPassword("confirmPassword")}
                />
                {passwordErrors.confirmPassword && (
                  <p className="text-sm text-red-600 mt-1">
                    {passwordErrors.confirmPassword.message}
                  </p>
                )}
              </div>
              <Button
                type="submit"
                variant="destructive"
                disabled={changePasswordMutation.isPending}
              >
                {changePasswordMutation.isPending
                  ? "변경 중..."
                  : "비밀번호 변경"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
