import {
  detailContentMock,
  detailImagesMock,
  pdpSellerMock,
  priceScenariosMock,
  productImagesMock,
  salesOpsMock,
  shippingMethodsMock,
  type CategoryAttr,
  type DetailImageItem,
  type PdpContent,
  type PdpSeller,
  type PriceScenario,
  type ProductImageItem,
  type SalesOpsData,
  type ShippingMethod,
} from '@/mocks/sales';
import { axiosInstance } from './axiosInstance';
import { USE_MOCK_API } from './config';
import { pollUntil } from './poll';

const MOCK_DELAY_MS = 300;

/** 단계 저장 — 다음 옵션·속성을 Shopee에서 받아오는 흉내 (0.5초) */
export const SALES_STEP_DELAY_MS = 500;

const withDelay = <T>(data: T, delay = MOCK_DELAY_MS): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

/* ─────────────────────────── 판매 정보 ─────────────────────────── */

export interface OptionLevel {
  name: string;
  label: string;
  values: string[];
}

/** 판매 정보 수익 계산 기준 — 서버가 국가별 요율표(fee_schedules)에서 내려준다 */
export interface MarginBasis {
  dutyRate: number;
  vatRate: number;
  shopeeFeeRate: number;
  paymentFeeRate: number;
  fixedCostKrw: number;
  fxNote: string;
  taxBase: string;
}

/** AI 추천값 (카테고리·속성·옵션). POST .../sales-info/suggest 응답과 같은 모양 */
export interface SalesSuggestion {
  shopeeCategoryOptions: { value: string; label: string }[];
  shopeeCategoryDefault: string;
  categoryAttrs: CategoryAttr[];
  optionLevel1: OptionLevel | null;
  optionLevel2: OptionLevel | null;
  stockHint: string;
}

export interface SalesInfoData extends Partial<SalesSuggestion> {
  priceScenarios: PriceScenario[];
  shippingMethods: ShippingMethod[];
  /** 아래는 실연동 응답에만 있다. 목 모드에서는 각 섹션이 mocks/sales.ts 값을 쓴다 */
  marginBasis?: MarginBasis;
  appliedBadges?: string[];
  packaging?: { weight: number; width: number; depth: number; height: number };
  saved?: SalesInfoBody | null;
}

/** 판매 정보 입력 데이터 — GET /products/{id}/countries/{cc}/sales-info */
export const fetchSalesInfo = async (
  productId: number,
  countryCode: string,
): Promise<SalesInfoData> => {
  if (USE_MOCK_API) {
    return withDelay({
      priceScenarios: priceScenariosMock,
      shippingMethods: shippingMethodsMock,
    });
  }
  const { data } = await axiosInstance.get<SalesInfoData>(
    `/products/${productId}/countries/${countryCode}/sales-info`,
    { timeout: 20_000 },
  );
  return data;
};

export interface SalesInfoBody {
  selectedTier: string;
  finalPrice: number;
  shippingMethod: string;
  category: string;
  attrs: Record<string, string>;
  useOptions: boolean;
  option1: OptionLevel | null;
  option2: OptionLevel | null;
  stock: { option1: string; option2: string; qty: number; extraPrice: number }[];
}

/** 판매 정보 확정 — PUT .../sales-info. 옵션 2단·조합 50개를 넘으면 422 */
export const saveSalesInfo = async (
  productId: number,
  countryCode: string,
  body: SalesInfoBody,
): Promise<void> => {
  if (USE_MOCK_API) return withDelay(undefined, SALES_STEP_DELAY_MS);
  await axiosInstance.put(`/products/${productId}/countries/${countryCode}/sales-info`, body);
};

/** 단계별 저장 목 — 저장한 데이터에 맞는 다음 옵션을 받아오는 흉내 */
export const saveSalesStep = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, SALES_STEP_DELAY_MS));

/* ─────────────────────────── 상세 페이지 ─────────────────────────── */

