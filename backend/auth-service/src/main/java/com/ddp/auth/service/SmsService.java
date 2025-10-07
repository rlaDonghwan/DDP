package com.ddp.auth.service;

import com.solapi.sdk.SolapiClient;
import com.solapi.sdk.message.exception.SolapiMessageNotReceivedException;
import com.solapi.sdk.message.model.Message;
import com.solapi.sdk.message.service.DefaultMessageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Random;
import java.util.UUID;

// SMS 인증 서비스 (Solapi 연동)
@Service
@Slf4j
public class SmsService {

    private final RedisTemplate<String, String> redisTemplate;
    private final DefaultMessageService messageService;

    @Value("${solapi.from-number}")
    private String fromNumber;

    @Value("${sms.verification.expiration-seconds:180}")
    private int verificationExpirationSeconds; // 인증번호 만료 시간 (기본 3분)

    @Value("${sms.verification-token.expiration-seconds:600}")
    private int verificationTokenExpirationSeconds; // 인증 토큰 만료 시간 (기본 10분)

    // 생성자: Solapi SDK 초기화
    public SmsService(RedisTemplate<String, String> redisTemplate,
                      @Value("${solapi.api.key}") String apiKey,
                      @Value("${solapi.api.secret}") String apiSecret) {
        this.redisTemplate = redisTemplate;
        this.messageService = SolapiClient.INSTANCE.createInstance(apiKey, apiSecret);
        log.info("Solapi SMS 서비스 초기화 완료");
    }

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

            // Solapi를 통한 실제 SMS 발송
            sendSmsViaSolapi(phone, verificationCode);

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

    // Solapi를 통한 실제 SMS 발송
    private void sendSmsViaSolapi(String to, String code) {
        try {
            log.info("Solapi SMS 발송 시작 - 수신번호: {}", maskPhone(to));

            // 하이픈 제거 (Solapi는 하이픈 없는 전화번호 형식 사용)
            String cleanTo = to.replaceAll("-", "");

            // 메시지 객체 생성
            Message message = new Message();
            message.setFrom(fromNumber);
            message.setTo(cleanTo);
            message.setText("[DDP] 인증번호: " + code);

            // SMS 발송
            this.messageService.send(message);

            log.info("Solapi SMS 발송 성공");

        } catch (SolapiMessageNotReceivedException exception) {
            // 발송에 실패한 메시지 목록 확인
            log.error("Solapi SMS 발송 실패 - 실패 메시지 목록: {}", exception.getFailedMessageList());
            log.error("Solapi SMS 발송 실패 - 에러 메시지: {}", exception.getMessage());
            throw new RuntimeException("SMS 발송에 실패했습니다: " + exception.getMessage(), exception);
        } catch (Exception exception) {
            log.error("Solapi SMS 발송 중 오류 발생: {}", exception.getMessage(), exception);
            throw new RuntimeException("SMS 발송 중 오류가 발생했습니다: " + exception.getMessage(), exception);
        }
    }
}
