import type { Country, CountryCode } from './dashboard';

/**
 * 국가별 진행 단계 (CountryCard 배리언트 = 진행 단계)
 * - report: 보고서만 생성됨 (판매 전)
 * - sales-info: 판매 정보 입력 시작 (상세페이지 없음, 판매 전)
 * - detail: 상세 페이지 생성됨 (업로드 전=판매 전 / 업로드 후=판매 중)
 */
export type CountryStage = 'report' | 'sales-info' | 'detail';

export type SalesStatus = '판매전' | '판매중' | '판매중단';

/** 국가난이도 BIG 등급 (R-001-05 가중합) */
export type CountryFitGrade = '매우 적합' | '일부 적합' | '보통' | '유의';

/** 국가점수 3단계 등급 */
export type ScoreGrade = '높음' | '보통' | '낮음';

export interface CountryProgress extends Country {
  stage: CountryStage;
  salesStatus: SalesStatus;
  /** 상세페이지 존재 여부 (사이드바 트리 조건 렌더용) */
  hasDetailPage: boolean;
  /** 판매 정보 존재 여부 */
  hasSalesInfo: boolean;
}

export interface Product {
  id: number;
  name: string;
  image: string;
  images: string[];
  category: string;
  /** 공급 원가(원) */
  costPrice: number;
  /** 무게(g, 포장 포함) */
  weight: number;
  description: string;
  sellingPoints: string;
  mainTarget: string;
  revenue: number | null;
  registeredAt: string;
  /** 분석 완료된 국가 목록 (전제: 노출 국가 = 판매 가능 국가) */
  countries: CountryProgress[];
}

export type { Country, CountryCode };
