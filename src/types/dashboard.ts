/** 판매 국가 코드 (전제: 노출되는 국가는 모두 판매 가능한 국가) */
export type CountryCode = 'TH' | 'SG' | 'VN';

export interface Country {
  code: CountryCode;
  name: string;
}

export interface RecentProduct {
  id: number;
  name: string;
  /** 상품 썸네일 URL */
  image: string;
  /** 매출(원). 판매 중인 상품만 값이 있음 — 없으면 셀 비움 */
  revenue: number | null;
  /** 등록일 (YYYY-MM-DD) */
  registeredAt: string;
  /** 분석 보고서가 존재하는 국가 목록 */
  reportCountries: Country[];
}

export interface DashboardSummary {
  /** 매출(원) */
  revenue: number;
  /** 매출 기준일 (ISO) */
  revenueAsOf: string;
  /** 순이익(전체 마진율, %) */
  netProfitRate: number;
  /** 전월 대비 증감 (%p) */
  netProfitDelta: number;
  /** 총 매출(원) */
  totalSales: number;
  /** 주문량(건) */
  orderCount: number;
  /** 판매 중인 상품 수(개) */
  activeProductCount: number;
  /** 월별 매출 추이 (차트용) */
  monthlyRevenue: { month: string; value: number }[];
}
