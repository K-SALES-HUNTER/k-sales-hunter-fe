import {
  detailContentMock,
  detailImagesMock,
  pdpSellerMock,
  priceScenariosMock,
  productImagesMock,
  salesOpsMock,
  shippingMethodsMock,
  type SalesOpsData,
} from '@/mocks/sales';

const MOCK_DELAY_MS = 300;

/** 단계 저장 — 다음 옵션·속성을 Shopee에서 받아오는 흉내 (0.5초) */
export const SALES_STEP_DELAY_MS = 500;

const withDelay = <T>(data: T, delay = MOCK_DELAY_MS): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

/** 판매 정보 입력 데이터 — 백엔드 연동 전 목. 연동 시 productId·countryCode로 조회 */
export const fetchSalesInfo = (productId: number, countryCode: string) => {
  void productId;
  void countryCode;
  return withDelay({
    priceScenarios: priceScenariosMock,
    shippingMethods: shippingMethodsMock,
  });
};

/** 상세 페이지 콘텐츠 (ko/현지 언어 목) */
export const fetchDetailContent = (productId: number, countryCode: string) => {
  void productId;
  void countryCode;
  return withDelay({
    content: detailContentMock,
    seller: pdpSellerMock,
    productImages: productImagesMock,
    detailImages: detailImagesMock,
  });
};

/** 판매 관리 데이터 (주문·재고·성과·가격) */
export const fetchSalesOps = (productId: number, countryCode: string): Promise<SalesOpsData> => {
  void productId;
  void countryCode;
  return withDelay(salesOpsMock);
};

/** 단계별 저장 목 — 저장한 데이터에 맞는 다음 옵션을 받아오는 흉내 */
export const saveSalesStep = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, SALES_STEP_DELAY_MS));
