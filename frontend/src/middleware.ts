import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 라우트 보호 미들웨어
 * 인증이 필요한 경로에 대해 세션 쿠키를 체크합니다
 */
export function middleware(request: NextRequest) {
  // 세션 쿠키 확인 (쿠키명은 Spring Boot 설정에 따라 변경 가능)
  const session = request.cookies.get("JSESSIONID") || request.cookies.get("SESSION");

  // 인증이 필요한 경로 정의
  const protectedPaths = ["/admin", "/company", "/user"];
  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // 보호된 경로에 접근하려는데 세션이 없는 경우
  if (isProtectedPath && !session) {
    console.log(
      `미들웨어: 인증되지 않은 접근 차단 - ${request.nextUrl.pathname}`
    );

    // 로그인 페이지로 리다이렉트
    const loginUrl = new URL("/login", request.url);
    // 원래 가려던 경로를 쿼리 파라미터로 저장 (로그인 후 리다이렉트용)
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);

    return NextResponse.redirect(loginUrl);
  }

  // 로그인 페이지에 이미 인증된 사용자가 접근하는 경우
  if (request.nextUrl.pathname === "/login" && session) {
    console.log("미들웨어: 이미 인증된 사용자 - 대시보드로 리다이렉트");

    // 역할별 대시보드로 리다이렉트 (기본: 사용자 대시보드)
    return NextResponse.redirect(new URL("/user/dashboard", request.url));
  }

  // 인증 통과 또는 보호되지 않은 경로
  return NextResponse.next();
}

/**
 * 미들웨어가 실행될 경로 패턴
 */
export const config = {
  matcher: [
    // 보호된 경로
    "/admin/:path*",
    "/company/:path*",
    "/user/:path*",
    // 로그인 페이지
    "/login",
  ],
};