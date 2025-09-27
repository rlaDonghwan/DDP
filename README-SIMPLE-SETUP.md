# 간단한 개발 환경 설정 가이드

TCS Mock Service만 Docker로 실행하고 나머지는 로컬에서 개발하는 방법입니다.

## 실행 방법

### 1. TCS Mock Service 실행 (Docker)

```bash
# TCS Mock Service Docker 컨테이너 실행
docker-compose up -d

# 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs -f tcs-mock-service
```

### 2. TCS Mock Service 테스트

```bash
# 헬스체크
curl http://localhost:8085/api/tcs/health

# 면허 정보 조회 테스트
curl -X POST http://localhost:8085/api/tcs/license/verify \
  -H "Content-Type: application/json" \
  -d '{"licenseNumber": "11-22-123456-78"}'

# 음주운전 위반자 목록 조회
curl http://localhost:8085/api/tcs/dui/subjects
```

### 3. Auth Service 로컬 실행

```bash
cd backend/auth-service
./gradlew bootRun
```

Auth Service는 `http://localhost:8085`의 TCS Mock Service를 자동으로 참조합니다.

### 4. Frontend 로컬 실행

```bash
cd frontend
pnpm install  # 최초 한 번만
pnpm dev
```

Frontend는 `http://localhost:3000`에서 실행됩니다.

## 테스트 시나리오

### 1. 관리자 로그인 후 사용자 생성

1. Frontend 접속: http://localhost:3000
2. 관리자 계정으로 로그인
3. 관리자 대시보드 → "사용자 관리" → "새 사용자 등록"
4. 음주운전 위반자 면허번호 입력:
   - `11-22-123456-78` (김음주)
   - `22-33-234567-89` (박위반)
   - `33-44-345678-90` (이반복)
   - `44-55-456789-01` (정상습)
   - `55-66-567890-12` (최중범)

### 2. 일반 운전자 테스트 (실패 케이스)

음주운전 위반자가 아닌 면허번호로 테스트:
- `66-77-678901-23` (홍길동 - 일반 운전자)
- `77-88-789012-34` (김철수 - 일반 운전자)

이 경우 "음주운전 위반자만 계정을 생성할 수 있습니다" 메시지가 표시됩니다.

## 데이터 정보

### TCS Mock Service 더미 데이터

#### 음주운전 위반자 (계정 생성 가능)
| 면허번호 | 이름 | 위반횟수 | 주소 |
|---------|------|----------|------|
| 11-22-123456-78 | 김음주 | 2회 | 서울특별시 강남구 테헤란로 123 |
| 22-33-234567-89 | 박위반 | 1회 | 부산광역시 해운대구 센텀로 456 |
| 33-44-345678-90 | 이반복 | 3회 | 대구광역시 수성구 동대구로 789 |
| 44-55-456789-01 | 정상습 | 4회 | 인천광역시 연수구 컨벤시아대로 101 |
| 55-66-567890-12 | 최중범 | 1회 | 광주광역시 서구 상무대로 202 |

#### 일반 운전자 (계정 생성 불가)
| 면허번호 | 이름 | 상태 |
|---------|------|------|
| 66-77-678901-23 | 홍길동 | 정상 |
| 77-88-789012-34 | 김철수 | 정상 |
| 88-99-890123-45 | 이영희 | 정상 |

## 중지 방법

```bash
# TCS Mock Service 중지
docker-compose down

# 컨테이너와 이미지까지 삭제
docker-compose down --rmi all

# Auth Service 중지 (Ctrl+C)
# Frontend 중지 (Ctrl+C)
```

## 문제 해결

### TCS Mock Service 연결 실패
```bash
# 컨테이너 상태 확인
docker-compose ps

# 로그 확인
docker-compose logs tcs-mock-service

# 재시작
docker-compose restart tcs-mock-service
```

### 포트 충돌
8085 포트가 이미 사용 중인 경우:
```bash
# 포트 사용 프로세스 확인
lsof -i :8085

# 프로세스 종료 후 다시 실행
docker-compose up -d
```

## 장점

1. **간단한 설정**: 복잡한 마이크로서비스 구조 없이 핵심 기능만 테스트
2. **빠른 개발**: Auth Service와 Frontend는 로컬에서 즉시 수정/테스트 가능
3. **독립적 테스트**: TCS Mock Service가 완전히 격리되어 안정적 테스트 환경 제공
4. **실제 시나리오**: 더미 데이터로 완전한 사용자 생성 플로우 테스트 가능

이 설정으로 TCS 연동 기능을 완전히 개발하고 테스트할 수 있습니다!