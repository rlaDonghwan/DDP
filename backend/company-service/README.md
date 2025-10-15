# Company Service

업체 관리 마이크로서비스

## 개요

음주운전 방지장치 통합운영관리시스템의 업체 관리를 담당하는 서비스입니다.

## 주요 기능

- 업체 등록 및 관리
- 업체 승인/거절 프로세스
- 서비스 이력 관리
- 관리 장치 관리
- 담당 고객 관리

## 기술 스택

- Spring Boot 3.5.0
- Spring Data JPA
- PostgreSQL
- Spring Cloud (Eureka Client, Config Client, OpenFeign)
- Swagger/OpenAPI 3.0

## API 엔드포인트

### 업체 관리

- `GET /api/admin/companies` - 업체 목록 조회
- `GET /api/admin/companies/{id}` - 업체 상세 조회
- `POST /api/admin/companies` - 업체 등록
- `PUT /api/admin/companies/{id}` - 업체 수정
- `DELETE /api/admin/companies/{id}` - 업체 삭제
- `POST /api/admin/companies/{id}/approve` - 업체 승인
- `POST /api/admin/companies/{id}/reject` - 업체 거절

## 데이터베이스 설정

### PostgreSQL 데이터베이스 생성

```bash
# PostgreSQL 접속
psql -U postgres

# 데이터베이스 생성
CREATE DATABASE ddp_company;

# 사용자 생성 (선택사항, 이미 ddp_user가 있다면 생략)
CREATE USER ddp_user WITH PASSWORD 'ddp_password';

# 권한 부여
GRANT ALL PRIVILEGES ON DATABASE ddp_company TO ddp_user;
```

## 실행 방법

### 1. Config Server와 Eureka Server 실행

먼저 config-service와 eureka-server가 실행되어 있어야 합니다.

```bash
# Config Server 실행 (포트 8888)
cd ../config-service
./gradlew bootRun

# Eureka Server 실행 (포트 8761)
cd ../eureka-server
./gradlew bootRun
```

### 2. Company Service 실행

```bash
# 빌드
./gradlew build

# 실행
./gradlew bootRun
```

서비스는 포트 8082에서 실행됩니다.

### 3. API Gateway를 통한 접근

API Gateway (포트 8080)를 통해 서비스에 접근할 수 있습니다:

```bash
# 예시: 업체 목록 조회
curl http://localhost:8080/api/admin/companies

# 예시: 업체 등록
curl -X POST http://localhost:8080/api/admin/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "테스트 업체",
    "businessNumber": "123-45-67890",
    "representativeName": "홍길동",
    "email": "test@example.com",
    "phone": "010-1234-5678",
    "address": "서울시 강남구",
    "region": "서울",
    "certificationValidUntil": "2025-12-31",
    "contractStatus": "PENDING",
    "initialAccountId": "company001",
    "initialPassword": "password123"
  }'
```

## Swagger UI

서비스 실행 후 다음 URL로 API 문서를 확인할 수 있습니다:

- http://localhost:8082/swagger-ui.html

## 환경 변수

다음 환경 변수를 설정할 수 있습니다:

```bash
# 데이터베이스 설정
DB_URL=jdbc:postgresql://localhost:5432/ddp_company
DB_USERNAME=ddp_user
DB_PASSWORD=ddp_password
```

## 개발 규칙

- 모든 주석은 한국어로 작성
- API 호출 시작/완료 시간 로깅
- 에러 발생 시 적절한 로깅
- DTO 변환은 정적 팩토리 메서드 사용
