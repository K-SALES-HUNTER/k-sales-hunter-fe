import { create } from 'zustand';
import { stockRowsMock, type StockRow } from '@/mocks/sales';
import type { SalesStatus } from '@/types/product';

interface SalesOpsState {
  /** `${productId}:${countryCode}` → 판매 상태 오버라이드 (없으면 product 목 기준) */
  statusByKey: Record<string, SalesStatus>;
  /** productId → 옵션 조합별 재고 (없으면 stockRowsMock 기준) */
  stockByProduct: Record<string, StockRow[]>;
  setStatus: (key: string, status: SalesStatus) => void;
  /** 재고량 추가 — 절대값 덮어쓰기가 아닌 증분 방식 (R-006-09) */
  addStock: (productId: number | string, additions: number[]) => void;
}

export const salesOpsKey = (productId: number | string, countryCode: string) =>
  `${productId}:${countryCode}`;

/**
 * 판매 중단/재개·재고 등 판매 운영 변경 상태.
 * 백엔드 연동 전에는 목 기본값 위에 세션 메모리로 덮어쓴다.
 */
export const useSalesOpsStore = create<SalesOpsState>((set) => ({
  statusByKey: {},
  stockByProduct: {},
  setStatus: (key, status) =>
    set((state) => ({ statusByKey: { ...state.statusByKey, [key]: status } })),
  addStock: (productId, additions) =>
    set((state) => {
      const current = state.stockByProduct[String(productId)] ?? stockRowsMock;
      return {
        stockByProduct: {
          ...state.stockByProduct,
          [String(productId)]: current.map((row, index) => ({
            ...row,
            qty: row.qty + Math.max(0, additions[index] ?? 0),
          })),
        },
      };
    }),
}));
