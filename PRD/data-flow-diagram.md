# 음주운전 방지장치 통합운영관리시스템 Data Flow Diagram (DFD)

본 문서는 음주운전 방지장치 통합운영관리시스템의 데이터 흐름을 DFD로 표현합니다.

## DFD 표기법

- **원형/타원**: 프로세스 (Process)
- **사각형**: 외부 엔티티 (External Entity)  
- **평행선**: 데이터 저장소 (Data Store)
- **화살표**: 데이터 흐름 (Data Flow)

---

## Context Diagram (Level -1)

전체 시스템과 외부 엔티티 간의 데이터 흐름을 나타냅니다.

```mermaid
flowchart TD
    %% 외부 엔티티
    USER[장치이용자]
    COMPANY[제조업체]
    ADMIN[공단관리자]
    POLICE[경찰청 TCS]
    PAYMENT[결제시스템]

    %% 시스템
    SYSTEM((음주운전 방지장치<br/>통합운영관리시스템))

    %% 데이터 흐름
    USER -->|로그인 정보, 예약 신청,<br/>운행기록 파일| SYSTEM
    SYSTEM -->|인증 결과, 예약 확인,<br/>제출 완료 알림| USER
    
    COMPANY -->|업체 정보, 설치 내역,<br/>수리 기록| SYSTEM
    SYSTEM -->|예약 정보, 고객 정보| COMPANY
    
    ADMIN -->|대상자 정보, 관리 명령| SYSTEM
    SYSTEM -->|현황 통계, 로그 분석 결과| ADMIN
    
    POLICE -->|면허 정보, 대상자 데이터| SYSTEM
    SYSTEM -->|면허 조회 요청| POLICE
    
    PAYMENT -->|결제 승인/거절| SYSTEM
    SYSTEM -->|결제 요청 정보| PAYMENT

    %% 스타일링
    classDef entity fill:#e1f5fe,stroke:#0277bd,stroke-width:2px
    classDef system fill:#f3e5f5,stroke:#7b1fa2,stroke-width:3px
    
    class USER,COMPANY,ADMIN,POLICE,PAYMENT entity
    class SYSTEM system
```

---

## Level 0 DFD

시스템의 주요 프로세스들과 데이터 저장소를 나타냅니다.

```mermaid
flowchart TD
    %% 외부 엔티티
    USER[장치이용자]
    COMPANY[제조업체]
    ADMIN[공단관리자]
    POLICE[경찰청 TCS]
    PAYMENT[결제시스템]

    %% 프로세스
    P1((P1<br/>사용자 인증<br/>관리))
    P2((P2<br/>예약 및 결제<br/>관리))
    P3((P3<br/>장치 및 설치<br/>관리))
    P4((P4<br/>운행기록<br/>관리))
    P5((P5<br/>시스템<br/>관리))

    %% 데이터 저장소
    D1[(D1: PostgreSQL<br/>사용자/예약/결제/장치)]
    D2[(D2: MongoDB<br/>운행기록 로그)]
    D3[(D3: Redis<br/>세션/캐시)]
    D4[(D4: File Storage<br/>첨부파일)]

    %% 외부 엔티티와 프로세스 간 데이터 흐름
    USER -->|로그인 요청| P1
    P1 -->|인증 결과| USER
    USER -->|예약 신청| P2
    P2 -->|예약 확인| USER
    USER -->|운행기록 파일| P4
    P4 -->|제출 완료| USER

    COMPANY -->|업체 등록 정보| P1
    P1 -->|인증 결과| COMPANY
    COMPANY -->|설치 내역| P3
    P3 -->|예약 정보| COMPANY

    ADMIN -->|관리자 로그인| P1
    P1 -->|관리자 인증| ADMIN
    ADMIN -->|대상자 등록| P5
    P5 -->|등록 결과| ADMIN
    ADMIN -->|현황 조회| P5
    P5 -->|통계 데이터| ADMIN

    POLICE -->|면허 정보| P5
    P5 -->|면허 조회 요청| POLICE

    PAYMENT -->|결제 승인| P2
    P2 -->|결제 요청| PAYMENT

    %% 프로세스와 데이터 저장소 간 흐름
    P1 <-->|사용자 정보| D1
    P1 <-->|세션 정보| D3
    
    P2 <-->|예약 정보| D1
    P2 <-->|결제 정보| D1
    
    P3 <-->|장치 정보| D1
    P3 <-->|설치 이력| D1
    
    P4 <-->|로그 데이터| D2
    P4 <-->|로그 파일| D4
    P4 <-->|제출 이력| D1
    
    P5 <-->|모든 데이터| D1
    P5 <-->|로그 통계| D2
    P5 <-->|캐시 데이터| D3

    %% 스타일링
    classDef entity fill:#e1f5fe,stroke:#0277bd,stroke-width:2px
    classDef process fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef datastore fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    
    class USER,COMPANY,ADMIN,POLICE,PAYMENT entity
    class P1,P2,P3,P4,P5 process
    class D1,D2,D3,D4 datastore
```

