import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchProduct, fetchProducts } from '@/apis/products';
import { PENDING_PRODUCT_IDS } from '@/mocks/products';
import { applyDemoProgress, useDemoProgressStore } from '@/stores/useDemoProgressStore';
import type { Product } from '@/types/product';

/**
 * 상품 목록 — 아직 등록하지 않은 상품은 감추고, 등록을 마친 상품에는 진행 상태를 반영한다.
 *
 * [DEMO-ONLY] select 콜백 전체가 시연 전용이다.
 * 백엔드 연동 시: select 옵션과 useDemoProgressStore·PENDING_PRODUCT_IDS import를 지우고
 * `useQuery({ queryKey: ['products'], queryFn: fetchProducts })` 한 줄로 되돌린다.
 */
export const useProducts = () => {
  const registeredProductIds = useDemoProgressStore((s) => s.registeredProductIds);
  const patchByKey = useDemoProgressStore((s) => s.patchByKey);

  const select = useCallback(
    (list: Product[]) =>
      list
        .filter(
          (product) =>
            !PENDING_PRODUCT_IDS.includes(product.id) ||
            registeredProductIds.includes(product.id),
        )
        .map((product) => applyDemoProgress(product, patchByKey)),
    [registeredProductIds, patchByKey],
  );

  return useQuery({ queryKey: ['products'], queryFn: fetchProducts, select });
};

/** [DEMO-ONLY] select에서 진행 상태를 덮어씌운다 — 백엔드 연동 시 select 옵션만 제거 */
export const useProduct = (productId: number) => {
  const patchByKey = useDemoProgressStore((s) => s.patchByKey);

  const select = useCallback(
    (product: Product) => applyDemoProgress(product, patchByKey),
    [patchByKey],
  );

  return useQuery({
    queryKey: ['products', productId],
    queryFn: () => fetchProduct(productId),
    enabled: Number.isFinite(productId),
    select,
  });
};
