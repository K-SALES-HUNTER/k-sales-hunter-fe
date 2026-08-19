import mallangBlack from '@/assets/images/mallang-black.png';
import mallangSet from '@/assets/images/detailimg-result.png';
import productEcoTote from '@/assets/images/product-eco-tote.png';
import productLipTint from '@/assets/images/product-lip-tint.png';
import type { Country, DashboardSummary, RecentProduct } from '@/types/dashboard';
import { DEMO_PRODUCT_ID } from './products';

/** 분석 보고서가 생성된 국가 — 상품 등록 시 3개국을 한 번에 분석한다 */
const COUNTRIES: Country[] = [
  { code: 'TH', name: '태국' },
  { code: 'SG', name: '싱가포르' },
  { code: 'VN', name: '베트남' },
];

/**
 * 시연 시작 시점 요약 — 기존 셀러가 비건 립틴트를 싱가포르·태국에서 판매 중인 상태.
 * 누적 210개 · 매출 ₩4,158,000 · 순이익률 28.3%
 *
 * Figma 12:12986 기준 필드 의미:
 *   revenue       = 큰 숫자 '매출'(이번 달)
 *   netProfitRate = 우측 타일 '순이익'(%)
 *   totalSales    = 판매 성과의 '총 매출'(누적)
 *   monthlyRevenue = 월별 매출 추이
 */
export const dashboardSummaryMock: DashboardSummary = {
  revenue: 1414000,
  revenueAsOf: '2026-08-22',
  netProfitRate: 28.3,
  netProfitDelta: 2.4,
  totalSales: 4158000,
  orderCount: 168,
  activeProductCount: 1,
  monthlyRevenue: [
    { month: '6월', value: 1344000 },
    { month: '7월', value: 1400000 },
    { month: '8월', value: 1414000 },
  ],
};

/**
 * [DEMO-ONLY] 인형의 베트남 판매까지 시작한 뒤의 요약 — 기존 실적 + 인형 실적 합산.
 *   립틴트 누적 매출 ₩4,158,000 (이번 달 ₩1,414,000)
 * + 인형   누적 매출 ₩2,572,100 (이번 달 ₩1,011,500)
 * = 누적 ₩6,730,100 · 이번 달 ₩2,425,500 · 주문 244건 · 판매 중 상품 2개
 * 순이익률 = 순이익 ₩1,918,260 / 매출 ₩6,730,100 = 28.5%
 * 인형 실적은 "업로드 2주 후"의 값이라, 영상 편집에서 해당 자막이 필요하다.
 * 백엔드 연동 시: 요약이 한 벌로 합쳐지므로 이 상수를 삭제한다.
 */
export const dashboardSummaryAfterSalesMock: DashboardSummary = {
  revenue: 2425500,
  revenueAsOf: '2026-08-22',
  netProfitRate: 28.5,
  netProfitDelta: 3.1,
  totalSales: 6730100,
  orderCount: 244,
  activeProductCount: 2,
  monthlyRevenue: [
    { month: '6월', value: 1777500 },
    { month: '7월', value: 2527100 },
    { month: '8월', value: 2425500 },
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
    revenue: 4158000,
    registeredAt: '2026-03-11',
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

