import { useQuery } from '@tanstack/react-query';
import { fetchDetailContent, fetchSalesInfo, fetchSalesOps } from '@/apis/sales';

export const useSalesInfo = (productId: number, countryCode: string) =>
  useQuery({
    queryKey: ['sales', 'info', productId, countryCode],
    queryFn: () => fetchSalesInfo(productId, countryCode),
    enabled: Number.isFinite(productId) && Boolean(countryCode),
  });

export const useDetailContent = (productId: number, countryCode: string) =>
  useQuery({
    queryKey: ['sales', 'detail', productId, countryCode],
    queryFn: () => fetchDetailContent(productId, countryCode),
    enabled: Number.isFinite(productId) && Boolean(countryCode),
  });

export const useSalesOps = (productId: number, countryCode: string) =>
  useQuery({
    queryKey: ['sales', 'ops', productId, countryCode],
    queryFn: () => fetchSalesOps(productId, countryCode),
    enabled: Number.isFinite(productId) && Boolean(countryCode),
  });
