import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * 라우트 보호 미들웨어
 * 인증이 필요한 경로에 대해 JWT 쿠키를 체크합니다
 */
export function middleware(request: NextRequest) {
  // JWT 쿠키 확인 (백엔드가 설정한 쿠키 이름: jwt, refreshToken)
  const accessToken = request.cookies.get("jwt");
  const refreshToken = request.cookies.get("refreshToken");

  // 둘 중 하나라도 있으면 인증된 것으로 간주
  const isAuthenticated = accessToken || refreshToken;

  // 인증이 필요한 경로 정의
  const protectedPaths = ["/admin", "/company", "/user"];

  // 공개 경로 (로그인 페이지 등)
  const publicPaths = ["/login", "/admin/login", "/company/login"];
  const isPublicPath = publicPaths.some(
    (path) => request.nextUrl.pathname === path
  );

  const isProtectedPath = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  // 1) 공개 경로 우선 허용 (예: /admin/login 이 /admin 보호 규칙보다 먼저 통과)
  if (isPublicPath) {
    return NextResponse.next();
  }

  // 2) 보호된 경로 + 비인증 → 로그인 리다이렉트
  if (isProtectedPath && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/admin/login"
  ) {
    try {
      const token = accessToken?.value;
      if (!token) {
        // 토큰 없음 (이미 위 인증 로직을 통과한 경우는 refreshToken 존재 가능)
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
      const roleRaw = extractRole(token);
      const role = roleRaw?.toString().toLowerCase();
      if (role !== "admin") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    } catch (e) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // 통과
  return NextResponse.next();
}

/**
 * JWT Payload 에서 role 추출 (검증 없이 디코딩만)
 */
function extractRole(jwt: string): string | undefined {
  const parts = jwt.split(".");
  if (parts.length < 2) return undefined;
  try {
    const payload = JSON.parse(
      Buffer.from(
        parts[1].replace(/-/g, "+").replace(/_/g, "/"),
        "base64"
      ).toString("utf8")
    );
    return payload.role || payload.roles || payload.authorities?.[0];
  } catch {
    return undefined;
  }
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
    "/unauthorized",
  ],
};