---

## Level 1 DFD - 예약 및 결제 관리 프로세스 (P2)

```mermaid
flowchart TD
    %% 외부 엔티티
    USER[장치이용자]
    COMPANY[제조업체]
    PAYMENT[결제시스템]

    %% 세부 프로세스
    P2_1((P2.1<br/>업체 검색))
    P2_2((P2.2<br/>예약 생성))
    P2_3((P2.3<br/>결제 처리))
    P2_4((P2.4<br/>예약 확인))
    P2_5((P2.5<br/>예약 취소))

    %% 데이터 저장소
    D1[(D1: PostgreSQL)]
    D3[(D3: Redis)]

    %% 데이터 흐름
    USER -->|검색 조건| P2_1
    P2_1 -->|업체 목록| USER
    P2_1 <-->|업체 정보| D1

    USER -->|예약 신청| P2_2
    P2_2 -->|예약 번호| USER
    P2_2 -->|예약 정보| D1

    USER -->|결제 요청| P2_3
    P2_3 -->|결제 요청| PAYMENT
    PAYMENT -->|결제 승인| P2_3
    P2_3 -->|결제 완료| USER
    P2_3 <-->|결제 정보| D1

    COMPANY -->|예약 조회| P2_4
    P2_4 -->|예약 목록| COMPANY
    P2_4 <-->|예약 데이터| D1
    P2_4 <-->|캐시 데이터| D3

    USER -->|취소 요청| P2_5
    P2_5 -->|취소 확인| USER
    P2_5 <-->|예약 상태 변경| D1

    %% 스타일링
    classDef entity fill:#e1f5fe,stroke:#0277bd,stroke-width:2px
    classDef process fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef datastore fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    
    class USER,COMPANY,PAYMENT entity
    class P2_1,P2_2,P2_3,P2_4,P2_5 process
    class D1,D3 datastore
```

---

## Level 1 DFD - 운행기록 관리 프로세스 (P4)

```mermaid
flowchart TD
    %% 외부 엔티티
    USER[장치이용자]
    ADMIN[공단관리자]

    %% 세부 프로세스
    P4_1((P4.1<br/>로그 파일<br/>업로드))
    P4_2((P4.2<br/>로그 파일<br/>유효성 검증))
    P4_3((P4.3<br/>로그 데이터<br/>파싱 및 저장))
    P4_4((P4.4<br/>제출 이력<br/>관리))
    P4_5((P4.5<br/>로그 데이터<br/>조회 및 분석))

    %% 데이터 저장소
    D1[(D1: PostgreSQL)]
    D2[(D2: MongoDB)]
    D4[(D4: File Storage)]

    %% 데이터 흐름
    USER -->|로그 파일| P4_1
    P4_1 -->|임시 저장| D4
    P4_1 -->|파일 정보| P4_2

    P4_2 -->|유효성 결과| USER
    P4_2 -->|검증된 파일| P4_3
    P4_2 -->|무효 파일 삭제| D4

    P4_3 -->|파싱된 데이터| D2
    P4_3 -->|영구 저장| D4
    P4_3 -->|처리 완료| P4_4

    P4_4 -->|제출 완료 알림| USER
    P4_4 -->|제출 이력| D1

    ADMIN -->|로그 조회 요청| P4_5
    P4_5 -->|로그 분석 결과| ADMIN
    P4_5 <-->|로그 데이터| D2
    P4_5 <-->|이력 정보| D1

    %% 스타일링
    classDef entity fill:#e1f5fe,stroke:#0277bd,stroke-width:2px
    classDef process fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef datastore fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    
    class USER,ADMIN entity
    class P4_1,P4_2,P4_3,P4_4,P4_5 process
    class D1,D2,D4 datastore
```

