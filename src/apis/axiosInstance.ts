import axios from 'axios';

import { PATH } from '@/routes/paths';
import { useAuthStore } from '@/stores/useAuthStore';

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

/** 모든 요청에 로그인 토큰을 싣는다. 백엔드 JWT 필터가 이 헤더로 사용자를 식별한다 */
axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * 토큰이 만료·위조되면(401) 로그아웃하고 로그인 화면으로 보낸다.
 * 이미 로그인 화면이면 이동하지 않는다(로그인 실패 401 에서 새로고침 반복 방지).
 * 에러는 그대로 다시 던져 각 화면이 토스트 등으로 처리할 수 있게 한다.
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (window.location.pathname !== PATH.LOGIN) window.location.assign(PATH.LOGIN);
    }
    return Promise.reject(error);
  },
);
