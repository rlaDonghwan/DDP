# DDP 프로젝트 개발 가이드

이 문서는 DDP (Drunk Driving Prevention System) 프로젝트의 개발 규칙과 가이드라인을 정의합니다.

---

## 📁 프로젝트 구조

### 백엔드 (Spring Boot MSA)

```
backend/
├── api-gateway/              # API Gateway (8080)
├── eureka-server/            # Service Discovery (8761)
├── config-service/           # Config Server (8888)
├── auth-service/             # 인증 서비스 (8081)
├── device-service/           # 장치 서비스 (8082)
├── company-service/          # 업체 서비스 (8083)
├── reservation-service/      # 예약 서비스 (8084)
└── tcs-mock-service/         # TCS Mock (8085)
```

### 프론트엔드 (Next.js)

```
frontend/src/
├── app/                      # Next.js App Router
│   ├── admin/               # 관리자 시스템
│   ├── user/                # 사용자 시스템
│   └── company/             # 업체 시스템
├── features/                 # Feature별 모듈
│   ├── admin/
│   │   ├── api/             # API 호출 함수
│   │   ├── types/           # TypeScript 타입
│   │   └── components/      # 컴포넌트
│   ├── user/
│   ├── company/
│   └── ...
├── lib/
│   └── axios.ts             # Axios 인스턴스 (공통)
├── components/ui/           # shadcn/ui 컴포넌트
└── types/                   # 전역 타입 정의
```

---

## 🎯 프론트엔드 개발 규칙

### 1. API 개발 규칙

#### 1.1 파일 위치

- **API 파일**: `features/{domain}/api/{domain}-api.ts`
- **타입 파일**: `features/{domain}/types/{entity}.ts`

#### 1.2 Import 규칙

```typescript
// ✅ 올바른 방법
import api from "@/lib/axios";  // Axios 인스턴스는 lib/axios.ts에서 import
import type { EntityResponse, CreateEntityRequest } from "../types/entity";

// ❌ 잘못된 방법
import axios from "axios";  // 직접 axios import 금지
```

#### 1.3 API 함수 작성 패턴

```typescript
// features/{domain}/api/{domain}-api.ts
import api from "@/lib/axios";
import type { EntityResponse, CreateEntityRequest } from "../types/entity";

export const entityApi = {
  /**
   * 엔티티 생성
   */
  createEntity: async (data: CreateEntityRequest): Promise<EntityResponse> => {
    const startTime = performance.now();
    console.log("API 호출 시작: 엔티티 생성");

    try {
      const response = await api.post<EntityResponse>("/api/v1/entities", data);

      const endTime = performance.now();
      console.log(`API 호출 완료: 엔티티 생성 (${(endTime - startTime).toFixed(2)}ms)`);

      return response.data;
    } catch (error) {
      const endTime = performance.now();
      console.log(`API 호출 실패: 엔티티 생성 (${(endTime - startTime).toFixed(2)}ms)`);
      throw error;
    }
  },

  /**
   * 엔티티 목록 조회
   */
  getEntities: async (): Promise<EntityResponse[]> => {
    const response = await api.get<EntityResponse[]>("/api/v1/entities");
    return response.data;
  },

  /**
   * 엔티티 수정
   */
  updateEntity: async (id: number, data: Partial<CreateEntityRequest>): Promise<EntityResponse> => {
    const response = await api.patch<EntityResponse>(`/api/v1/entities/${id}`, data);
    return response.data;
  },

  /**
   * 엔티티 삭제
   */
  deleteEntity: async (id: number): Promise<void> => {
    await api.delete(`/api/v1/entities/${id}`);
  },
};
```

**핵심 규칙**:
- 모든 API 함수는 `async/await` 사용
- 성능 측정을 위한 `performance.now()` 사용
- 에러는 `throw`하여 호출하는 쪽에서 처리
- 응답 타입은 제네릭으로 명시 (`api.get<Type>()`)
- `response.data`를 반환 (axios 응답 객체가 아닌)

### 2. 타입 정의 규칙

#### 2.1 파일 위치

`features/{domain}/types/{entity}.ts`

#### 2.2 타입 정의 패턴

```typescript
// features/{domain}/types/entity.ts

// 1. Enum types (백엔드 Enum과 일치)
export type EntityStatus = "ACTIVE" | "INACTIVE" | "PENDING";
export type EntityType = "TYPE_A" | "TYPE_B" | "TYPE_C";

// 2. Response interface (백엔드 응답)
export interface EntityResponse {
  id: number;
  name: string;
  status: EntityStatus;
  type: EntityType;
  createdAt: string;  // ISO 8601 format
  updatedAt: string;
}

// 3. Request interface (백엔드 요청)
export interface CreateEntityRequest {
  name: string;
  type: EntityType;
  description?: string;  // Optional fields
}

export interface UpdateEntityRequest {
  name?: string;
  status?: EntityStatus;
  description?: string;
}
```