---

## Level 1 DFD - 장치 및 설치 관리 프로세스 (P3)

```mermaid
flowchart TD
    %% 외부 엔티티
    COMPANY[제조업체]
    ADMIN[공단관리자]

    %% 세부 프로세스
    P3_1((P3.1<br/>장치 등록))
    P3_2((P3.2<br/>설치 처리))
    P3_3((P3.3<br/>수리 및<br/>A/S 관리))
    P3_4((P3.4<br/>장치 상태<br/>관리))
    P3_5((P3.5<br/>장치 현황<br/>조회))

    %% 데이터 저장소
    D1[(D1: PostgreSQL)]

    %% 데이터 흐름
    COMPANY -->|장치 등록 요청| P3_1
    P3_1 -->|등록 완료| COMPANY
    P3_1 -->|장치 정보| D1

    COMPANY -->|설치 완료 보고| P3_2
    P3_2 -->|설치 확인| COMPANY
    P3_2 <-->|설치 이력| D1
    P3_2 <-->|예약 상태 변경| D1

    COMPANY -->|수리 내역| P3_3
    P3_3 -->|수리 완료| COMPANY
    P3_3 <-->|수리 이력| D1

    P3_4 <-->|장치 상태 정보| D1
    P3_4 -->|상태 변경 알림| COMPANY

    ADMIN -->|장치 현황 요청| P3_5
    P3_5 -->|장치 통계| ADMIN
    P3_5 <-->|장치 데이터| D1

    %% 프로세스 간 데이터 흐름
    P3_2 -->|상태 업데이트| P3_4
    P3_3 -->|상태 업데이트| P3_4

    %% 스타일링
    classDef entity fill:#e1f5fe,stroke:#0277bd,stroke-width:2px
    classDef process fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef datastore fill:#fff3e0,stroke:#ef6c00,stroke-width:2px
    
    class COMPANY,ADMIN entity
    class P3_1,P3_2,P3_3,P3_4,P3_5 process
    class D1 datastore
```

---

## 데이터 저장소 상세

### D1: PostgreSQL (관계형 데이터베이스)
- **사용자 정보**: 이용자, 업체, 관리자 계정
- **예약 정보**: 설치/수리 예약, 상태, 일정
- **결제 정보**: 결제 내역, 상태, 금액
- **장치 정보**: 장치 등록, 설치 이력, 상태
- **제출 이력**: 로그 제출 기록, 처리 상태

### D2: MongoDB (문서형 데이터베이스)
- **운행기록 데이터**: 대용량 로그 파일의 JSON 형태 저장
- **분석 데이터**: 집계된 통계 정보
- **이벤트 로그**: 시스템 사용 로그

### D3: Redis (인메모리 캐시)
- **세션 정보**: 사용자 로그인 상태
- **임시 데이터**: API 응답 캐시
- **통계 캐시**: 대시보드용 집계 데이터

### D4: File Storage (파일 저장소)
- **원본 로그 파일**: 사용자가 업로드한 파일
- **첨부파일**: 증명서류, 이미지 등
- **백업 파일**: 시스템 백업 데이터

---

## DFD 작성 원칙 및 고려사항

1. **데이터 흐름의 방향성**: 모든 데이터 흐름은 명확한 방향을 가집니다
2. **프로세스 분해**: 복잡한 프로세스는 Level 1에서 세부 프로세스로 분해됩니다
3. **데이터 저장소 최적화**: 데이터 특성에 따라 적절한 저장소를 선택합니다
4. **외부 시스템 연동**: 경찰청 TCS, 결제 시스템 등 외부 연동을 명시합니다
5. **보안 고려**: 민감한 개인정보는 암호화하여 저장합니다