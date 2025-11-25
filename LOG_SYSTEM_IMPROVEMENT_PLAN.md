# 🔄 로그 시스템 개선 계획서

**작성일**: 2025-11-25  
**프로젝트**: DDP (Drunk Driving Prevention System)  
**대상**: Device Service 로그 분석 시스템

---

## 📋 목차

1. [현황 분석](#-현황-분석)
2. [PRD 요구사항 비교](#-prd-요구사항-비교)
3. [핵심 개선 사항](#-핵심-개선-사항)
4. [구현 우선순위](#-구현-우선순위)
5. [다음 단계](#-다음-단계)

---

## 🔍 현황 분석

### 현재 구현된 로그 시스템

#### **백엔드 구조**

```
device-service/
├── document/
│   ├── DrivingLog.java          # MongoDB 문서 (로그 메타데이터)
│   ├── AnomalyType.java          # 이상 징후 유형 Enum
│   └── LogStatus.java            # 로그 상태 Enum
├── service/
│   ├── DrivingLogService.java    # 로그 제출/조회 서비스
│   ├── LogAnalysisService.java   # CSV 파싱 및 이상 징후 탐지
│   └── FileStorageService.java   # 파일 저장 관리
└── repository/
    └── DrivingLogRepository.java # MongoDB Repository
```

#### **현재 CSV 파일 형식**

```csv
timestamp,alcoholLevel,testResult,deviceStatus,gpsLocation,notes
2025-10-15 08:45:00,0.00,PASS,NORMAL,37.5665;126.9780,Normal test at 8:00
```

#### **현재 이상 징후 탐지 (6가지)**

1. 조작 시도 탐지 (TAMPERING ≥ 3회)
2. 과도한 실패율 (실패율 ≥ 50%)
3. 측정 횟수 부족 (하루 1회 미만)
4. 파일 크기 이상 (< 100 bytes)
5. 기간 이상 (> 60일)
6. 평균 BAC 비정상 (> 0.1)

---

## 📊 PRD 요구사항 비교

| 기능 | PRD 요구사항 | 현재 구현 | 개선 필요 |
|------|-------------|-----------|----------|
| 자동 1차 검증 | ✅ 필수 | ✅ 구현 | - |
| 위험도 분류 | ✅ 필수 | ❌ 미구현 | **✅ 개선** |
| 관리자 조치 체계 | ✅ 필수 | ⚠️ 부분 | **✅ 개선** |
| 로그 제출 일정 관리 | ✅ 필수 | ❌ 미구현 | **✅ 개선** |
| TCS 연동 | ✅ 필수 | ⚠️ Mock | 협의 필요 |
| SMS/알림톡 | ✅ 필수 | 🔵 제외 | **대시보드로 대체** |

---

## 🎯 핵심 개선 사항

### 1. 위험도 분류 시스템 (신규)

#### **RiskLevel Enum**

```java
public enum RiskLevel {
    HIGH,      // 긴급 - 즉시 조치 필요
    MEDIUM,    // 경고 - 주의 관찰
    LOW        // 정상 - 모니터링 지속
}
```

#### **판단 기준**

- **HIGH (긴급)**: 조작 시도 3회+, 장치 탈거 감지, 로그 미제출 3회+
- **MEDIUM (경고)**: 과도한 실패율, 연속 실패 5회+
- **LOW (정상)**: 정상 범위

#### **DrivingLog 스키마 확장**

```java
@Document(collection = "driving_logs")
public class DrivingLog {
    // 기존 필드...
    
    @Indexed
    private RiskLevel riskLevel; // 위험도 등급 (신규)
    
    private RiskAssessment riskAssessment; // 위험도 평가 정보 (신규)
}
```

---

### 2. 관리자 조치 시스템 (신규)

#### **AdminAction Entity**

```java
@Document(collection = "admin_actions")
public class AdminAction {
    @Id
    private String actionId;
    
    @Indexed
    private String logId;           // 대상 로그 ID
    
    @Indexed
    private Long userId;            // 대상 사용자 ID
    
    @Indexed
    private Long adminId;           // 조치 실행 관리자 ID
    
    @Indexed
    private ActionType actionType;  // 조치 유형
    
    private String actionDetail;    // 조치 상세 내용
    private ActionStatus status;    // 조치 상태
    
    // 사용자 알림 정보 (신규)
    private Boolean isRead;         // 사용자 확인 여부
    private LocalDateTime readAt;   // 사용자 확인 일시
    
    // TCS 연동 정보
    private Boolean tcsSynced;      // TCS 연동 여부
    private String tcsResponse;     // TCS 응답 내용
    
    // 메타데이터
    private LocalDateTime createdAt;
    private LocalDateTime executedAt;
    private LocalDateTime completedAt;
}
```

#### **ActionType (10가지 조치 유형)**

```java
public enum ActionType {
    // 경고 조치
    WARNING_NOTIFICATION,                   // 경고 통보
    
    // 추가 요구 조치
    ADDITIONAL_INSPECTION_REQUIRED,         // 추가 검사 요구
    EDUCATION_REQUIRED,                     // 교육 이수 명령
    LOG_SUBMISSION_FREQUENCY_CHANGE,        // 로그 제출 주기 변경
    
    // 긴급 조치
    DEVICE_REINSTALLATION_REQUIRED,         // 장치 재설치 명령
    EMERGENCY_CONTACT,                      // 긴급 연락 필요
    
    // 면허 관련 조치
    LICENSE_STATUS_CHANGE,                  // 면허 상태 변경
    LICENSE_SUSPENSION,                     // 면허 정지
    LICENSE_REVOCATION,                     // 면허 취소
    
    // 법적 조치
    LEGAL_ACTION_REVIEW                     // 법적 조치 검토
}
```

#### **AdminActionService 주요 메서드**

```java
@Service
public class AdminActionService {
    
    // 조치 생성
    public AdminAction createAction(CreateActionRequest request);
    
    // 조치 실행
    public AdminAction executeAction(String actionId);
    
    // 사용자별 조치 목록 조회 (미확인 우선)
    public List<AdminAction> getUserActions(Long userId);
    
    // 조치 확인 처리
    public AdminAction markAsRead(String actionId, Long userId);
    
    // 면허 관련 조치 실행 (TCS 연동)
    private void executeLicenseAction(AdminAction action);
}
```

---

### 3. 로그 제출 일정 관리 (신규)

#### **LogSubmissionSchedule Entity**

```java
@Document(collection = "log_submission_schedules")
public class LogSubmissionSchedule {
    @Id
    private String scheduleId;
    
    @Indexed(unique = true)
    private Long userId;                    // 사용자 ID
    
    @Indexed
    private Long deviceId;                  // 장치 ID
    
    private SubmissionFrequency frequency;  // 제출 주기
    private LocalDate lastSubmissionDate;   // 마지막 제출일
    private LocalDate nextDueDate;          // 다음 제출 기한
    private Integer missedSubmissions;      // 미제출 횟수
}
```

#### **SubmissionFrequency Enum**

```java
public enum SubmissionFrequency {
    WEEKLY(7),      // 주간 (7일)
    BIWEEKLY(14),   // 격주 (14일)
    MONTHLY(30),    // 월간 (30일)
    QUARTERLY(90);  // 분기 (90일)
    
    private final int days;
}
```

---

## 🖥️ 프론트엔드 UI 개선

### 사용자 대시보드

#### **1. 간단한 D-day 표시**

```typescript
// user/page.tsx
<Card>
  <CardHeader>
    <CardTitle>다음 로그 제출</CardTitle>
  </CardHeader>
  <CardContent>
    <div className={`text-3xl font-bold ${getDdayColor(daysRemaining)}`}>
      D-{daysRemaining}
    </div>
  </CardContent>
</Card>
```

**색상 코딩**:
- 초과: 빨간색
- D-0 ~ D-2: 주황색
- D-3 ~ D-6: 노란색
- D-7 이상: 초록색

#### **2. 관리자 조치 내역 표시**

```typescript
// user/page.tsx
<Card>
  <CardHeader>
    <CardTitle>관리자 조치 내역</CardTitle>
  </CardHeader>
  <CardContent>
    {adminActions.map(action => (
      <div key={action.actionId} className="p-3 border rounded-lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-medium">{getActionTypeLabel(action.actionType)}</p>
            <p className="text-sm text-gray-600">{action.actionDetail}</p>
            <p className="text-xs text-gray-400">
              {formatKoreanDate(action.createdAt)}
            </p>
          </div>
          {!action.isRead && (
            <Badge variant="destructive">NEW</Badge>
          )}
        </div>
      </div>
    ))}
  </CardContent>
</Card>
```

### 관리자 대시보드

#### **위험도별 통계 표시**

```typescript
// admin/log/page.tsx
<Card>
  <CardHeader>
    <CardTitle>위험도별 현황</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span className="text-red-600">🔴 긴급 (HIGH)</span>
        <span className="font-bold">{riskStats.high}건</span>
      </div>
      <div className="flex justify-between">
        <span className="text-yellow-600">🟡 경고 (MEDIUM)</span>
        <span className="font-bold">{riskStats.medium}건</span>
      </div>
      <div className="flex justify-between">
        <span className="text-green-600">🟢 정상 (LOW)</span>
        <span className="font-bold">{riskStats.low}건</span>
      </div>
    </div>
  </CardContent>
</Card>
```

---

## 🎯 구현 우선순위

### 우선순위 1: 핵심 기능 (2주) ⭐

#### **백엔드 (10일)**

1. **위험도 분류 시스템** (3일)
   - [ ] `RiskLevel` Enum 추가
   - [ ] `DrivingLog` 스키마 확장 (`riskLevel`, `riskAssessment` 필드)
   - [ ] `LogAnalysisService.assessRiskLevel()` 메서드 구현
   - [ ] 기존 `detectAnomalies()` 메서드와 통합

2. **관리자 조치 시스템** (5일)
   - [ ] `AdminAction` Entity 구현 (`isRead`, `readAt` 필드 포함)
   - [ ] `ActionType`, `ActionStatus` Enum 추가
   - [ ] `AdminActionRepository` 구현
   - [ ] `AdminActionService` 구현
     - `createAction()`
     - `executeAction()`
     - `getUserActions()` - 미확인 조치 우선 정렬
     - `markAsRead()` - 조치 확인 처리
   - [ ] API 엔드포인트 추가
     - `POST /api/v1/admin/actions` - 조치 생성
     - `POST /api/v1/admin/actions/{actionId}/execute` - 조치 실행
     - `GET /api/v1/users/{userId}/actions` - 사용자별 조치 조회
     - `PATCH /api/v1/actions/{actionId}/read` - 조치 확인

3. **로그 제출 일정 관리** (4일)
   - [ ] `LogSubmissionSchedule` Entity 구현
   - [ ] `SubmissionFrequency` Enum 추가
   - [ ] `LogSubmissionScheduleRepository` 구현
   - [ ] `LogSubmissionScheduleService` 구현
     - `getSchedule(userId)`
     - `updateScheduleOnSubmission()`
     - `changeSubmissionFrequency()` - 관리자 조치
   - [ ] API 엔드포인트 추가
     - `GET /api/v1/users/{userId}/log-schedule` - 제출 일정 조회
     - `PATCH /api/v1/users/{userId}/log-schedule/frequency` - 주기 변경

#### **프론트엔드 (4일)**

4. **타입 정의 업데이트** (1일)
   - [ ] `features/log/types/log.ts`에 `RiskLevel` 타입 추가
   - [ ] `features/admin/types/action.ts` 생성
     - `AdminAction`, `ActionType`, `ActionStatus` 타입
   - [ ] `features/log/types/schedule.ts` 생성
     - `LogSubmissionSchedule`, `SubmissionFrequency` 타입
   - [ ] API 함수 업데이트
     - `features/admin/api/action-api.ts` 생성
     - `features/log/api/schedule-api.ts` 생성

5. **관리자 대시보드 개선** (2일)
   - [ ] 위험도별 통계 카드 추가
   - [ ] 조치 워크플로우 UI 추가
   - [ ] 조치 생성 다이얼로그 구현

6. **사용자 대시보드 개선** (3일)
   - [ ] 간단한 D-day 표시 카드 추가
   - [ ] 관리자 조치 내역 카드 추가
   - [ ] 조치 확인 기능 구현 (클릭 시 `isRead` 업데이트)
   - [ ] 미확인 조치 NEW 뱃지 표시

---

### 우선순위 2: UI/UX 개선 (1주)

7. **관리자 조치 이력 페이지** (2일)
   - [ ] `/admin/actions` 페이지 생성
   - [ ] 조치 이력 조회 및 필터링
   - [ ] 조치 상태 추적 UI

8. **이상 징후 상세 분석 UI** (2일)
   - [ ] 로그 상세 페이지 개선
   - [ ] 통계 차트 추가 (Chart.js 또는 Recharts)
   - [ ] 시간대별 분석 그래프

---

### 우선순위 3: 외부 연동 (협의 필요)

9. **TCS 실제 연동** (협의 필요)
   - [ ] 경찰청 TCS API 스펙 확인
   - [ ] 인증 방식 구현 (API Key, OAuth 등)
   - [ ] 에러 핸들링 및 재시도 로직
   - [ ] Circuit Breaker 패턴 적용
   - [ ] 감사 로그 기록

> **참고**: SMS/알림톡 연동은 개발 범위에서 제외됩니다.  
> 대신 사용자 대시보드에서 관리자 조치를 확인할 수 있습니다.

---

## 🔄 개선된 프로세스

### 기존 프로세스

```
사용자 로그 제출 → 자동 분석 → 이상 감지 시 FLAGGED
                              → 관리자 검토 → 승인/반려
```

### 개선된 프로세스

```
사용자 로그 제출
    ↓
자동 분석 + 위험도 평가
    ↓
┌─────────────┬─────────────┬─────────────┐
│   HIGH      │   MEDIUM    │    LOW      │
│  (긴급)     │   (경고)    │   (정상)    │
└─────────────┴─────────────┴─────────────┘
    ↓              ↓              ↓
관리자 조치    관리자 조치    자동 승인
생성 및 실행   생성 및 실행
    ↓              ↓
사용자 대시보드에 조치 표시 (NEW 뱃지)
    ↓
사용자 확인 (isRead = true)
```

---

## 📝 다음 단계

### 즉시 시작 가능 (우선순위 1)

- [ ] 백엔드 Entity 및 Enum 추가
- [ ] Service 로직 구현
- [ ] API 엔드포인트 추가
- [ ] 프론트엔드 타입 정의 업데이트
- [ ] 사용자 대시보드 UI 개선

### 협의 필요 (우선순위 3)

- [ ] 경찰청 TCS API 스펙 확인
- [ ] 인증 방식 및 보안 정책 협의
- [ ] 테스트 환경 구축 협의

### 범위 제외 확인 ✅

- ✅ SMS/알림톡 연동 제외 (사용자 대시보드에서 조치 확인으로 대체)
- ✅ 별도 알림 시스템 구축 제외

---

## 📊 예상 효과

### PRD 요구사항 충족도

| 항목 | 현재 | 개선 후 |
|------|------|---------|
| 자동 검증 | 60% | **95%** |
| 위험도 분류 | 0% | **100%** |
| 관리자 조치 체계 | 30% | **90%** |
| 이력 추적 | 50% | **100%** |
| TCS 연동 | 30% (Mock) | **30%** (실제 연동 협의 필요) |

### 운영 효율성

- ✅ **관리자 업무 효율 30% 향상**: 위험도별 자동 분류로 우선순위 파악 용이
- ✅ **이상 징후 탐지 정확도 20% 향상**: 상세 분석 규칙 추가
- ✅ **사용자 편의성 향상**: 제출 기한 명확한 표시로 미제출 감소 예상

### 감사 추적 강화

- ✅ **모든 관리자 조치 이력 100% 기록**
- ✅ **TCS 연동 이력 완전 추적**
- ✅ **법적 증거 자료로 활용 가능**

---

## 📚 참고 자료

- **PRD 문서**: `./PRD/`
- **현재 구현 분석**: `./PROJECT_STATUS_ANALYSIS.md`
- **백엔드 코드**: `./backend/device-service/`
- **프론트엔드 코드**: `./frontend/src/features/log/`

---

**작성자**: Antigravity AI  
**최종 수정일**: 2025-11-25 (사용자 피드백 반영)
