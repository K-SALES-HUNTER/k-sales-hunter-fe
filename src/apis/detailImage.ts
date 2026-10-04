import {
  GENERATE_DURATION_MS,
  generatedImageSrcMock,
  type DetailImageTarget,
  type GenerationModeId,
} from '@/mocks/detailImage';
import { axiosInstance } from './axiosInstance';
import { USE_MOCK_API } from './config';
import { pollUntil } from './poll';

export interface GenerateImageParams {
  productId: number;
  countryCode: string;
  /** 상품 이미지 / 상세 이미지 */
  target: DetailImageTarget;
  /** 자연어 요청 내용 */
  prompt: string;
  mode: GenerationModeId;
  /** 모델 컷일 때 선택한 기본 모델 */
  modelId?: string;
  /** 참고 사진 id (보유 사진 + 업로드 레퍼런스) */
  referenceIds: string[];
}

export interface GeneratedImage {
  id: string;
  src: string;
  /** 결과 화면의 "요청 내용 요약"에 표시 */
  prompt: string;
}

interface ImageJobState {
  status: 'RUNNING' | 'DONE' | 'FAILED' | 'CANCELLED';
  progress: number;
  result: GeneratedImage | null;
  errorCode: string | null;
}

/** 진행 중인 생성 잡 — '취소'가 서버 잡까지 끊을 수 있게 기억해 둔다 */
let activeJobId: string | null = null;

/**
 * 이미지 AI 생성 — POST .../detail-page/images/generate 후 GET /image-jobs/{id} 폴링.
 * 1회 요청에 1장. 실연동은 보통 20~40초 걸린다. 결과 id 는 이미지 잡 id 다.
 */
export const generateImage = async (params: GenerateImageParams): Promise<GeneratedImage> => {
  if (USE_MOCK_API) {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            id: `ai-${params.target}-${Date.now()}`,
            src: generatedImageSrcMock,
            prompt: params.prompt,
          }),
        GENERATE_DURATION_MS,
      ),
    );
  }

  const { productId, countryCode, ...body } = params;
  const { data } = await axiosInstance.post<{ jobId: string }>(
    `/products/${productId}/countries/${countryCode}/detail-page/images/generate`,
    body,
  );
  activeJobId = data.jobId;
  try {
    const job = await pollUntil(
      async () => (await axiosInstance.get<ImageJobState>(`/image-jobs/${data.jobId}`)).data,
      { done: (state) => state.status !== 'RUNNING' },
    );
    if (job.status !== 'DONE' || !job.result) {
      throw new Error(job.errorCode ?? '이미지 생성에 실패했습니다.');
    }
    return job.result;
  } finally {
    if (activeJobId === data.jobId) activeJobId = null;
  }
};

/** 생성 취소 — 서버 잡을 바로 끊는다 (POST /image-jobs/{id}/cancel) */
export const cancelImageGeneration = async (): Promise<void> => {
  if (USE_MOCK_API || !activeJobId) return;
  const jobId = activeJobId;
  activeJobId = null;
  await axiosInstance.post(`/image-jobs/${jobId}/cancel`);
};

/**
 * 생성 결과 확정 — POST .../detail-page/images/generated.
 * replaceImageId 가 있으면 그 이미지 자리를 바꾼다 (재생성 시 원본 id 유지).
 */
export const saveGeneratedImage = async (
  productId: number,
  countryCode: string,
  params: { generatedImageId: string; target: DetailImageTarget; replaceImageId?: string | null },
): Promise<void> => {
  if (USE_MOCK_API) return;
  await axiosInstance.post(
    `/products/${productId}/countries/${countryCode}/detail-page/images/generated`,
    params,
  );
};
