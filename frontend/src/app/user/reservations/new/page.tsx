"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useOperator } from "@/features/operator/hooks/use-operators";
import { useCreateReservation } from "@/features/reservation/hooks/use-reservations";
import {
  createReservationSchema,
  type CreateReservationInput,
} from "@/features/reservation/schemas/reservation-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import type { ReservationServiceType } from "@/features/reservation/types/reservation";

/**
 * 예약 신청 페이지
 * 사용자가 선택한 업체에 서비스 예약을 신청합니다
 */
export default function NewReservationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const operatorId = searchParams.get("operatorId");

  const { data: operator, isLoading: operatorLoading } =
    useOperator(operatorId || undefined);
  const createReservationMutation = useCreateReservation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateReservationInput>({
    resolver: zodResolver(createReservationSchema),
    defaultValues: {
      operatorId: operatorId || "",
      serviceType: undefined,
      reservationDate: "",
      reservationTime: "",
      notes: "",
    },
  });

  const serviceType = watch("serviceType");

  /**
   * 서비스 타입 한글 변환
   */
  const getServiceTypeLabel = (type: ReservationServiceType): string => {
    switch (type) {
      case "INSTALL":
        return "설치";
      case "REPAIR":
        return "수리";
      case "INSPECTION":
        return "검교정";
    }
  };

  /**
   * 오늘 날짜 (YYYY-MM-DD 형식)
   */
  const today = new Date().toISOString().split("T")[0];

  /**
   * 예약 가능한 시간대
   */
  const availableTimeSlots = [
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ];

  /**
   * 폼 제출 핸들러
   */
  const onSubmit = async (data: CreateReservationInput) => {
    try {
      // 날짜와 시간 결합 (ISO 8601 형식)
      const reservationDateTime = `${data.reservationDate}T${data.reservationTime}:00`;

      await createReservationMutation.mutateAsync({
        operatorId: data.operatorId,
        serviceType: data.serviceType,
        reservationDate: reservationDateTime,
        notes: data.notes,
      });

      // 성공 시 예약 내역 페이지로 이동
      router.push("/user/reservations");
    } catch (error) {
      // 에러는 훅에서 처리됨
    }
  };

  // operatorId가 없는 경우
  if (!operatorId) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          뒤로가기
        </Button>
        <Card>
          <CardContent className="py-20 text-center">
            <p className="text-red-600">업체 정보가 없습니다</p>
            <Button
              className="mt-4"
              onClick={() => router.push("/user/operators/search")}
            >
              업체 검색하기
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 로딩 상태
  if (operatorLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  // 업체 정보 없음
  if (!operator) {
    return (
      <div className="space-y-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          뒤로가기
        </Button>
        <Card>
          <CardContent className="py-20 text-center">
            <p className="text-red-600">업체 정보를 찾을 수 없습니다</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 뒤로가기 버튼 */}
      <Button variant="outline" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        뒤로가기
      </Button>

      {/* 페이지 헤더 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          예약 신청
        </h1>
        <p className="text-gray-600 mt-2">
          선택하신 업체에 서비스 예약을 신청합니다
        </p>
      </div>

      {/* 업체 정보 */}
      <Card>
        <CardHeader>
          <CardTitle>{operator.name}</CardTitle>
          <CardDescription>선택된 업체 정보</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500" />
            <span>{operator.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 flex-shrink-0 text-gray-500" />
            <span>{operator.phone}</span>
          </div>
          {operator.businessHours && (
            <p className="text-sm text-gray-600">
              영업시간: {operator.businessHours}
            </p>
          )}
        </CardContent>
      </Card>

      {/* 예약 신청 폼 */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>예약 정보</CardTitle>
            <CardDescription>
              서비스 타입, 날짜, 시간을 선택하고 예약을 신청하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 서비스 타입 선택 */}
            <div className="space-y-3">
              <Label>서비스 타입</Label>
              <RadioGroup
                value={serviceType}
                onValueChange={(value) =>
                  setValue(
                    "serviceType",
                    value as ReservationServiceType,
                    { shouldValidate: true }
                  )
                }
              >
                {operator.services.map((service) => (
                  <div
                    key={service}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem value={service} id={service} />
                    <Label htmlFor={service} className="cursor-pointer">
                      {getServiceTypeLabel(service)}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.serviceType && (
                <p className="text-sm text-red-600">
                  {errors.serviceType.message}
                </p>
              )}
            </div>

            {/* 날짜 선택 */}
            <div className="space-y-2">
              <Label htmlFor="reservationDate">예약 날짜</Label>
              <Input
                id="reservationDate"
                type="date"
                min={today}
                {...register("reservationDate")}
              />
              {errors.reservationDate && (
                <p className="text-sm text-red-600">
                  {errors.reservationDate.message}
                </p>
              )}
            </div>

            {/* 시간 선택 */}
            <div className="space-y-2">
              <Label htmlFor="reservationTime">예약 시간</Label>
              <Select
                onValueChange={(value) =>
                  setValue("reservationTime", value, { shouldValidate: true })
                }
              >
                <SelectTrigger id="reservationTime">
                  <SelectValue placeholder="시간을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {availableTimeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.reservationTime && (
                <p className="text-sm text-red-600">
                  {errors.reservationTime.message}
                </p>
              )}
            </div>

            {/* 요청사항 */}
            <div className="space-y-2">
              <Label htmlFor="notes">요청사항 (선택)</Label>
              <Textarea
                id="notes"
                placeholder="업체에 전달할 요청사항을 입력하세요"
                rows={4}
                {...register("notes")}
              />
              {errors.notes && (
                <p className="text-sm text-red-600">{errors.notes.message}</p>
              )}
              <p className="text-xs text-gray-500">최대 500자</p>
            </div>

            {/* 제출 버튼 */}
            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={createReservationMutation.isPending}
                className="flex-1"
              >
                {createReservationMutation.isPending
                  ? "예약 신청 중..."
                  : "예약 신청"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                취소
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
