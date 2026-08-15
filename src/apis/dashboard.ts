import {
  dashboardSummaryAfterSalesMock,
  dashboardSummaryMock,
  recentProductsMock,
} from '@/mocks/dashboard';
import { settingsState } from '@/mocks/settings';
import type { DashboardSummary, RecentProduct } from '@/types/dashboard';

const MOCK_DELAY_MS = 300;

const withDelay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), MOCK_DELAY_MS));

/**
 * 대시보드 API — 백엔드 연동 전 목 데이터 반환.
 * 실제 연동 시 axiosInstance.get(...)으로 교체하고 시그니처는 유지.
 *
 * [DEMO-ONLY] hasSales 인자는 판매 개시 여부 — 아직 업로드한 상품이 없으면 집계할 매출이
 * 없으므로 0원 요약을 내려준다. 백엔드 연동 시: 인자를 제거하고 서버 응답을 그대로 반환한다.
 */
export const fetchDashboardSummary = (hasSales: boolean): Promise<DashboardSummary> =>
  withDelay(hasSales ? dashboardSummaryAfterSalesMock : dashboardSummaryMock);

export const fetchRecentProducts = (): Promise<RecentProduct[]> =>
  withDelay(recentProductsMock);

/**
 * 연동된 판매 국가가 하나라도 있으면 연동 완료 — 환영 모달은 그 전까지만 노출된다.
 * [DEMO-ONLY] 목 상태를 직접 읽는다. 백엔드 연동 시: 셀러 연동 여부 API 응답으로 교체.
 */
export const fetchHasLinkedMarket = (): Promise<boolean> =>
  withDelay(settingsState.stores.length > 0);