**핵심 규칙**:
- Enum은 백엔드 Java Enum과 정확히 일치해야 함
- 날짜/시간은 `string` 타입 (ISO 8601 형식)
- Optional 필드는 `?` 사용
- Request와 Response는 명확히 구분

### 3. 페이지 개발 규칙

#### 3.1 파일 위치

- **페이지**: `app/{role}/{feature}/page.tsx`
- **예시**: `app/admin/devices/page.tsx`, `app/user/reservations/page.tsx`

#### 3.2 페이지 구조

```typescript
"use client";

import { useState, useEffect } from "react";
import { entityApi } from "@/features/{domain}/api/{domain}-api";
import type { EntityResponse } from "@/features/{domain}/types/entity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EntityPage() {
  const [entities, setEntities] = useState<EntityResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await entityApi.getEntities();
        setEntities(data);
      } catch (err) {
        console.error("데이터 조회 실패:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">엔티티 목록</h1>
      {/* 페이지 내용 */}
    </div>
  );
}
```

### 4. 컴포넌트 규칙

#### 4.1 UI 컴포넌트

- **shadcn/ui 사용**: `components/ui/` 폴더의 컴포넌트 사용
- **Tailwind CSS**: 스타일링은 Tailwind CSS 사용

#### 4.2 Feature 컴포넌트

- **위치**: `features/{domain}/components/`
- **명명**: PascalCase (예: `EntityCard.tsx`, `EntityForm.tsx`)

---

## 🔧 백엔드 개발 규칙

### 1. Entity 작성 규칙

```java
@Entity
@Table(name = "entities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Entity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    
    @Enumerated(EnumType.STRING)
    private EntityStatus status;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

### 2. Controller 작성 규칙

```java
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Entity", description = "엔티티 관리 API")
public class EntityController {
    
    private final EntityService entityService;
    
    @PostMapping("/entities")
    @Operation(summary = "엔티티 생성", description = "새로운 엔티티를 생성합니다")
    public ResponseEntity<EntityResponse> createEntity(
            @Valid @RequestBody CreateEntityRequest request
    ) {
        log.info("엔티티 생성 요청: {}", request);
        
        try {
            EntityResponse response = entityService.createEntity(request);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            log.error("엔티티 생성 실패: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            log.error("엔티티 생성 실패: {}", e.getMessage(), e);
            return ResponseEntity.status(500).build();
        }
    }
}
```

### 3. API 엔드포인트 규칙

- **Base URL**: `/api/v1`
- **RESTful 설계**:
  - `GET /api/v1/entities` - 목록 조회
  - `GET /api/v1/entities/{id}` - 단건 조회
  - `POST /api/v1/entities` - 생성
  - `PATCH /api/v1/entities/{id}` - 수정
  - `DELETE /api/v1/entities/{id}` - 삭제

---

## 🧪 테스트 규칙

### 프론트엔드 테스트

1. **브라우저 콘솔 확인**
   - API 호출 로그 확인
   - 에러 메시지 확인

2. **네트워크 탭 확인**
   - 요청/응답 확인
   - 상태 코드 확인

### 백엔드 테스트

1. **Swagger UI 사용**
   - `http://localhost:8080/swagger-ui.html`
   - API 엔드포인트 테스트

2. **Postman 사용**
   - API 컬렉션 작성
   - 자동화 테스트

---

## 📝 커밋 메시지 규칙

```
[타입] 제목

본문 (선택)

Footer (선택)
```

**타입**:
- `feat`: 새로운 기능
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드
- `chore`: 빌드, 설정 변경

**예시**:
```
[feat] 교육 이수 관리 시스템 구현

- EducationRecord Entity 추가
- EducationController API 구현
- 프론트엔드 교육 결과 입력 페이지 추가
```

---

## 🚀 개발 워크플로우

### 1. 새로운 기능 개발

1. **백엔드 개발**
   - Entity 작성
   - Repository 작성
   - Service 작성
   - Controller 작성
   - Swagger로 API 테스트

2. **프론트엔드 개발**
   - 타입 정의 (`features/{domain}/types/`)
   - API 함수 작성 (`features/{domain}/api/`)
   - 페이지 작성 (`app/{role}/{feature}/`)
   - 브라우저에서 테스트

3. **통합 테스트**
   - 전체 플로우 테스트
   - 에러 케이스 테스트

### 2. 기존 기능 수정

1. 백엔드 수정 시 프론트엔드 타입도 함께 수정
2. API 엔드포인트 변경 시 프론트엔드 API 함수도 함께 수정
3. 변경 사항은 반드시 테스트

---

## 📚 참고 자료

- **기존 구현 참고**:
  - 검·교정 관리: `features/admin/api/inspections-api.ts`
  - 탈거 관리: `features/admin/api/removals-api.ts`
  - 예약 관리: `features/reservation/api/reservation-api.ts`

- **UI 컴포넌트**:
  - shadcn/ui: https://ui.shadcn.com/
  - Tailwind CSS: https://tailwindcss.com/

- **백엔드 문서**:
  - Swagger UI: `http://localhost:8080/swagger-ui.html`
