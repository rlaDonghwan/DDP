# 음주운전 방지장치 통합운영관리시스템 Sequence Diagrams

본 문서는 음주운전 방지장치 통합운영관리시스템의 주요 기능들에 대한 Sequence Diagram을 제공합니다.

## 시스템 구성 요소

- **Frontend**: Next.js (사용자/업체/관리자 포털)
- **Backend**: Spring Boot API Server
- **Database**: PostgreSQL (트랜잭션 데이터), MongoDB (로그 데이터)
- **External Systems**: 경찰청 TCS Mock API, 결제 시스템 Mock API

---

## 1. 사용자 인증 및 역할별 접근 제어

```mermaid
sequenceDiagram
    participant U as User/Company/Admin
    participant F as Next.js Frontend
    participant B as Spring Boot Backend
    participant DB as PostgreSQL
    participant R as Redis Cache

    U->>F: 로그인 요청 (ID, Password, Role)
    F->>B: POST /api/auth/login
    B->>DB: 사용자 인증 정보 조회
    DB-->>B: 사용자 정보 반환
    
    alt 인증 성공
        B->>B: JWT 토큰 생성 (role 포함)
        B->>R: 토큰 정보 캐시 저장
        B-->>F: 200 OK + JWT 토큰
        F->>F: 토큰 저장 (localStorage)
        F-->>U: 로그인 성공, 역할별 대시보드로 리다이렉트
    else 인증 실패
        B-->>F: 401 Unauthorized
        F-->>U: 로그인 실패 메시지
    end

    Note over U,R: 이후 API 호출 시 JWT 토큰으로 인증 및 역할 기반 접근 제어
```

---

## 2. 장치 설치 예약 및 결제 프로세스

```mermaid
sequenceDiagram
    participant U as 장치이용자
    participant F as Next.js Frontend
    participant B as Spring Boot Backend
    participant DB as PostgreSQL
    participant PAY as 결제 시스템 Mock API

    U->>F: 주변 업체 검색
    F->>B: GET /api/companies/nearby?lat=37.5&lng=127.0
    B->>DB: 업체 정보 조회
    DB-->>B: 업체 목록 반환
    B-->>F: 업체 목록 반환
    F-->>U: 업체 목록 표시

    U->>F: 설치 예약 신청 (업체 선택, 일시)
    F->>B: POST /api/reservations
    B->>DB: 예약 정보 저장 (상태: PENDING)
    DB-->>B: 예약 ID 반환
    B-->>F: 예약 생성 완료

    U->>F: 결제 진행
    F->>B: POST /api/payments/process
    B->>PAY: 결제 요청 (Mock)
    PAY-->>B: 결제 승인 (Mock)
    B->>DB: 예약 상태 업데이트 (PAID)
    DB-->>B: 업데이트 완료
    B-->>F: 결제 및 예약 확정
    F-->>U: 예약 완료 알림

    Note over U,PAY: 실제 환경에서는 PG사 연동, 현재는 Mock으로 시뮬레이션
```

---

## 3. 운행기록(로그) 제출

```mermaid
sequenceDiagram
    participant U as 장치이용자
    participant F as Next.js Frontend
    participant B as Spring Boot Backend
    participant PG as PostgreSQL
    participant MG as MongoDB
    participant FS as File Storage

    U->>F: 로그 파일 업로드
    F->>B: POST /api/logs/upload (multipart/form-data)
    B->>FS: 파일 임시 저장
    FS-->>B: 파일 경로 반환

    B->>B: 로그 파일 유효성 검증
    alt 파일 유효
        B->>MG: 로그 데이터 저장 (JSON 형태)
        MG-->>B: 저장 완료
        B->>PG: 로그 제출 이력 저장
        PG-->>B: 이력 저장 완료
        B->>FS: 원본 파일 영구 저장소로 이동
        B-->>F: 200 OK + 제출 완료
        F-->>U: 로그 제출 성공 알림
    else 파일 무효
        B->>FS: 임시 파일 삭제
        B-->>F: 400 Bad Request + 오류 메시지
        F-->>U: 파일 형식 오류 알림
    end

    Note over U,FS: MongoDB는 대용량 로그 데이터 저장에 최적화
```

---

## 4. 업체의 장치 설치 처리

