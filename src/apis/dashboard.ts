import {
  dashboardSummaryMock,
  hasLinkedMarketMock,
  recentProductsMock,
} from '@/mocks/dashboard';
import type { DashboardSummary, RecentProduct } from '@/types/dashboard';

const MOCK_DELAY_MS = 300;

const withDelay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), MOCK_DELAY_MS));

/**
 * 대시보드 API — 백엔드 연동 전 목 데이터 반환.
 * 실제 연동 시 axiosInstance.get(...)으로 교체하고 시그니처는 유지.
 */
export const fetchDashboardSummary = (): Promise<DashboardSummary> =>
  withDelay(dashboardSummaryMock);

export const fetchRecentProducts = (): Promise<RecentProduct[]> =>
  withDelay(recentProductsMock);

export const fetchHasLinkedMarket = (): Promise<boolean> => withDelay(hasLinkedMarketMock);
