"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
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
import { CheckCircle2, ChevronRight, Loader2 } from "lucide-react";
import { authApi } from "../api";

// 단계별 스키마 정의
const phoneVerificationSchema = z.object({
  phoneNumber: z
    .string()
    .min(1, "전화번호를 입력해주세요")
    .regex(
      /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/,
      "올바른 전화번호 형식이 아닙니다"
    ),
  verificationCode: z.string().optional(),
});

const licenseVerificationSchema = z.object({
  licenseNumber: z
    .string()
    .min(1, "면허번호를 입력해주세요")
    .regex(
      /^\d{2}-\d{2}-\d{6}-\d{2}$/,
      "올바른 면허번호 형식이 아닙니다 (예: 23-45-678901-22)"
    ),
});

const accountSetupSchema = z
  .object({
    email: z
      .string()
      .min(1, "이메일을 입력해주세요")
      .email("올바른 이메일 형식이 아닙니다"),
    password: z
      .string()
      .min(8, "비밀번호는 최소 8자 이상이어야 합니다")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "비밀번호는 대문자, 소문자, 숫자를 포함해야 합니다"
      ),
    passwordConfirm: z.string().min(1, "비밀번호 확인을 입력해주세요"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["passwordConfirm"],
  });

type PhoneVerificationData = z.infer<typeof phoneVerificationSchema>;
type LicenseVerificationData = z.infer<typeof licenseVerificationSchema>;
type AccountSetupData = z.infer<typeof accountSetupSchema>;

type RegistrationStep = "phone" | "license" | "account" | "complete";

/**
 * 회원가입 폼 컴포넌트
 *
 * 프로세스:
 * 1. 휴대폰 인증 (CoolSMS API)
 * 2. 면허번호 확인 (Admin이 생성한 계정의 면허번호와 전화번호 매칭)
 * 3. 이메일/비밀번호 설정
 */
