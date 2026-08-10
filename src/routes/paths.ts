export const PATH = {
  ROOT: '/',
  LOGIN: '/login',
  JOIN: '/join',
  DASHBOARD: '/dashboard',
  PRODUCTS: '/products',
  PRODUCT_REGISTER: '/products/new',
  SETTINGS: '/settings',
  SETTINGS_PASSWORD: '/settings/password',
  SETTINGS_MARKET_CONNECT: '/settings/marketplace/connect',
} as const;

/** 동적 라우트 빌더 — 라우트 정의는 router.tsx의 패턴과 1:1 대응 */
export const buildPath = {
  productEdit: (productId: number | string) => `/products/${productId}/edit`,
  totalReport: (productId: number | string) => `/products/${productId}/report`,
  countryReport: (productId: number | string, country: string) =>
    `/products/${productId}/report/${country}`,
  salesInfo: (productId: number | string, country: string) =>
    `/products/${productId}/sales/${country}`,
  detailPage: (productId: number | string, country: string) =>
    `/products/${productId}/detail/${country}`,
  /** 상세/상품 이미지 AI 생성 — target=product|detail, imageId=재생성 대상 */
  detailImage: (productId: number | string, country: string) =>
    `/products/${productId}/detail/${country}/image`,
  salesOps: (productId: number | string, country: string) =>
    `/products/${productId}/sales-ops/${country}`,
  stockAdd: (productId: number | string) => `/products/${productId}/stock/add`,
} as const;
