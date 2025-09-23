package com.ddp.auth.user.service;

import com.ddp.auth.user.dto.UserRegistrationRequest;
import com.ddp.auth.user.dto.UserResponse;
import com.ddp.auth.user.entity.User;
import com.ddp.auth.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// 사용자 비즈니스 로직 서비스
@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 사용자 등록 처리
    public UserResponse registerUser(UserRegistrationRequest request) {
        // API 호출 시작 로그
        long startTime = System.currentTimeMillis();
        System.out.println("API 호출 시작: 사용자 등록");

        try {
            // 이메일 중복 확인
            if (userRepository.existsByEmail(request.email())) {
                throw new IllegalArgumentException("이미 존재하는 이메일입니다: " + request.email());
            }

            // 비밀번호 암호화
            String hashedPassword = passwordEncoder.encode(request.password());

            // 사용자 엔티티 생성
            User user = new User(request.email(), hashedPassword, request.name());
            user.setPhone(request.phone());
            user.setAddress(request.address());

            // 데이터베이스에 저장
            User savedUser = userRepository.save(user);

            // API 호출 완료 로그
            long endTime = System.currentTimeMillis();
            System.out.println("API 호출 완료: 사용자 등록 (" + (endTime - startTime) + "ms)");

            return UserResponse.from(savedUser);
        } catch (Exception e) {
            // API 호출 실패 로그
            long endTime = System.currentTimeMillis();
            System.out.println("API 호출 실패: 사용자 등록 (" + (endTime - startTime) + "ms)");
            throw e;
        }
    }

    // 이메일과 비밀번호로 사용자 인증
    public UserResponse authenticateUser(String email, String password) {
        // API 호출 시작 로그
        long startTime = System.currentTimeMillis();
        System.out.println("API 호출 시작: 사용자 인증");

        try {
            // 이메일로 사용자 조회
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 이메일입니다: " + email));

            // 비밀번호 확인
            if (!passwordEncoder.matches(password, user.getPasswordHash())) {
                throw new IllegalArgumentException("비밀번호가 일치하지 않습니다");
            }

            // API 호출 완료 로그
            long endTime = System.currentTimeMillis();
            System.out.println("API 호출 완료: 사용자 인증 (" + (endTime - startTime) + "ms)");

            return UserResponse.from(user);
        } catch (Exception e) {
            // API 호출 실패 로그
            long endTime = System.currentTimeMillis();
            System.out.println("API 호출 실패: 사용자 인증 (" + (endTime - startTime) + "ms)");
            throw e;
        }
    }

    // 사용자 ID로 사용자 정보 조회
    @Transactional(readOnly = true)
    public UserResponse getUserById(Long userId) {
        // API 호출 시작 로그
        long startTime = System.currentTimeMillis();
        System.out.println("API 호출 시작: 사용자 정보 조회");

        try {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다: " + userId));

            // API 호출 완료 로그
            long endTime = System.currentTimeMillis();
            System.out.println("API 호출 완료: 사용자 정보 조회 (" + (endTime - startTime) + "ms)");

            return UserResponse.from(user);
        } catch (Exception e) {
            // API 호출 실패 로그
            long endTime = System.currentTimeMillis();
            System.out.println("API 호출 실패: 사용자 정보 조회 (" + (endTime - startTime) + "ms)");
            throw e;
        }
    }

    // 사용자 정보 수정
    public UserResponse updateUser(Long userId, UserRegistrationRequest request) {
        // API 호출 시작 로그
        long startTime = System.currentTimeMillis();
        System.out.println("API 호출 시작: 사용자 정보 수정");

        try {
            User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 사용자입니다: " + userId));

            // 사용자 정보 업데이트
            user.setName(request.name());
            user.setPhone(request.phone());
            user.setAddress(request.address());

            User updatedUser = userRepository.save(user);

            // API 호출 완료 로그
            long endTime = System.currentTimeMillis();
            System.out.println("API 호출 완료: 사용자 정보 수정 (" + (endTime - startTime) + "ms)");

            return UserResponse.from(updatedUser);
        } catch (Exception e) {
            // API 호출 실패 로그
            long endTime = System.currentTimeMillis();
            System.out.println("API 호출 실패: 사용자 정보 수정 (" + (endTime - startTime) + "ms)");
            throw e;
        }
    }
}