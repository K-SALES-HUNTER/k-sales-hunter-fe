import { create } from 'zustand';
import type { DetailImageTarget } from '@/mocks/detailImage';

export interface DetailImageEntry {
  id: string;
  label: string;
  src: string;
  /** AI 생성 이미지일 때 생성에 사용한 요청 문구 */
  prompt?: string;
}

interface DetailImageState {
  /** key → 추가된 이미지 (직접 업로드 + AI 생성) */
  addedByKey: Record<string, DetailImageEntry[]>;
  /** key → 기존 이미지를 재생성 결과로 덮어쓴 목록 (원본 id 유지) */
  replacedByKey: Record<string, Record<string, DetailImageEntry>>;
  /** key → 삭제한 이미지 id */
  removedByKey: Record<string, string[]>;
  addImage: (key: string, entry: DetailImageEntry) => void;
  replaceImage: (key: string, targetId: string, entry: DetailImageEntry) => void;
  removeImage: (key: string, id: string) => void;
}

/** 이미지 목록 캐시 키 — 상품·국가·대상(상품/상세) 단위로 분리 */
export const detailImageKey = (
  productId: number | string,
  countryCode: string,
  target: DetailImageTarget,
) => `${productId}:${countryCode}:${target}`;

/**
 * 상품·상세 이미지 변경 상태 (업로드 · AI 생성 · 재생성 · 삭제).
 * 백엔드 연동 전에는 목 기본 목록 위에 세션 메모리로 덮어쓴다.
 * 상세 이미지 AI 생성 화면과 상세 페이지가 이 스토어로 결과를 공유한다.
 */
export const useDetailImageStore = create<DetailImageState>((set) => ({
  addedByKey: {},
  replacedByKey: {},
  removedByKey: {},
  addImage: (key, entry) =>
    set((state) => ({
      addedByKey: { ...state.addedByKey, [key]: [...(state.addedByKey[key] ?? []), entry] },
    })),
  replaceImage: (key, targetId, entry) =>
    set((state) => {
      // 원본 id를 유지해 목록 순서·삭제 이력이 어긋나지 않게 한다
      const next = { ...entry, id: targetId };
      const added = state.addedByKey[key] ?? [];
      if (added.some((image) => image.id === targetId)) {
        return {
          addedByKey: {
            ...state.addedByKey,
            [key]: added.map((image) => (image.id === targetId ? next : image)),
          },
        };
      }
      return {
        replacedByKey: {
          ...state.replacedByKey,
          [key]: { ...(state.replacedByKey[key] ?? {}), [targetId]: next },
        },
      };
    }),
  removeImage: (key, id) =>
    set((state) => ({
      removedByKey: {
        ...state.removedByKey,
        [key]: [...(state.removedByKey[key] ?? []), id],
      },
    })),
}));

interface ResolveSlices {
  added?: DetailImageEntry[];
  replaced?: Record<string, DetailImageEntry>;
  removed?: string[];
}

/** 목 기본 목록 + 스토어 변경분을 합쳐 실제 노출 목록을 만든다 */
export const resolveImages = (
  base: DetailImageEntry[],
  { added, replaced, removed }: ResolveSlices,
): DetailImageEntry[] => {
  const removedIds = new Set(removed ?? []);
  return [...base, ...(added ?? [])]
    .filter((image) => !removedIds.has(image.id))
    .map((image) => replaced?.[image.id] ?? image);
};
