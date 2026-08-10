import {
  GENERATE_DURATION_MS,
  generatedImageSrcMock,
  type DetailImageTarget,
  type GenerationModeId,
} from '@/mocks/detailImage';

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

/**
 * 이미지 AI 생성 — 백엔드 연동 전 목.
 * 1회 요청에 1장을 생성하며, 결과는 항상 같은 목 이미지를 반환한다.
 */
export const generateImage = (params: GenerateImageParams): Promise<GeneratedImage> =>
  new Promise((resolve) =>
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
