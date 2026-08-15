import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { CountryStage, Product, SalesStatus } from '@/types/product';

/**
 * [DEMO-ONLY] 시연용 진행 상태 스토어 — 파일 전체가 시연 전용이다.
 *
 * 목 데이터는 "분석만 끝난 상태"만 담고, 그 뒤 단계(판매 정보 저장 → 상세 페이지 생성 →
 * Shopee 업로드)는 사용자가 실제로 그 동작을 했을 때 여기에 쌓인다.
 * 덕분에 아직 만들지 않은 페이지의 탭이 미리 보이지 않고, 화면이 실제 서비스처럼 단계적으로 열린다.
 *
 * 백엔드 연동 시: 이 파일을 삭제하고, 서버가 내려주는 상품 상태값(countries[].stage /
 * hasSalesInfo / hasDetailPage / salesStatus)을 그대로 쓴다. 호출부는 DEMO.md의
 * 롤백 점검 리스트에 전부 정리돼 있다.
 */

export interface CountryProgressPatch {
  hasSalesInfo?: boolean;
  hasDetailPage?: boolean;
  salesStatus?: SalesStatus;
}

interface DemoProgressState {
  /** 등록을 마친 상품 — 등록 전에는 상품 목록·대시보드에 노출되지 않는다 */
  registeredProductIds: number[];
  /** `${productId}-${countryCode}` → 진행 상태 변경분 */
  patchByKey: Record<string, CountryProgressPatch>;
  markRegistered: (productId: number) => void;
  markSalesInfoSaved: (productId: number, countryCode: string) => void;
  markDetailPageCreated: (productId: number, countryCode: string) => void;
  markUploaded: (productId: number, countryCode: string) => void;
  /** 시연을 처음부터 다시 하기 위한 초기화 */
  resetDemo: () => void;
}

export const progressKey = (productId: number, countryCode: string) =>
  `${productId}-${countryCode}`;

const patch = (
  state: DemoProgressState,
  productId: number,
  countryCode: string,
  next: CountryProgressPatch,
) => ({
  patchByKey: {
    ...state.patchByKey,
    [progressKey(productId, countryCode)]: {
      ...state.patchByKey[progressKey(productId, countryCode)],
      ...next,
    },
  },
});

export const useDemoProgressStore = create<DemoProgressState>()(
  persist(
    (set) => ({
      registeredProductIds: [],
      patchByKey: {},
      markRegistered: (productId) =>
        set((s) =>
          s.registeredProductIds.includes(productId)
            ? s
            : { registeredProductIds: [...s.registeredProductIds, productId] },
        ),
      markSalesInfoSaved: (productId, countryCode) =>
        set((s) => patch(s, productId, countryCode, { hasSalesInfo: true })),
      markDetailPageCreated: (productId, countryCode) =>
        set((s) => patch(s, productId, countryCode, { hasSalesInfo: true, hasDetailPage: true })),
      markUploaded: (productId, countryCode) =>
        set((s) =>
          patch(s, productId, countryCode, {
            hasSalesInfo: true,
            hasDetailPage: true,
            salesStatus: '판매중',
          }),
        ),
      resetDemo: () => set({ registeredProductIds: [], patchByKey: {} }),
    }),
    {
      name: 'ksh-demo-progress',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

/** 진행 상태로부터 국가 카드의 단계를 되계산한다 (상세 페이지 > 판매 정보 > 보고서 순) */
const resolveStage = (hasSalesInfo: boolean, hasDetailPage: boolean): CountryStage => {
  if (hasDetailPage) return 'detail';
  if (hasSalesInfo) return 'sales-info';
  return 'report';
};

/**
 * 목 상품에 진행 상태를 덮어씌운다.
 * 판매를 시작하기 전에는 매출을 비워, 아직 팔지도 않은 상품에 매출이 찍히는 일이 없게 한다.
 */
export const applyDemoProgress = (
  product: Product,
  patchByKey: Record<string, CountryProgressPatch>,
): Product => {
  const countries = product.countries.map((country) => {
    const found = patchByKey[progressKey(product.id, country.code)];
    if (!found) return country;

    const hasSalesInfo = found.hasSalesInfo ?? country.hasSalesInfo;
    const hasDetailPage = found.hasDetailPage ?? country.hasDetailPage;
    return {
      ...country,
      hasSalesInfo,
      hasDetailPage,
      salesStatus: found.salesStatus ?? country.salesStatus,
      stage: resolveStage(hasSalesInfo, hasDetailPage),
    };
  });

  const hasSales = countries.some((country) => country.salesStatus !== '판매전');
  return { ...product, countries, revenue: hasSales ? product.revenue : null };
};

/** 판매를 시작한 국가가 하나라도 있는지 — 대시보드 집계 노출 조건 */
export const hasAnySales = (patchByKey: Record<string, CountryProgressPatch>) =>
  Object.values(patchByKey).some((p) => p.salesStatus && p.salesStatus !== '판매전');
