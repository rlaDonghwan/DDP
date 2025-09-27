package com.ddp.auth.security;

import com.ddp.auth.service.JwtService;
import com.ddp.auth.service.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

// JWT 토큰을 검증하고 인증 정보를 설정하는 필터
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                  HttpServletResponse response,
                                  FilterChain filterChain) throws ServletException, IOException {

        try {
            // Authorization 헤더에서 JWT 토큰 추출
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && jwtService.validateToken(jwt)) {
                // 토큰에서 사용자 ID 추출
                String userEmail = jwtService.getUserEmailFromToken(jwt);

                // UserDetails 로드
                UserDetails userDetails = userDetailsService.loadUserByUsername(userEmail);

                // 인증 객체 생성
                UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // SecurityContext에 인증 정보 설정
                SecurityContextHolder.getContext().setAuthentication(authentication);

                log.debug("사용자 인증 완료: {}", userEmail);
            }
        } catch (Exception ex) {
            log.error("JWT 토큰 처리 중 오류 발생: {}", ex.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    // Request 헤더에서 JWT 토큰 추출
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}