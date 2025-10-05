package com.ddp.auth.constants;

// Redis 키 패턴 상수 관리 클래스
public final class RedisKeyConstants {

    // 생성자를 private으로 선언하여 인스턴스화 방지
    private RedisKeyConstants() {
        throw new AssertionError("유틸리티 클래스는 인스턴스화할 수 없습니다.");
    }

    // 리프레시 토큰 관련 키 패턴
    public static final String REFRESH_TOKEN_KEY_PREFIX = "refresh_token:";
    public static final String USER_TOKENS_KEY_PREFIX = "user_tokens:";

    // 액세스 토큰 블랙리스트 키 패턴
    public static final String ACCESS_BLACKLIST_KEY_PREFIX = "blacklist:access:";

    // 사용자 블랙리스트 키 패턴 (전체 로그아웃용)
    public static final String USER_BLACKLIST_KEY_PREFIX = "blacklist:user:";
}
