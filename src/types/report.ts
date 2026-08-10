import type { CountryCode, CountryFitGrade, ScoreGrade } from './product';

/**
 * 4축 지표 한 항목 (수요·경쟁 강도·K-트렌드 적합도·수익성)
 * - invert: 경쟁 강도처럼 "높을수록 불리"한 축 — 색 의미 반대 적용 (RPT-01-01 #6)
 * - 등급 + 원점수 병기 필수 (점수 계산은 코드, 해설만 LLM)
 */
export interface AxisMetric {
  label: string;
  grade: ScoreGrade;
  /** 원점수 (0~100) */
  score: number;
  invert?: boolean;
  /** 한 줄 해설 (국가별 보고서 지표 행) */
  comment?: string;
}

/** 전체 보고서 국가 카드 데이터 (순위·적합도·추천가) — 진행 단계는 product.countries에서 */
export interface TotalReportCountry {
  code: CountryCode;
  rank: number;
  fitGrade: CountryFitGrade;
  /** 현지 통화 표기 (₫/฿/S$) */
  priceLocalText: string;
  /** 원화 환산가 */
  priceKrw: number;
}

/** 판매 현황 집계 (AI 산출값 아님 — R-006-08 주문 집계) */
export interface SalesStatusSummary {
  /** 집계 기준일 (YYYY-MM-DD) */
  asOf: string;
  totalRevenue: number;
  monthRevenue: number;
  /** 전월 대비 증감 (%p) */
  monthDeltaPct: number;
  orderCount: number;
  /** 최근 6개월 매출 추이 */
  monthlyTrend: { label: string; value: number }[];
  /** 국가별 매출 — 판매 중 국가만 렌더 대상 */
  countryRevenues: { code: CountryCode; name: string; revenue: number }[];
}

/** RPT-01-01 전체 분석 보고서 */
export interface TotalReport {
  /** 한 줄 결론 (예: '베트남 우선 진입을 추천합니다.') */
  conclusionTitle: string;
  /** 근거 문단 */
  conclusionBody: string;
  metrics: AxisMetric[];
  countries: TotalReportCountry[];
  investigation: {
    summary: string;
    countries: string[];
    criteria: string[];
    platforms: string[];
  };
  nextAction: string;
  /** 판매 이력이 없으면 null (판매 현황 섹션 미렌더) */
  sales: SalesStatusSummary | null;
}

export interface CompetitionStat {
  label: string;
  value: string;
  /** 불리한 지표 강조 (유사 상품 수 '많음' 등) */
  tone?: 'bad';
}

/**
 * 가격대 분포 한 구간 (Figma 319:2719) — 저가형·중간형·프리미엄 3분류.
 * 가로 띠를 weight 비율로 나눠 채운다 (히스토그램이 아니라 구간 띠).
 */
export interface PriceTier {
  label: string;
  /** 띠에서 차지하는 비율 가중치 (상대값) */
  weight: number;
}

/** 권장가 마커 — 가격대 띠 위 같은 축에 표시 (Figma 319:2731) */
export interface PriceMarker {
  label: string;
  /** 띠 좌측 기준 0~1 위치 */
  ratio: number;
}

export interface CompetitorTypeRow {
  type: string;
  priceRange: string;
  strength: string;
  weakness: string;
  strategy: string;
}

export interface ShippingOption {
  id: 'direct' | 'sls';
  name: string;
  costText: string;
  periodText: string;
  /** 판매 유형 적합 뱃지 (셀러 유형 맞춤 문구) */
  fitBadge: string;
  /** AI 추천 방식 — 기본 선택 */
  recommended: boolean;
  /** 선택 시 하단 설명 */
  description: string;
}

/** 가격 3안 시나리오 — 선택 시 하단 지표·비용 표 즉시 재계산 (RPT-02-01 #19~22) */
export interface PriceScenario {
  id: 'low' | 'mid' | 'high';
  label: string;
  price: number;
  priceLocalText: string;
  netProfit: number;
  marginRate: number;
  breakevenUnits: number;
  badge: string;
  recommended?: boolean;
  summary: string;
  costRows: { label: string; amountText: string; emphasis?: boolean }[];
}

/** RPT-02-01 국가별 분석 보고서 */
export interface CountryReport {
  code: CountryCode;
  name: string;
  /** 현지 통화 기호 (₫/฿/S$) */
  currency: string;
  conclusion: {
    title: string;
    body: string;
    positioning: string;
    priceText: string;
    profitText: string;
  };
  analysis: {
    summary: string;
    metrics: AxisMetric[];
  };
  competition: {
    summary: string;
    stats: CompetitionStat[];
    /** 가격대 분포 띠 (저가형·중간형·프리미엄) */
    priceTiers: PriceTier[];
    /** 마진 메이커 권장가를 같은 축 위에 표시 */
    priceMarker: PriceMarker;
    table: CompetitorTypeRow[];
  };
  shipping: {
    options: ShippingOption[];
    /** 통관 주의사항 — 근거 조항 병기 필수 (R-004-03) */
    warnings: string[];
  };
  /** 상품 포장 정보 초기값 (무게는 product.weight 우선) */
  packaging: { width: number; depth: number; height: number };
  pricing: {
    scenarios: PriceScenario[];
    /** 계산 반영 항목 뱃지 (관세/VAT/배송비/수수료/환율) */
    appliedBadges: string[];
  };
}
