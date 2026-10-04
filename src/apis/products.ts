import { productsMock } from '@/mocks/products';
import type { Product } from '@/types/product';
import { axiosInstance } from './axiosInstance';
import { USE_MOCK_API } from './config';

const MOCK_DELAY_MS = 300;

const withDelay = <T>(data: T): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), MOCK_DELAY_MS));

/** 상품 API — GET /products · GET /products/{id} */
export const fetchProducts = async (): Promise<Product[]> => {
  if (USE_MOCK_API) return withDelay(productsMock);
  const { data } = await axiosInstance.get<Product[]>('/products');
  return data;
};

export const fetchProduct = async (productId: number): Promise<Product> => {
  if (!USE_MOCK_API) {
    const { data } = await axiosInstance.get<Product>(`/products/${productId}`);
    return data;
  }
  const product = productsMock.find((p) => p.id === productId);
  if (!product) return Promise.reject(new Error('상품을 찾을 수 없습니다.'));
  return withDelay(product);
};