export function RegisterForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>("phone");
  const [isLoading, setIsLoading] = useState(false);

  // 각 단계에서 수집된 데이터
  const [verifiedPhoneNumber, setVerifiedPhoneNumber] = useState("");
  const [verifiedLicenseNumber, setVerifiedLicenseNumber] = useState("");

  // 인증번호 전송 상태
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // 1단계: 휴대폰 인증
  const phoneForm = useForm<PhoneVerificationData>({
    resolver: zodResolver(phoneVerificationSchema),
    defaultValues: {
      phoneNumber: "",
      verificationCode: "",
    },
  });

  // 2단계: 면허번호 확인
  const licenseForm = useForm<LicenseVerificationData>({
    resolver: zodResolver(licenseVerificationSchema),
    defaultValues: {
      licenseNumber: "",
    },
  });

  // 3단계: 계정 설정
  const accountForm = useForm<AccountSetupData>({
    resolver: zodResolver(accountSetupSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  /**
   * 인증번호 전송 (CoolSMS API)
   */
  const sendVerificationCode = async () => {
    const phoneNumber = phoneForm.getValues("phoneNumber");

    if (!phoneNumber) {
      toast.error("전화번호를 입력해주세요");
      return;
    }

    try {
      setIsLoading(true);

      await authApi.sendVerificationCode(phoneNumber);

      setIsCodeSent(true);
      setCountdown(180); // 3분
      toast.success("인증번호가 전송되었습니다");

      // 카운트다운 시작
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsCodeSent(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("인증번호 전송 오류:", error);
      toast.error("인증번호 전송 중 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 휴대폰 인증 완료
   */
  const onPhoneVerificationSubmit = async (data: PhoneVerificationData) => {
    if (!isCodeSent) {
      toast.error("인증번호를 먼저 전송해주세요");
      return;
    }

    if (!data.verificationCode) {
      toast.error("인증번호를 입력해주세요");
      return;
    }

    try {
      setIsLoading(true);

      await authApi.verifyCode(data.phoneNumber, data.verificationCode);

      setVerifiedPhoneNumber(data.phoneNumber);
      setCurrentStep("license");
      toast.success("휴대폰 인증이 완료되었습니다");
    } catch (error) {
      console.error("인증번호 확인 오류:", error);
      toast.error("인증번호가 일치하지 않습니다");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 면허번호 확인 (TCS 연동 및 Admin 계정 매칭)
   */
  const onLicenseVerificationSubmit = async (data: LicenseVerificationData) => {
    try {
      setIsLoading(true);

      // 1. TCS 면허번호 검증
      try {
        await authApi.verifyLicense(data.licenseNumber);
      } catch (error) {
        toast.error("유효하지 않은 면허번호입니다");
        return;
      }

      // 2. Auth-service에서 Admin이 생성한 계정과 매칭 확인
      await authApi.verifyLicensePhone(data.licenseNumber, verifiedPhoneNumber);

      setVerifiedLicenseNumber(data.licenseNumber);
      setCurrentStep("account");
      toast.success("면허번호 확인이 완료되었습니다");
    } catch (error) {
      console.error("면허번호 확인 오류:", error);
      toast.error(
        "면허번호와 전화번호가 등록된 정보와 일치하지 않습니다. 관리자에게 문의하세요."
      );
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 계정 설정 완료 (회원가입)
   */
  const onAccountSetupSubmit = async (data: AccountSetupData) => {
    try {
      setIsLoading(true);

      await authApi.register({
        licenseNumber: verifiedLicenseNumber,
        phoneNumber: verifiedPhoneNumber,
        email: data.email,
        password: data.password,
      });

      setCurrentStep("complete");
      toast.success("회원가입이 완료되었습니다!");

      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (error) {
      console.error("회원가입 오류:", error);
      toast.error("회원가입에 실패했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  // 진행 상태 표시
  const steps = [
    { id: "phone", label: "휴대폰 인증", number: 1 },
    { id: "license", label: "면허번호 확인", number: 2 },
    { id: "account", label: "계정 설정", number: 3 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      {currentStep !== "complete" && (
        <div className="flex items-center justify-center gap-2">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition-colors ${
                    index < currentStepIndex
                      ? "bg-indigo-600 border-indigo-600 text-white"
                      : index === currentStepIndex
                      ? "bg-indigo-100 border-indigo-600 text-indigo-600"
                      : "bg-gray-100 border-gray-300 text-gray-400"
                  }`}
                >
                  {index < currentStepIndex ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    step.number
                  )}
                </div>
                <div
                  className={`mt-2 text-xs font-medium whitespace-nowrap ${
                    index <= currentStepIndex
                      ? "text-indigo-600"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-[2px] w-20 mx-4 ${
                    index < currentStepIndex ? "bg-indigo-600" : "bg-gray-300"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Step 1: Phone Verification */}
      {currentStep === "phone" && (
        <Card className="shadow-lg border-indigo-100/60">
          <CardHeader>
            <CardTitle className="text-xl font-bold">휴대폰 인증</CardTitle>
            <CardDescription>
              본인 확인을 위해 휴대폰 번호를 인증해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={phoneForm.handleSubmit(onPhoneVerificationSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">휴대폰 번호</Label>
                <div className="flex gap-2">
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="010-1234-5678"
                    {...phoneForm.register("phoneNumber")}
                    className="flex-1"
                    disabled={isLoading || isCodeSent}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={sendVerificationCode}
                    disabled={isLoading || isCodeSent}
                    className="whitespace-nowrap"
                  >
                    {isCodeSent
                      ? `${Math.floor(countdown / 60)}:${String(
                          countdown % 60
                        ).padStart(2, "0")}`
                      : "인증번호 전송"}
                  </Button>
                </div>
                {phoneForm.formState.errors.phoneNumber && (
                  <p className="text-sm text-red-600">
                    {phoneForm.formState.errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {isCodeSent && (
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">인증번호</Label>
                  <Input
                    id="verificationCode"
                    type="text"
                    placeholder="6자리 인증번호 입력"
                    {...phoneForm.register("verificationCode")}
                    maxLength={6}
                    disabled={isLoading}
                  />
                  {phoneForm.formState.errors.verificationCode && (
                    <p className="text-sm text-red-600">
                      {phoneForm.formState.errors.verificationCode.message}
                    </p>
                  )}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !isCodeSent}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    확인 중...
                  </>
                ) : (
                  <>
                    다음 단계
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: License Verification */}
      {currentStep === "license" && (
        <Card className="shadow-lg border-indigo-100/60">
          <CardHeader>
            <CardTitle className="text-xl font-bold">면허번호 확인</CardTitle>
            <CardDescription>
              관리자로부터 승인받은 운전면허 번호를 입력해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={licenseForm.handleSubmit(onLicenseVerificationSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">운전면허 번호</Label>
                <Input
                  id="licenseNumber"
                  type="text"
                  placeholder="23-45-678901-22"
                  {...licenseForm.register("licenseNumber")}
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  형식: XX-XX-XXXXXX-XX (숫자와 하이픈)
                </p>
                {licenseForm.formState.errors.licenseNumber && (
                  <p className="text-sm text-red-600">
                    {licenseForm.formState.errors.licenseNumber.message}
                  </p>
                )}
              </div>

              <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
                <p className="font-semibold mb-1">안내</p>
                <p>
                  입력하신 면허번호는 TCS 시스템과 연동하여 검증되며, 관리자가
                  사전에 등록한 정보와 일치해야 합니다.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep("phone")}
                  disabled={isLoading}
                  className="flex-1"
                >
                  이전
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      확인 중...
                    </>
                  ) : (
                    <>
                      다음 단계
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Account Setup */}
      {currentStep === "account" && (
        <Card className="shadow-lg border-indigo-100/60">
          <CardHeader>
            <CardTitle className="text-xl font-bold">계정 설정</CardTitle>
            <CardDescription>
              로그인에 사용할 이메일과 비밀번호를 설정해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={accountForm.handleSubmit(onAccountSetupSubmit)}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  {...accountForm.register("email")}
                  disabled={isLoading}
                />
                {accountForm.formState.errors.email && (
                  <p className="text-sm text-red-600">
                    {accountForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  {...accountForm.register("password")}
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  최소 8자, 대문자, 소문자, 숫자 포함
                </p>
                {accountForm.formState.errors.password && (
                  <p className="text-sm text-red-600">
                    {accountForm.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
                <Input
                  id="passwordConfirm"
                  type="password"
                  placeholder="••••••••"
                  {...accountForm.register("passwordConfirm")}
                  disabled={isLoading}
                />
                {accountForm.formState.errors.passwordConfirm && (
                  <p className="text-sm text-red-600">
                    {accountForm.formState.errors.passwordConfirm.message}
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep("license")}
                  disabled={isLoading}
                  className="flex-1"
                >
                  이전
                </Button>
                <Button type="submit" disabled={isLoading} className="flex-1">
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      회원가입 중...
                    </>
                  ) : (
                    "회원가입 완료"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Complete */}
      {currentStep === "complete" && (
        <Card className="shadow-lg border-green-100/60">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              회원가입이 완료되었습니다!
            </h2>
            <p className="text-gray-600 mb-6">
              잠시 후 로그인 페이지로 이동합니다.
            </p>
            <Button onClick={() => router.push("/login")}>
              로그인 페이지로 이동
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Back to login */}
      {currentStep !== "complete" && (
        <div className="text-center">
          <Button
            variant="link"
            onClick={() => router.push("/login")}
            disabled={isLoading}
          >
            이미 계정이 있으신가요? 로그인
          </Button>
        </div>
      )}
    </div>
  );
}