export interface DetailContentData {
  content: { ko: PdpContent; local: PdpContent };
  seller: PdpSeller;
  productImages: ProductImageItem[];
  detailImages: DetailImageItem[];
  /** 실연동 응답에만 있다 */
  status?: 'DONE' | 'NEEDS_REVIEW';
  qualityScore?: number;
  qualityIssues?: { kind: string; detail: string; hardBlock: boolean }[];
  mainImageId?: string | null;
}

interface DetailPageResponse extends Omit<DetailContentData, 'content' | 'seller'> {
  content: { ko: PdpContent; local: PdpContent | null };
  seller: Omit<PdpSeller, 'metaLocal'> & { metaLocal?: string };
}

const toDetailContent = (data: DetailPageResponse): DetailContentData => ({
  ...data,
  content: { ko: data.content.ko, local: data.content.local ?? data.content.ko },
  seller: { ...data.seller, metaLocal: data.seller.metaLocal ?? data.seller.meta },
});

const detailPath = (productId: number, countryCode: string) =>
  `/products/${productId}/countries/${countryCode}/detail-page`;

/** 상세 페이지 콘텐츠 — GET .../detail-page (ko 검수본 + 현지어 업로드본) */
export const fetchDetailContent = async (
  productId: number,
  countryCode: string,
): Promise<DetailContentData> => {
  if (USE_MOCK_API) {
    return withDelay({
      content: detailContentMock,
      seller: pdpSellerMock,
      productImages: productImagesMock,
      detailImages: detailImagesMock,
    });
  }
  const { data } = await axiosInstance.get<DetailPageResponse>(detailPath(productId, countryCode));
  return toDetailContent(data);
};

/**
 * 상세 페이지 생성 — POST .../detail-page 후 완료까지 폴링 (생성 잡 20~60초).
 * 서버 품질 검수가 미달이어도 결과는 온다 (status=NEEDS_REVIEW).
 */
export const createDetailPage = async (
  productId: number,
  countryCode: string,
  signal?: AbortSignal,
): Promise<void> => {
  if (USE_MOCK_API) return withDelay(undefined, 1500);
  await axiosInstance.post(detailPath(productId, countryCode));
  const last = await pollUntil(
    () =>
      axiosInstance.get<{ status: string; errorCode?: string }>(detailPath(productId, countryCode)),
    { done: (response) => response.status === 200, signal },
  );
  if (last.data.status === 'FAILED') {
    throw new Error(last.data.errorCode ?? '상세 페이지 생성에 실패했습니다.');
  }
};

/** 상세 페이지 텍스트 수정 — PATCH .../detail-page/content (현지어본도 다시 옮긴다) */
export const updateDetailContent = async (
  productId: number,
  countryCode: string,
  draft: { name: string; description: string },
): Promise<DetailContentData | null> => {
  if (USE_MOCK_API) return null;
  const { data } = await axiosInstance.patch<DetailPageResponse>(
    `${detailPath(productId, countryCode)}/content`,
    { ...draft, retranslate: true },
    { timeout: 20_000 },
  );
  return toDetailContent(data);
};

/** 상세 페이지 이미지 직접 업로드 — POST .../detail-page/images (multipart) */
export const uploadDetailImage = async (
  productId: number,
  countryCode: string,
  target: 'product' | 'detail',
  file: File,
): Promise<{ id: string; label: string; src: string }> => {
  const body = new FormData();
  body.append('file', file);
  body.append('target', target);
  const { data } = await axiosInstance.post(`${detailPath(productId, countryCode)}/images`, body, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60_000,
  });
  return data;
};

/* ─────────────────────────── 판매 관리 ─────────────────────────── */

/** 판매 관리 데이터 (주문·재고·성과·가격) */
export const fetchSalesOps = (productId: number, countryCode: string): Promise<SalesOpsData> => {
  void productId;
  void countryCode;
  return withDelay(salesOpsMock);
};
