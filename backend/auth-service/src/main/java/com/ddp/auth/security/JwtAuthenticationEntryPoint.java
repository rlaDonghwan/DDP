package com.ddp.auth.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

// JWT 인증 실패 시 처리하는 EntryPoint
@Component
@Slf4j
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, 
                        HttpServletResponse response,
                        AuthenticationException authException) throws IOException, ServletException {
        
        log.error("인증되지 않은 요청: {}", authException.getMessage());
        
        // 401 Unauthorized 응답
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        
        String jsonResponse = """
            {
                "error": "Unauthorized",
                "message": "인증이 필요합니다.",
                "status": 401,
                "path": "%s"
            }
            """.formatted(request.getRequestURI());
            
        response.getWriter().write(jsonResponse);
    }
}