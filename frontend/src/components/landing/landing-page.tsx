import React from "react";
import {
  ShieldCheck,
  TrendingUp,
  Users,
  Server,
  BookOpen,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Header } from "./header";

// 간단한 유틸 (필요 시 tailwind-merge로 대체 가능)
const cn = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ");

// Header는 별도 파일에서 import

// Hero
const Hero: React.FC = () => (
  <section id="overview" className="bg-white pt-24 sm:pt-32 pb-16">
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
      <p className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-600">
        한국도로교통공단
      </p>
      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
        음주운전 방지장치 통합운영관리 시스템
      </h1>
      <p className="mx-auto mt-6 max-w-3xl text-xl text-gray-500">
        상습 음주운전을 체계적으로 관리하고, 무고한 인명피해를 방지하기 위한
        선진적인 <strong>조건부 면허제도</strong> 지원 시스템을 구축합니다.
        재범률 45% 이상의 사회적 문제 해결에 기여합니다.
      </p>
      <div className="mt-10 flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
        <a
          href="#features"
          className="rounded-lg bg-indigo-600 px-8 py-3 text-lg font-semibold text-white shadow-xl transition-all duration-300 hover:bg-indigo-700 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
        >
          주요 기능 살펴보기
        </a>
        <a
          href="#contact"
          className="rounded-lg bg-white px-8 py-3 text-lg font-semibold text-gray-900 shadow-md ring-1 ring-inset ring-gray-300 transition-all duration-300 hover:bg-gray-50 hover:ring-gray-400 focus:outline-none focus:ring-4 focus:ring-gray-200/50"
        >
          문의 및 협력
        </a>
      </div>
    </div>
  </section>
);

// FeatureCard
interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}
const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <div className="flex flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg">
    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
      <Icon className="h-6 w-6" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    <p className="mt-2 text-base text-gray-500">{description}</p>
  </div>
);

// Features
const Features: React.FC = () => (
  <section id="features" className="bg-gray-50 py-24 sm:py-32">
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          통합 시스템의 핵심 기능
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          경찰청 TCS 연계부터 장치 로그 데이터 분석까지, 운영의 효율성과 관리의
          정확성을 높입니다.
        </p>
      </div>
      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon={Users}
          title="장치 및 대상자 등록 관리"
          description="부착 대상자와 장치(설치/제거) 정보를 통합 관리합니다. 조건부 면허 상태를 경찰청 TCS와 실시간 연계하여 조회하고 변경합니다."
        />
        <FeatureCard
          icon={Server}
          title="운행 로그 데이터 수집/분석"
          description="장치에서 추출된 운행 기록(Log Data)을 안전하게 수집 및 저장합니다. 주기적인 분석을 통해 대상자의 준수 사항 이행 여부를 확인합니다."
        />
        <FeatureCard
          icon={ShieldCheck}
          title="보안 및 개인정보 보호"
          description="모든 데이터와 개인 식별 정보를 암호화하여 관리합니다. 접속 기록 저장 등 최고 수준의 보안 요구사항(SER-001)을 준수합니다."
        />
        <FeatureCard
          icon={TrendingUp}
          title="검사·교정 및 인증 관리"
          description="음주운전 방지장치 제조·수리 업체의 인증 유효기간을 관리하고, 장치의 검사 및 교정 결과(KOLAS)를 시스템에 등록합니다."
        />
        <FeatureCard
          icon={Zap}
          title="전자 결제 및 예약 시스템"
          description="장치 설치, 검·교정, 수리 등에 대한 예약 기능과 신용카드, 계좌이체, 간편결제(SFR-012)를 지원하는 전자 결제 기능을 제공합니다."
        />
        <FeatureCard
          icon={BookOpen}
          title="안내 및 통보 기능"
          description="장치 검사 및 운행 기록 제출 일정 등을 SMS, 알림톡을 통해 대상자에게 사전 통보하고, 통보 기록을 저장 관리합니다."
        />
      </div>
    </div>
  </section>
);

// BenefitItem
interface BenefitItemProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}
const BenefitItem: React.FC<BenefitItemProps> = ({
  icon: Icon,
  title,
  description,
}) => (
  <div className="flex space-x-4">
    <div className="flex-shrink-0 pt-1 text-indigo-600">
      <Icon className="h-6 w-6" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-base text-gray-600">{description}</p>
    </div>
  </div>
);

// Benefits
const Benefits: React.FC = () => (
  <section id="benefits" className="bg-white py-24 sm:py-32">
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            시스템 구축으로 기대되는 효과
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            교통사고 사회적 비용 감소는 물론, 행정 효율성 증대와 재범 방지를
            위한 체계적인 관리 기반을 마련합니다.
          </p>
        </div>
        <div className="mt-12 lg:col-span-7 lg:mt-0">
          <div className="space-y-12">
            <BenefitItem
              icon={Users}
              title="국민 편익 및 관리 효율 증대"
              description="연평균 약 5만 명의 대상자를 통합 운영관리하여 관리 효율성을 높이고, 음주운전 근절 문화 확산에 기여합니다."
            />
            <BenefitItem
              icon={TrendingUp}
              title="재범 방지를 위한 체계적 관리 강화"
              description="장치 설치 이력, 검사 및 교정 관리를 통해 실질적인 음주운전자 관리가 가능하며, 재범률 감소에 직접적인 영향을 줍니다."
            />
            <BenefitItem
              icon={ShieldCheck}
              title="행정 효율성 및 정책 집행력 강화"
              description="경찰청, 공단, 제조업체 간의 데이터 연계로 중복 행정을 방지하고, 단속-처벌-예방의 선순환 구조를 정착시킵니다."
            />
          </div>
        </div>
      </div>
    </div>
  </section>
);

// Footer
const Footer: React.FC = () => (
  <footer id="contact" className="bg-gray-800 text-white">
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <div>
          <h4 className="text-lg font-bold mb-4">사업 개요</h4>
          <p className="text-sm text-gray-400">
            음주운전 방지장치 통합운영관리 시스템 구축 사업
          </p>
          <p className="text-sm text-gray-400 mt-2">
            주관 기관: 한국도로교통공단
          </p>
          <p className="text-sm text-gray-400">사업 기간: 계약일로부터 150일</p>
        </div>
        <div>
          <h4 className="text-lg font-bold mb-4">주요 담당 부서</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>교통안전본부</li>
            <li>시험교정처</li>
          </ul>
        </div>
      </div>
      <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
        &copy; 2025 DDP Project. All rights reserved.
      </div>
    </div>
  </footer>
);

// 메인 랜딩 페이지 컴포넌트
export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen font-sans">
      <Header />
      <main>
        <Hero />
        <Features />
        <Benefits />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
