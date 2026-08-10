import { AI_FILL_MOCK, CATEGORY_OPTIONS, type CategoryOption } from '@/mocks/productForm';

const CATEGORY_DELAY_MS = 300;
/** AI 자동 채우기 처리 중 대상 필드 스켈레톤 노출 시간 (1.2초) */
const AI_FILL_DELAY_MS = 1200;

const withDelay = <T>(data: T, ms: number): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

/** 카테고리 목록 — 백엔드 연동 전 목. 연동 시 내부만 axios로 교체 */
export const fetchCategoryOptions = (): Promise<CategoryOption[]> =>
  withDelay(CATEGORY_OPTIONS, CATEGORY_DELAY_MS);

export type AiFillResult = typeof AI_FILL_MOCK;

/** AI 자동 채우기 (트렌드 헌터 R-001-02) — 목 응답 */
export const requestAiFill = (): Promise<AiFillResult> =>
  withDelay(AI_FILL_MOCK, AI_FILL_DELAY_MS);
