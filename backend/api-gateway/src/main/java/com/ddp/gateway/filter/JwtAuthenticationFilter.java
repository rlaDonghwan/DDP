package com.ddp.gateway.filter;

import com.ddp.gateway.config.JwtConfig;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpCookie;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.MultiValueMap;

import javax.crypto.SecretKey;
import java.util.List;

// JWT 인증 필터
@Component
@Slf4j
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {

    private final JwtConfig jwtConfig;

    public JwtAuthenticationFilter(JwtConfig jwtConfig) {
        super(Config.class);
        this.jwtConfig = jwtConfig;
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();

            // 공개 API는 JWT 검증 건너뛰기
            String path = request.getURI().getPath();
            if (isPublicPath(path)) {
                log.debug("공개 API 요청, JWT 검증 스킵: {}", path);
                return chain.filter(exchange);
            }

            // JWT 토큰 추출 (쿠키 또는 Authorization 헤더)
            String token = extractToken(request);

            if (token == null) {
                log.warn("JWT 토큰이 없습니다: {}", path);
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            try {
                // JWT 검증 및 파싱
                Claims claims = parseToken(token);

                // 사용자 정보 추출
                Long userId = claims.get("userId", Long.class);
                String email = claims.getSubject();
                String name = claims.get("name", String.class);
                String role = claims.get("role", String.class);

                log.debug("JWT 검증 성공 - userId: {}, role: {}, path: {}", userId, role, path);

                // 헤더에 사용자 정보 추가
                ServerHttpRequest mutatedRequest = request.mutate()
                    .header("X-User-Id", String.valueOf(userId))
                    .header("X-User-Email", email)
                    .header("X-User-Name", name)
                    .header("X-User-Role", role)
                    .build();

                return chain.filter(exchange.mutate().request(mutatedRequest).build());

            } catch (Exception e) {
                log.warn("JWT 검증 실패: {} - {}", path, e.getMessage());
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
        };
    }

    /**
     * 공개 API 경로인지 확인
     */
    private boolean isPublicPath(String path) {
        List<String> publicPaths = List.of(
            "/api/v1/public",        // 업체 검색 공개 API
            "/api/v1/auth/login",    // 로그인
            "/api/v1/auth/logout",   // 로그아웃
            "/api/v1/users/register", // 회원가입
            "/api/v1/users/complete-registration", // 회원가입 완료
            "/api/v1/users/sms",     // SMS 인증
            "/api/v1/tcs"            // TCS Mock API
        );

        return publicPaths.stream().anyMatch(path::startsWith);
    }

    /**
     * JWT 토큰 추출 (쿠키 또는 Authorization 헤더)
     */
    private String extractToken(ServerHttpRequest request) {
        // 1. Authorization 헤더에서 추출
        List<String> authHeaders = request.getHeaders().get("Authorization");
        if (authHeaders != null && !authHeaders.isEmpty()) {
            String authHeader = authHeaders.get(0);
            if (authHeader.startsWith("Bearer ")) {
                return authHeader.substring(7);
            }
        }

        // 2. 쿠키에서 추출 (httpOnly 쿠키)
        MultiValueMap<String, HttpCookie> cookies = request.getCookies();
        HttpCookie jwtCookie = cookies.getFirst("jwt");
        if (jwtCookie != null) {
            return jwtCookie.getValue();
        }

        return null;
    }

    /**
     * JWT 토큰 파싱 및 검증
     */
    private Claims parseToken(String token) {
        SecretKey key = Keys.hmacShaKeyFor(jwtConfig.getSecret().getBytes());

        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .getPayload();
    }

    // 필터 설정 클래스 (필요 시 확장 가능)
    public static class Config {
        // 설정이 필요하면 여기에 추가
    }
}
