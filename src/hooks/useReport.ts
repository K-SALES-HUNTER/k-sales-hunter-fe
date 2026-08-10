import { useQuery } from '@tanstack/react-query';
import { fetchCountryReport, fetchTotalReport } from '@/apis/report';
import type { CountryCode } from '@/types/product';

export const useTotalReport = (productId: number) =>
  useQuery({
    queryKey: ['report', productId],
    queryFn: () => fetchTotalReport(productId),
    enabled: Number.isFinite(productId),
  });

export const useCountryReport = (productId: number, countryCode?: string) =>
  useQuery({
    queryKey: ['report', productId, countryCode],
    queryFn: () => fetchCountryReport(productId, countryCode as CountryCode),
    enabled: Number.isFinite(productId) && Boolean(countryCode),
  });
