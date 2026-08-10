import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface AiChatMessage {
  id: number;
  role: 'user' | 'ai';
  text: string;
}

interface AiChatState {
  messages: AiChatMessage[];
  /** 목 응답 대기 상태 */
  replying: boolean;
  send: (text: string) => void;
}

/** 목 AI 응답 — 백엔드(코파일럿 R-005) 연동 시 API 스트리밍으로 교체 */
const MOCK_REPLY =
  '요청하신 내용을 분석했어요. 현재는 목 응답으로, 백엔드 코파일럿(R-005) 연동 후 실제 분석 결과가 표시됩니다. 보고서에 영향을 주는 요청은 재생성 · 타 국가 추가 분석 · 입력 정보 수정 3가지로 한정됩니다.';

let nextId = 1;

/**
 * AI 패널 대화 스토어 (Figma 335:3411 주석: 페이지가 바뀌어도 대화 내용 유지)
 * 세션 동안 유지 — sessionStorage persist.
 */
export const useAiChatStore = create<AiChatState>()(
  persist(
    (set) => ({
      messages: [],
      replying: false,
      send: (text) => {
        set((s) => ({
          messages: [...s.messages, { id: nextId++, role: 'user', text }],
          replying: true,
        }));
        setTimeout(() => {
          set((s) => ({
            messages: [...s.messages, { id: nextId++, role: 'ai', text: MOCK_REPLY }],
            replying: false,
          }));
        }, 800);
      },
    }),
    {
      name: 'ksh-ai-chat',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ messages: s.messages }),
      onRehydrateStorage: () => (state) => {
        if (state) nextId = Math.max(0, ...state.messages.map((m) => m.id)) + 1;
      },
    },
  ),
);
