package com.ddp.device.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * 파일 저장 서비스
 * 로컬 파일 시스템에 파일을 저장 (향후 S3/MinIO로 전환 가능)
 */
@Service
@Slf4j
public class FileStorageService {

    @Value("${file.upload.dir:./uploads/logs}")
    private String uploadDir;

    /**
     * 업로드 디렉토리 초기화
     */
    public void init() {
        try {
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
                log.info("파일 업로드 디렉토리 생성: {}", uploadPath.toAbsolutePath());
            }
        } catch (IOException e) {
            log.error("파일 업로드 디렉토리 생성 실패", e);
            throw new RuntimeException("파일 업로드 디렉토리를 초기화할 수 없습니다", e);
        }
    }

    /**
     * 파일 저장
     * @param file 업로드할 파일
     * @param deviceId 장치 ID
     * @param userId 사용자 ID
     * @return 저장된 파일 경로
     */
    public String storeFile(MultipartFile file, Long deviceId, Long userId) {
        log.info("API 호출 시작: 파일 저장 - 파일명: {}, 장치 ID: {}, 사용자 ID: {}",
                file.getOriginalFilename(), deviceId, userId);

        long startTime = System.currentTimeMillis();

        try {
            // 파일명 검증
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.contains("..")) {
                throw new IllegalArgumentException("잘못된 파일명입니다: " + originalFilename);
            }

            // 업로드 디렉토리 확인 및 생성
            init();

            // 날짜별 디렉토리 생성 (예: 2024/01/15)
            String dateDir = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM/dd"));
            Path datePath = Paths.get(uploadDir, dateDir);
            Files.createDirectories(datePath);

            // 고유 파일명 생성 (UUID + 원본 파일명)
            String uniqueFileName = String.format("%s_%s_%s_%s",
                    UUID.randomUUID(),
                    deviceId,
                    userId,
                    originalFilename);

            // 파일 저장 경로
            Path targetPath = datePath.resolve(uniqueFileName);

            // 파일 복사
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // 상대 경로 반환 (DB 저장용)
            String relativePath = dateDir + "/" + uniqueFileName;

            log.info("API 호출 완료: 파일 저장 - 경로: {} ({}ms)",
                    relativePath, System.currentTimeMillis() - startTime);

            return relativePath;

        } catch (IOException e) {
            log.error("파일 저장 실패: {}", e.getMessage(), e);
            throw new RuntimeException("파일 저장에 실패했습니다", e);
        }
    }

    /**
     * 파일 삭제
     * @param filePath 삭제할 파일 경로
     */
    public void deleteFile(String filePath) {
        log.info("API 호출 시작: 파일 삭제 - 경로: {}", filePath);

        long startTime = System.currentTimeMillis();

        try {
            Path targetPath = Paths.get(uploadDir, filePath);
            Files.deleteIfExists(targetPath);

            log.info("API 호출 완료: 파일 삭제 ({}ms)",
                    System.currentTimeMillis() - startTime);

        } catch (IOException e) {
            log.error("파일 삭제 실패: {}", e.getMessage(), e);
            // 파일 삭제 실패는 치명적이지 않으므로 예외를 던지지 않음
        }
    }

    /**
     * 파일 경로 가져오기
     * @param filePath 상대 파일 경로
     * @return 절대 파일 경로
     */
    public Path getFilePath(String filePath) {
        return Paths.get(uploadDir, filePath);
    }
}
