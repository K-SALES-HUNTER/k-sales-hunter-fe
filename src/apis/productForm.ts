import { AI_FILL_MOCK, CATEGORY_OPTIONS, type CategoryOption } from '@/mocks/productForm';
import { axiosInstance } from './axiosInstance';
import { USE_MOCK_API } from './config';

const CATEGORY_DELAY_MS = 300;
/** AI 자동 채우기 처리 중 대상 필드 스켈레톤 노출 시간 (1.2초) */
const AI_FILL_DELAY_MS = 1200;
/** Vision 분석이 포함돼 기본 타임아웃(10초)보다 길게 잡는다 (API 스펙: product-fill ≤15s) */
const AI_FILL_TIMEOUT_MS = 20_000;

const withDelay = <T>(data: T, ms: number): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));

/** 카테고리 목록 — GET /products/categories */
export const fetchCategoryOptions = async (): Promise<CategoryOption[]> => {
  if (USE_MOCK_API) return withDelay(CATEGORY_OPTIONS, CATEGORY_DELAY_MS);
  const { data } = await axiosInstance.get<CategoryOption[]>('/products/categories');
  return data;
};

export interface AiFillResult {
  category: string;
  description: string;
  sellingPoints: string;
  mainTarget: string;
}

/** 자동 채우기 입력 — 현재 폼값과 업로드한 이미지 URL. 비어 있는 칸만 AI 가 채운다 */
export interface AiFillParams {
  name: string;
  category: string;
  description: string;
  sellingPoints: string;
  mainTarget: string;
  imageUrls: string[];
}

/** AI 자동 채우기 (트렌드 헌터 R-001-02) — POST /products/ai-fill */
export const requestAiFill = async (params?: AiFillParams): Promise<AiFillResult> => {
  if (USE_MOCK_API || !params) return withDelay(AI_FILL_MOCK, AI_FILL_DELAY_MS);
  const { data } = await axiosInstance.post<AiFillResult>('/products/ai-fill', params, {
    timeout: AI_FILL_TIMEOUT_MS,
  });
  return data;
};

export interface UploadedImage {
  id: string;
  url: string;
}

/**
 * 이미지 업로드 — POST /uploads/images (multipart).
 * onProgress 로 0~1 진행률을 준다 (상품 등록 카드의 프로그레스 바).
 */
export const uploadImage = async (
  file: File,
  onProgress?: (ratio: number) => void,
): Promise<UploadedImage> => {
  const body = new FormData();
  body.append('file', file);
  const { data } = await axiosInstance.post<UploadedImage>('/uploads/images', body, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60_000,
    onUploadProgress: (event) => {
      if (event.total) onProgress?.(event.loaded / event.total);
    },
  });
  return data;
};

export interface RegisterProductParams {
  name: string;
  category: string;
  costPrice: number;
  weight: number;
  description: string;
  sellingPoints: string;
  mainTarget: string;
  imageUrls: string[];
  /** AI 가 채운 뒤 사용자가 손대지 않은 필드 */
  aiFilledFields: string[];
}

export interface RegisterProductResult {
  productId: number;
  analysisJobId: string;
}

/** 상품 등록 + 분석 잡 시작 — POST /products */
export const registerProduct = async (
  params: RegisterProductParams,
): Promise<RegisterProductResult> => {
  const { data } = await axiosInstance.post<RegisterProductResult>('/products', params);
  return data;
};
