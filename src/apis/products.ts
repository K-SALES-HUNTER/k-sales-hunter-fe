import { productsMock } from '@/mocks/products';
import type { Product } from '@/types/product';

const MOCK_DELAY_MS = 300;

const withDelay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), MOCK_DELAY_MS));

/** 상품 API — 백엔드 연동 전 목 데이터. 연동 시 내부만 axios로 교체 */
export const fetchProducts = (): Promise<Product[]> => withDelay(productsMock);

export const fetchProduct = (productId: number): Promise<Product> => {
  const product = productsMock.find((p) => p.id === productId);
  if (!product) return Promise.reject(new Error('상품을 찾을 수 없습니다.'));
  return withDelay(product);
};
