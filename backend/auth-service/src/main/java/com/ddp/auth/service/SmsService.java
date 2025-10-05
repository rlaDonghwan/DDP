package com.ddp.auth.service;

import com.ddp.auth.constants.RedisKeyConstants;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Random;
import java.util.UUID;

// SMS 인증 서비스 (CoolSMS 연동)
@Service
@RequiredArgsConstructor
@Slf4j
public class SmsService {

    private final RedisTemplate<String, String> redisTemplate;

    @Value("${sms.verification.expiration-seconds:180}")
    private int verificationExpirationSeconds; // 인증번호 만료 시간 (기본 3분)

    @Value("${sms.verification-token.expiration-seconds:600}")
    private int verificationTokenExpirationSeconds; // 인증 토큰 만료 시간 (기본 10분)

    private static final String SMS_CODE_KEY_PREFIX = "sms:code:";
    private static final String SMS_TOKEN_KEY_PREFIX = "sms:token:";

    // 인증번호 발송
    public String sendVerificationCode(String phone) {
        log.info("SMS 인증번호 발송 시작 - 전화번호: {}", maskPhone(phone));

        long startTime = System.currentTimeMillis();

        try {
            // 6자리 랜덤 인증번호 생성
            String verificationCode = generateVerificationCode();

            // Redis에 저장 (전화번호를 키로, 인증번호를 값으로)
            String key = SMS_CODE_KEY_PREFIX + phone;
            redisTemplate.opsForValue().set(key, verificationCode, Duration.ofSeconds(verificationExpirationSeconds));

            // TODO: 실제 CoolSMS API 호출
            // 현재는 로그로만 출력 (개발 환경)
            log.info("SMS 발송 (Mock): 전화번호 {}, 인증번호: {}", maskPhone(phone), verificationCode);

            // 실제 프로덕션 환경에서는 아래와 같이 CoolSMS API 호출
            // sendSmsViaCoolSms(phone, verificationCode);

            log.info("SMS 인증번호 발송 완료 - 전화번호: {}, 만료시간: {}초 ({}ms)",
                    maskPhone(phone), verificationExpirationSeconds, System.currentTimeMillis() - startTime);

            return verificationCode; // 개발용: 실제 환경에서는 반환하지 않음

        } catch (Exception e) {
            log.error("SMS 발송 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("SMS 발송에 실패했습니다.", e);
        }
    }

    // 인증번호 확인
    public boolean verifyCode(String phone, String code) {
        log.debug("SMS 인증번호 확인 시작 - 전화번호: {}", maskPhone(phone));

        try {
            String key = SMS_CODE_KEY_PREFIX + phone;
            String savedCode = redisTemplate.opsForValue().get(key);

            if (savedCode == null) {
                log.warn("인증번호가 만료되었거나 존재하지 않음 - 전화번호: {}", maskPhone(phone));
                return false;
            }

            boolean isValid = savedCode.equals(code);

            if (isValid) {
                // 인증 성공 시 인증번호 삭제
                redisTemplate.delete(key);
                log.info("SMS 인증 성공 - 전화번호: {}", maskPhone(phone));
            } else {
                log.warn("SMS 인증 실패: 인증번호 불일치 - 전화번호: {}", maskPhone(phone));
            }

            return isValid;

        } catch (Exception e) {
            log.error("SMS 인증 확인 중 오류 발생: {}", e.getMessage(), e);
            return false;
        }
    }

    // 인증 토큰 생성 (인증 완료 후 임시 토큰)
    public String generateVerificationToken(String phone) {
        log.debug("SMS 인증 토큰 생성 - 전화번호: {}", maskPhone(phone));

        try {
            String token = UUID.randomUUID().toString();
            String key = SMS_TOKEN_KEY_PREFIX + token;

            // Redis에 토큰 저장 (토큰을 키로, 전화번호를 값으로)
            redisTemplate.opsForValue().set(key, phone, Duration.ofSeconds(verificationTokenExpirationSeconds));

            log.info("SMS 인증 토큰 생성 완료 - 전화번호: {}, 만료시간: {}초",
                    maskPhone(phone), verificationTokenExpirationSeconds);

            return token;

        } catch (Exception e) {
            log.error("SMS 인증 토큰 생성 중 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("인증 토큰 생성에 실패했습니다.", e);
        }
    }

    // 인증 토큰 검증
    public String validateVerificationToken(String token) {
        log.debug("SMS 인증 토큰 검증 시작");

        try {
            String key = SMS_TOKEN_KEY_PREFIX + token;
            String phone = redisTemplate.opsForValue().get(key);

            if (phone == null) {
                log.warn("인증 토큰이 만료되었거나 존재하지 않음");
                return null;
            }

            log.info("SMS 인증 토큰 검증 성공 - 전화번호: {}", maskPhone(phone));
            return phone;

        } catch (Exception e) {
            log.error("SMS 인증 토큰 검증 중 오류 발생: {}", e.getMessage(), e);
            return null;
        }
    }

    // 인증 토큰 삭제 (회원가입 완료 후)
    public void revokeVerificationToken(String token) {
        log.debug("SMS 인증 토큰 삭제");

        try {
            String key = SMS_TOKEN_KEY_PREFIX + token;
            redisTemplate.delete(key);

            log.info("SMS 인증 토큰 삭제 완료");

        } catch (Exception e) {
            log.error("SMS 인증 토큰 삭제 중 오류 발생: {}", e.getMessage(), e);
        }
    }

    // 6자리 랜덤 인증번호 생성
    private String generateVerificationCode() {
        Random random = new Random();
        int code = 100000 + random.nextInt(900000); // 100000 ~ 999999
        return String.valueOf(code);
    }

    // 전화번호 마스킹 (로그용)
    private String maskPhone(String phone) {
        if (phone == null || phone.length() < 10) {
            return "***";
        }
        // 예: 010-1234-5678 → 010-****-5678
        int firstDash = phone.indexOf('-');
        int lastDash = phone.lastIndexOf('-');

        if (firstDash > 0 && lastDash > firstDash) {
            return phone.substring(0, firstDash + 1) +
                    "****" +
                    phone.substring(lastDash);
        }

        return phone;
    }

    // TODO: 실제 CoolSMS API 호출 메서드
    /*
    private void sendSmsViaCoolSms(String phone, String code) {
        // CoolSMS SDK 사용 예시
        // Message message = new Message(apiKey, apiSecret);
        // HashMap<String, String> params = new HashMap<>();
        // params.put("to", phone);
        // params.put("from", senderPhone);
        // params.put("text", "[DDP] 인증번호: " + code);
        // message.send(params);
    }
    */
}
