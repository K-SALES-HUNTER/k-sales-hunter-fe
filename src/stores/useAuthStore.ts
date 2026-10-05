import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isLoggedIn: boolean;
  email: string | null;
  /** 로그인 응답의 JWT. axiosInstance 요청 인터셉터가 Authorization 헤더로 주입한다 */
  accessToken: string | null;
  login: (email: string, accessToken?: string) => void;
  logout: () => void;
}

/**
 * 인증 스토어 — 로그인 상태와 JWT 를 로컬에 유지한다.
 *
 * - POST /auth/login 응답의 accessToken 을 login(email, accessToken) 에 넘긴다.
 *   토큰 없이 login(email) 만 부르면 기존 목 로그인처럼 동작한다(연동 전 화면 호환).
 * - persist 로 localStorage('ksh-auth')에 저장돼 새로고침해도 로그인이 유지된다.
 * - axiosInstance 요청 인터셉터가 getState().accessToken 을 읽어 Authorization 헤더에 싣고,
 *   401 응답이면 logout() 으로 토큰을 지운다.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      email: null,
      accessToken: null,
      login: (email, accessToken) =>
        set({ isLoggedIn: true, email, accessToken: accessToken ?? null }),
      logout: () => set({ isLoggedIn: false, email: null, accessToken: null }),
    }),
    { name: 'ksh-auth' },
  ),
);
