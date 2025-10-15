"use client";

import { useState } from "react";
import { useSession } from "@/features/auth/hooks/use-session";
import { useUserStatus } from "@/features/user/hooks/use-user-status";
import { useUploadLog } from "@/features/log/hooks/use-logs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  uploadLogSchema,
  type UploadLogInput,
} from "@/features/log/schemas/log-schema";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { Upload, FileText, Info } from "lucide-react";

/**
 * 운행기록 제출 페이지
 * 사용자가 음주운전 방지장치의 운행기록 파일을 업로드합니다
 */
export default function LogSubmitPage() {
  const router = useRouter();
  const { user } = useSession();
  const { data: status, isLoading: statusLoading } = useUserStatus();
  const uploadLogMutation = useUploadLog();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UploadLogInput>({
    resolver: zodResolver(uploadLogSchema),
    defaultValues: {
      deviceId: "",
      recordStartDate: "",
      recordEndDate: "",
    },
  });

  /**
   * 오늘 날짜 (YYYY-MM-DD 형식)
   */
  const today = new Date().toISOString().split("T")[0];

  /**
   * 파일 선택 핸들러
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setValue("file", file, { shouldValidate: true });
    }
  };

  /**
   * 폼 제출 핸들러
   */
  const onSubmit = async (data: UploadLogInput) => {
    if (!data.file) {
      return;
    }

    try {
      await uploadLogMutation.mutateAsync({
        deviceId: data.deviceId,
        recordStartDate: `${data.recordStartDate}T00:00:00`,
        recordEndDate: `${data.recordEndDate}T23:59:59`,
        file: data.file,
      });

      // 성공 시 제출 이력 페이지로 이동
      router.push("/user/logs");
    } catch (error) {
      // 에러는 훅에서 처리됨
    }
  };

  // 로딩 상태
  if (statusLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  // 장치 미설치
  if (!status?.deviceInstalled) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            운행기록 제출
          </h1>
          <p className="text-gray-600 mt-2">
            음주운전 방지장치의 운행기록을 제출합니다
          </p>
        </div>
        <Card>
          <CardContent className="py-20 text-center">
            <p className="text-red-600 mb-4">
              설치된 장치가 없습니다. 먼저 장치를 설치해주세요.
            </p>
            <Button onClick={() => router.push("/user/operators/search")}>
              업체 검색하기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          운행기록 제출
        </h1>
        <p className="text-gray-600 mt-2">
          음주운전 방지장치의 운행기록 파일을 업로드하세요
        </p>
      </div>

      {/* 안내 정보 */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>제출 안내</strong>
          <ul className="mt-2 space-y-1 text-sm">
            <li>• 지원 파일 형식: .log, .txt, .csv, .json</li>
            <li>• 최대 파일 크기: 50MB</li>
            <li>• 기록 기간을 정확히 입력해주세요</li>
            <li>• 제출된 파일은 관리자 검토 후 승인됩니다</li>
          </ul>
        </AlertDescription>
      </Alert>

      {/* 제출 폼 */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>운행기록 정보</CardTitle>
            <CardDescription>
              기록 기간과 파일을 선택하여 제출하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 장치 정보 (자동 입력) */}
            <div className="space-y-2">
              <Label>장치 정보</Label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm">
                  <span className="font-medium">모델:</span>{" "}
                  {status.deviceModel || "정보 없음"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">S/N:</span>{" "}
                  {status.deviceSerialNumber || "정보 없음"}
                </p>
              </div>
              <input
                type="hidden"
                {...register("deviceId")}
                value={status?.deviceSerialNumber || ""}
              />
            </div>

            {/* 기록 시작 날짜 */}
            <div className="space-y-2">
              <Label htmlFor="recordStartDate">기록 시작 날짜</Label>
              <Input
                id="recordStartDate"
                type="date"
                max={today}
                {...register("recordStartDate")}
              />
              {errors.recordStartDate && (
                <p className="text-sm text-red-600">
                  {errors.recordStartDate.message}
                </p>
              )}
            </div>

            {/* 기록 종료 날짜 */}
            <div className="space-y-2">
              <Label htmlFor="recordEndDate">기록 종료 날짜</Label>
              <Input
                id="recordEndDate"
                type="date"
                max={today}
                {...register("recordEndDate")}
              />
              {errors.recordEndDate && (
                <p className="text-sm text-red-600">
                  {errors.recordEndDate.message}
                </p>
              )}
            </div>

            {/* 파일 업로드 */}
            <div className="space-y-2">
              <Label htmlFor="file">운행기록 파일</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                <input
                  id="file"
                  type="file"
                  accept=".log,.txt,.csv,.json"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="file"
                  className="cursor-pointer flex flex-col items-center"
                >
                  {selectedFile ? (
                    <>
                      <FileText className="w-12 h-12 text-blue-600 mb-2" />
                      <p className="text-sm font-medium text-gray-900">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(selectedFile.size / 1024).toFixed(2)} KB
                      </p>
                      <Button
                        type="button"
                        variant="link"
                        size="sm"
                        className="mt-2"
                      >
                        다른 파일 선택
                      </Button>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-sm font-medium text-gray-700">
                        클릭하여 파일 선택
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        또는 파일을 드래그하여 업로드
                      </p>
                    </>
                  )}
                </label>
              </div>
              {errors.file && (
                <p className="text-sm text-red-600">{errors.file.message}</p>
              )}
            </div>

            {/* 제출 버튼 */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={uploadLogMutation.isPending}
                className="flex-1"
              >
                {uploadLogMutation.isPending ? "제출 중..." : "제출하기"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/user/logs")}
              >
                제출 이력 보기
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
