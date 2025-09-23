# DDP Backend - Microservices Architecture

Spring Cloud 기반 마이크로서비스 아키텍처로 구성된 백엔드 시스템입니다.

## 서비스 구성

- **eureka-server** (8761): 서비스 디스커버리
- **api-gateway** (8080): API 게이트웨이 
- **user-service** (8081): 사용자 관리 서비스
- **auth-service** (8082): 인증/인가 서비스

## 기술 스택

- Java 17
- Spring Boot 3.2.x
- Spring Cloud 2023.0.x
- PostgreSQL (User Service)
- Redis (Auth Service)
- Docker & Docker Compose

## 로컬 실행 방법

### 1. 서비스 실행 순서
```bash
# 1. Eureka Server 실행
cd eureka-server
./gradlew bootRun

# 2. Auth Service 실행  
cd auth-service
./gradlew bootRun

# 3. User Service 실행
cd user-service
./gradlew bootRun

# 4. API Gateway 실행
cd api-gateway
./gradlew bootRun
```

### 2. Docker Compose 실행
```bash
# 전체 서비스 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

## 서비스 URL

- Eureka Dashboard: http://localhost:8761
- API Gateway: http://localhost:8080
- User Service: http://localhost:8081
- Auth Service: http://localhost:8082

## API 테스트

```bash
# 사용자 등록
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# 로그인
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```