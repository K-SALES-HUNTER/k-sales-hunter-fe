import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchDashboardSummary,
  fetchHasLinkedMarket,
  fetchRecentProducts,
} from '@/apis/dashboard';
import { PENDING_PRODUCT_IDS } from '@/mocks/products';
import { hasAnySales, useDemoProgressStore } from '@/stores/useDemoProgressStore';
import type { RecentProduct } from '@/types/dashboard';

/**
 * [DEMO-ONLY] 판매 개시 여부에 따라 0원 요약 / 실적 요약을 갈라 준다.
 * 백엔드 연동 시: hasSales 계산과 queryKey의 hasSales를 지우고 fetchDashboardSummary()를 인자 없이 호출한다.
 */
export const useDashboardSummary = () => {
  const patchByKey = useDemoProgressStore((s) => s.patchByKey);
  const hasSales = hasAnySales(patchByKey);

  return useQuery({
    queryKey: ['dashboard', 'summary', hasSales],
    queryFn: () => fetchDashboardSummary(hasSales),
  });
};

/**
 * 최근 상품 — 등록 전 상품은 감추고, 판매 시작 전에는 매출 셀을 비운다.
 * [DEMO-ONLY] select 콜백 전체가 시연 전용 — 백엔드 연동 시 select 옵션을 제거한다.
 */
export const useRecentProducts = () => {
  const registeredProductIds = useDemoProgressStore((s) => s.registeredProductIds);
  const patchByKey = useDemoProgressStore((s) => s.patchByKey);
  const hasSales = hasAnySales(patchByKey);

  const select = useCallback(
    (list: RecentProduct[]) =>
      list
        .filter(
          (product) =>
            !PENDING_PRODUCT_IDS.includes(product.id) ||
            registeredProductIds.includes(product.id),
        )
        .map((product) => (hasSales ? product : { ...product, revenue: null })),
    [registeredProductIds, hasSales],
  );

  return useQuery({
    queryKey: ['dashboard', 'recentProducts'],
    queryFn: fetchRecentProducts,
    select,
  });
};

export const useHasLinkedMarket = () =>
  useQuery({ queryKey: ['market', 'linked'], queryFn: fetchHasLinkedMarket });
