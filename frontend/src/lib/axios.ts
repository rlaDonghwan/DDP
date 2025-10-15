import axios, { InternalAxiosRequestConfig } from "axios";

/**
 * Axios 타입 확장: metadata 속성 추가
 */
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    metadata?: {
      startTime: number;
    };
  }
}

/**
 * API URL 동적 결정 함수
 * 환경변수 우선, 없으면 현재 호스트 기반으로 URL 생성
 */
const getApiBaseUrl = () => {
  // 환경변수 확인
  const configuredUrl = process.env.NEXT_PUBLIC_SPRING_API_URL;

  // 환경변수가 없거나 미치환 변수가 있는 경우
  if (
    !configuredUrl ||
    configuredUrl.includes("${") ||
    configuredUrl === "undefined"
  ) {
    // 브라우저 환경인 경우 현재 호스트 기반으로 URL 생성
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname;
      const protocol = window.location.protocol;
      const port = hostname === "localhost" ? ":8080" : ""; // 개발환경에서는 Gateway 포트 사용
      return `${protocol}//${hostname}${port}`;
    }
  }

  return configuredUrl;
};

/**
 * Axios 인스턴스 생성 및 설정
 * JWT 쿠키 자동 전송, 타임아웃, 기본 헤더 설정
 */
const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true, // JWT 쿠키 자동 전송 (인증의 핵심)
  timeout: 10000, // 10초 타임아웃
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 요청 인터셉터
 * 모든 요청 전에 실행됩니다
 */
api.interceptors.request.use(
  (config) => {
    // 요청 시작 시간 기록
    config.metadata = { startTime: performance.now() };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터
 * 모든 응답 후에 실행됩니다
 */
api.interceptors.response.use(
  (response) => {
    // 응답 성공 시 실행 시간 계산
    const endTime = performance.now();
    const startTime = response.config.metadata?.startTime || endTime;
    const duration = (endTime - startTime).toFixed(2);

    console.log(
      `API 응답 성공: ${response.config.method?.toUpperCase()} ${
        response.config.url
      } (${duration}ms)`
    );

    return response;
  },
  (error) => {
    // 응답 에러 시 실행 시간 계산
    const endTime = performance.now();
    const startTime = error.config?.metadata?.startTime || endTime;
    const duration = (endTime - startTime).toFixed(2);

    console.log(
      `API 응답 실패: ${error.config?.method?.toUpperCase()} ${
        error.config?.url
      } (${duration}ms)`,
      error.response?.status
    );

    return Promise.reject(error);
  }
);

export default api;
export { api as apiClient };
