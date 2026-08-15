import mallangBlack from '@/assets/images/mallang-black.png';
import mallangSet from '@/assets/images/detailimg-result.png';
import productEcoTote from '@/assets/images/product-eco-tote.png';
import productLipTint from '@/assets/images/product-lip-tint.png';
import type { Country, DashboardSummary, RecentProduct } from '@/types/dashboard';
import { DEMO_PRODUCT_ID } from './products';

/** 분석 보고서가 생성된 국가 — 상품 등록 시 3개국을 한 번에 분석한다 */
const COUNTRIES: Country[] = [
  { code: 'VN', name: '베트남' },
  { code: 'SG', name: '싱가포르' },
  { code: 'TH', name: '태국' },
];

/**
 * 판매 시작 전 요약 — 아직 업로드한 상품이 없어 집계할 매출이 없다.
 * (OverviewSection에서 revenue는 '순이익', totalSales는 '총 매출'로 표기된다)
 */
export const dashboardSummaryMock: DashboardSummary = {
  revenue: 0,
  revenueAsOf: '2026-08-22',
  netProfitRate: 0,
  netProfitDelta: 0,
  totalSales: 0,
  orderCount: 0,
  activeProductCount: 0,
  monthlyRevenue: [
    { month: '6월', value: 0 },
    { month: '7월', value: 0 },
    { month: '8월', value: 0 },
  ],
};

/**
 * [DEMO-ONLY] 베트남 판매를 시작한 뒤의 요약 — 판매 관리 실적과 같은 원장을 쓴다.
 * 누적 89개 판매 · 매출 ₩2,572,100 · 순이익 ₩742,260 (개당 순이익 ₩8,340)
 * 실제로는 "업로드 2주 후"의 값이라, 영상 편집에서 해당 자막이 필요하다.
 * 백엔드 연동 시: 요약이 한 벌로 합쳐지므로 이 상수를 삭제한다.
 */
export const dashboardSummaryAfterSalesMock: DashboardSummary = {
  revenue: 742260,
  revenueAsOf: '2026-08-22',
  netProfitRate: 28.9,
  netProfitDelta: 3.1,
  totalSales: 2572100,
  orderCount: 76,
  activeProductCount: 1,
  monthlyRevenue: [
    { month: '6월', value: 125100 },
    { month: '7월', value: 325260 },
    { month: '8월', value: 291900 },
  ],
};

export const recentProductsMock: RecentProduct[] = [
  {
    id: DEMO_PRODUCT_ID,
    name: '말랑 프렌즈 캐릭터 인형',
    image: mallangSet,
    revenue: 2572100,
    registeredAt: '2026-06-15',
    reportCountries: COUNTRIES,
  },
  {
    id: 2,
    name: '비건 립틴트 4종 세트',
    image: productLipTint,
    revenue: null,
    registeredAt: '2026-05-28',
    reportCountries: COUNTRIES,
  },
  {
    id: 3,
    name: '코튼 에코백 (내추럴)',
    image: productEcoTote,
    revenue: null,
    registeredAt: '2026-05-12',
    reportCountries: COUNTRIES,
  },
  {
    id: 4,
    name: '말랑 프렌즈 미니 키링',
    image: mallangBlack,
    revenue: null,
    registeredAt: '2026-05-12',
    reportCountries: COUNTRIES,
  },
];

