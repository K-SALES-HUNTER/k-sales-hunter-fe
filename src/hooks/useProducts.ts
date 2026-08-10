import { useQuery } from '@tanstack/react-query';
import { fetchProduct, fetchProducts } from '@/apis/products';

export const useProducts = () =>
  useQuery({ queryKey: ['products'], queryFn: fetchProducts });

export const useProduct = (productId: number) =>
  useQuery({
    queryKey: ['products', productId],
    queryFn: () => fetchProduct(productId),
    enabled: Number.isFinite(productId),
  });
