import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface SidebarState {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

/**
 * 사이드바 열림/닫힘 상태 — 레이아웃 명세: 상태는 "세션 동안 유지"이므로 sessionStorage 사용.
 * 1280px 경계에서의 자동 접힘/펼침은 useResponsiveSidebar 훅이 처리.
 */
export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: false,
      toggle: () => set((s) => ({ collapsed: !s.collapsed })),
      setCollapsed: (collapsed) => set({ collapsed }),
    }),
    { name: 'ksh-sidebar', storage: createJSONStorage(() => sessionStorage) },
  ),
);
