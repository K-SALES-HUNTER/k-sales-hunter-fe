import { useQuery } from '@tanstack/react-query';
import {
  fetchDashboardSummary,
  fetchHasLinkedMarket,
  fetchRecentProducts,
} from '@/apis/dashboard';

export const useDashboardSummary = () =>
  useQuery({ queryKey: ['dashboard', 'summary'], queryFn: fetchDashboardSummary });

export const useRecentProducts = () =>
  useQuery({ queryKey: ['dashboard', 'recentProducts'], queryFn: fetchRecentProducts });

export const useHasLinkedMarket = () =>
  useQuery({ queryKey: ['market', 'linked'], queryFn: fetchHasLinkedMarket });