```mermaid
sequenceDiagram
    participant C as 업체담당자
    participant F as Next.js Frontend
    participant B as Spring Boot Backend
    participant DB as PostgreSQL

    C->>F: 예약 목록 조회
    F->>B: GET /api/companies/reservations
    B->>DB: 해당 업체 예약 목록 조회
    DB-->>B: 예약 목록 반환
    B-->>F: 예약 정보 반환
    F-->>C: 예약 목록 표시

    C->>F: 설치 작업 시작 (예약 ID 선택)
    F->>B: POST /api/reservations/{id}/start-installation
    B->>DB: 예약 상태 업데이트 (IN_PROGRESS)
    DB-->>B: 상태 업데이트 완료
    B-->>F: 작업 시작 확인
    F-->>C: 설치 진행 상태로 변경

    C->>F: 설치 완료 및 장치 정보 등록
    F->>B: POST /api/devices/install
    Note over B: 장치 정보, 설치 일시, 교육 결과 등
    B->>DB: 장치 정보 및 설치 이력 저장
    DB-->>B: 저장 완료
    B->>DB: 예약 상태 최종 업데이트 (COMPLETED)
    DB-->>B: 업데이트 완료
    B-->>F: 설치 완료 처리
    F-->>C: 설치 완료 확인

    Note over C,DB: 장치 설치 후 고객에게 시스템 사용법 교육 실시
```

---

## 5. 관리자의 대상자 등록 (경찰청 연동)

```mermaid
sequenceDiagram
    participant A as 공단관리자
    participant F as Next.js Frontend
    participant B as Spring Boot Backend
    participant DB as PostgreSQL
    participant TCS as 경찰청 TCS Mock API

    A->>F: 대상자 등록 화면 접근
    F->>B: GET /api/admin/subjects/new
    B-->>F: 등록 폼 데이터 반환
    F-->>A: 대상자 등록 폼 표시

    A->>F: 대상자 정보 입력 및 등록 요청
    F->>B: POST /api/admin/subjects
    B->>TCS: 면허 정보 조회 요청 (Mock)
    TCS-->>B: 면허 정보 반환 (Mock 데이터)
    
    alt 면허 정보 유효
        B->>DB: 대상자 정보 저장
        DB-->>B: 저장 완료
        B->>DB: 대상자 이력 테이블에 등록 이벤트 기록
        DB-->>B: 이력 저장 완료
        B-->>F: 201 Created + 대상자 정보
        F-->>A: 등록 성공 알림
    else 면허 정보 무효
        B-->>F: 400 Bad Request + 오류 상세
        F-->>A: 면허 정보 오류 알림
    end

    Note over A,TCS: 실제 환경에서는 경찰청 TCS 연동, 현재는 Mock으로 시뮬레이션
```

---

## 6. 관리자 대시보드 현황 조회

```mermaid
sequenceDiagram
    participant A as 공단관리자
    participant F as Next.js Frontend
    participant B as Spring Boot Backend
    participant PG as PostgreSQL
    participant MG as MongoDB
    participant R as Redis Cache

    A->>F: 대시보드 접근
    F->>B: GET /api/admin/dashboard
    
    B->>R: 캐시된 통계 데이터 조회
    alt 캐시 히트
        R-->>B: 캐시된 통계 반환
    else 캐시 미스
        par 병렬 데이터 조회
            B->>PG: 대상자 현황 조회
            PG-->>B: 대상자 통계 반환
        and
            B->>PG: 장치 현황 조회  
            PG-->>B: 장치 통계 반환
        and
            B->>MG: 로그 제출 현황 조회
            MG-->>B: 로그 통계 반환
        and
            B->>PG: 예약/결제 현황 조회
            PG-->>B: 예약 통계 반환
        end
        
        B->>B: 통계 데이터 가공 및 집계
        B->>R: 가공된 통계 데이터 캐시 저장 (TTL: 30분)
    end
    
    B-->>F: 대시보드 데이터 반환
    F->>F: Chart.js로 시각화 렌더링
    F-->>A: 대시보드 표시

    Note over A,R: 대시보드 성능 향상을 위해 Redis 캐시 활용
    Note over F: 실시간 업데이트를 위해 WebSocket 연결 고려
```

---

## 참고사항

1. **인증/인가**: 모든 API 호출에는 JWT 토큰이 필요하며, Spring Security를 통한 RBAC 구현
2. **에러 처리**: 각 단계에서 발생할 수 있는 예외 상황에 대한 적절한 HTTP 상태 코드 및 에러 메시지 반환
3. **로깅**: 모든 중요한 비즈니스 로직 실행 시 로그 기록 (보안 감사 목적)
4. **성능 최적화**: Redis 캐시 활용, DB 쿼리 최적화, CDN을 통한 정적 자원 제공
5. **보안**: HTTPS 통신, 민감 데이터 암호화 저장, SQL Injection 방지 등