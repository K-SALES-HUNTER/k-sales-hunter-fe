import productEcoTote from '@/assets/images/product-eco-tote.png';
import productLedStrip from '@/assets/images/product-led-strip.png';
import productLipTint from '@/assets/images/product-lip-tint.png';
import productTravelMug from '@/assets/images/product-travel-mug.png';
import type { Country, DashboardSummary, RecentProduct } from '@/types/dashboard';

const COUNTRIES: Country[] = [
  { code: 'TH', name: '태국' },
  { code: 'SG', name: '싱가포르' },
  { code: 'VN', name: '베트남' },
];

export const dashboardSummaryMock: DashboardSummary = {
  revenue: 3200458,
  revenueAsOf: '2026-07-28',
  netProfitRate: 38.4,
  netProfitDelta: 3.3,
  totalSales: 60000,
  orderCount: 42,
  activeProductCount: 4,
  monthlyRevenue: [
    { month: '2월', value: 1200000 },
    { month: '3월', value: 1750000 },
    { month: '4월', value: 1580000 },
    { month: '5월', value: 2400000 },
    { month: '6월', value: 3200458 },
  ],
};

export const recentProductsMock: RecentProduct[] = [
  {
    id: 1,
    name: '제주 화산송이 클렌저 150ml',
    image: productTravelMug,
    revenue: null,
    registeredAt: '2026-06-20',
    reportCountries: COUNTRIES,
  },
  {
    id: 2,
    name: '한류 스타 포토카드 패키지',
    image: productEcoTote,
    revenue: 15000,
    registeredAt: '2026-06-20',
    reportCountries: COUNTRIES,
  },
  {
    id: 3,
    name: '서울 컬렉션 헤어미스트',
    image: productLipTint,
    revenue: 6000,
    registeredAt: '2026-06-20',
    reportCountries: COUNTRIES,
  },
  {
    id: 4,
    name: '비건 립틴트 4종 세트',
    image: productLedStrip,
    revenue: null,
    registeredAt: '2026-06-20',
    reportCountries: COUNTRIES,
  },
];

/** 마켓 연동 여부 목 — false면 대시보드 첫 진입 시 환영 모달 노출 */
export const hasLinkedMarketMock = false;
