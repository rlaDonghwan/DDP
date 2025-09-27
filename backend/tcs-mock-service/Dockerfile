# OpenJDK 17을 기반으로 하는 이미지 사용
FROM openjdk:17-jdk-slim

# 작업 디렉토리 설정
WORKDIR /app

# 빌드된 JAR 파일을 컨테이너로 복사
COPY build/libs/*.jar app.jar

# 포트 8085 노출
EXPOSE 8085

# Java 애플리케이션 실행
ENTRYPOINT ["java", "-jar", "/app/app.jar"]