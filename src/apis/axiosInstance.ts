import axios from 'axios';

/**
 * 공용 axios 인스턴스
 * - baseURL은 .env의 VITE_API_BASE_URL 사용 (.env.example 참고)
 * - 도메인별 API 함수는 src/apis 하위에 파일을 나눠 작성
 */
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use((config) => {
  // TODO: 로그인 기능 추가 시 토큰 주입
  // const token = useAuthStore.getState().accessToken;
  // if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: 공통 에러 처리 (401 리다이렉트, 토스트 등)
    return Promise.reject(error);
  },
);
