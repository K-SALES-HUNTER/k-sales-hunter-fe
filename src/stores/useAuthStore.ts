import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isLoggedIn: boolean;
  email: string | null;
  login: (email: string) => void;
  logout: () => void;
}

/**
 * 목 인증 스토어 — 백엔드 연동 전까지 로컬에서만 로그인 상태를 유지한다.
 * 실제 연동 시 login()을 API 호출 + 토큰 저장으로 교체.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      email: null,
      login: (email) => set({ isLoggedIn: true, email }),
      logout: () => set({ isLoggedIn: false, email: null }),
    }),
    { name: 'ksh-auth' },
  ),
);
