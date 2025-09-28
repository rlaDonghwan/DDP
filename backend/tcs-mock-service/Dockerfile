# 멀티스테이지 빌드: 빌드 스테이지
FROM openjdk:17-jdk-slim AS build

# 작업 디렉토리 설정
WORKDIR /app

# Gradle 래퍼 스크립트 복사
COPY gradlew .
COPY gradle gradle/

# Gradle 래퍼 실행 권한 부여
RUN chmod +x ./gradlew

# 의존성 정보 복사 (캐시 최적화)
COPY build.gradle .
COPY settings.gradle* .

# 의존성 다운로드 (소스 코드 변경 시 캐시 활용)
RUN ./gradlew dependencies --no-daemon || true

# 소스 코드 복사
COPY src src/

# 애플리케이션 빌드
RUN ./gradlew build --no-daemon -x test

# 런타임 스테이지
FROM openjdk:17-jdk-slim

# 작업 디렉토리 설정
WORKDIR /app

# 빌드 스테이지에서 생성된 JAR 파일 복사
COPY --from=build /app/build/libs/*.jar app.jar

# 포트 8085 노출
EXPOSE 8085

# Java 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "/app/app.jar"]