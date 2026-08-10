import detailImgResult from '@/assets/images/detailimg-result.png';
import salesPdpMain from '@/assets/images/sales-pdp-main.png';
import salesPdpSub from '@/assets/images/sales-pdp-sub.png';

/**
 * 이미지 AI 생성 대상 (Figma 573:6715 / 677:10398 — 제목만 다른 같은 화면)
 * - product: 상품 이미지(썸네일 컷)
 * - detail: 상세 이미지(PDP 본문 컷)
 */
export type DetailImageTarget = 'product' | 'detail';

/** 제목 문구 (Figma 573:6738 · 677:10405) */
export const generateTitleMock: Record<DetailImageTarget, string> = {
  product: '상품 이미지를 생성해 드립니다.',
  detail: '상세 이미지를 생성해 드립니다.',
};

/** 생성 중 · 완료 제목 문구 (Figma 677:10461 · 677:10517) */
export const generatingTitleMock = '이미지 생성 중..';
export const doneTitleMock = '이미지가 생성되었어요.';

/** 생성 중 안내 문구 (Figma 574:6777 · 574:6778) */
export const generatingHeadlineMock = '이미지를 만들고 있어요';
export const generatingNoticeMock =
  '1회 생성 시 이미지 1장이 만들어집니다. 보통 20~40초 정도 걸리며, 이 화면을 벗어나도 생성은 계속됩니다.';

/** 완료 안내 문구 (Figma 604:10254) */
export const doneNoticeMock = '마음에 들면 저장하고, 다른 결과를 원하면 다시 생성을 눌러 주세요.';

/** 생성 결과 카드 문구 (Figma 604:10257 · 604:10258) */
export const resultSectionTitleMock = '생성 결과';
export const resultSectionNoticeMock = '1회 생성 시 이미지 1장이 만들어집니다.';

/** ①. 참고 사진 문구 (Figma 573:6742 · 573:6743 · 573:6746 · 573:6755) */
export const referenceSectionMock = {
  title: '레퍼런스 이미지 등록',
  notice: '업로드된 사진을 바탕으로 AI가 이미지를 생성해 드려요.',
  ownedLabel: 'AI가 보유한 상품 사진',
  uploadLabel: '추가 레퍼런스 사진',
  dropzoneText: '상품 이미지를 드래그하거나 클릭하세요 (최대 12장)',
} as const;

/** ②. 요청 내용 문구 (Figma 573:6765 · 573:6766 · Text Input placeholder) */
export const promptSectionMock = {
  title: '요청 내용',
  notice: '어떤 상세 이미지를 원하는지 문장으로 적어 주세요.',
  placeholder:
    '예) 제품의 주요 기능 3가지를 아이콘과 함께 정리한 인포그래픽 형태로 만들어 주세요. 배경은 밝은 회색, 문구는 영어로 부탁합니다.',
} as const;

/** 이미지 재생성 확인 모달 문구 (Figma 604:10270) */
export const regenerateConfirmMock = {
  title: '현재 이미지를 지우고 새로 만들까요?',
  description: '이전 이미지는 복구할 수 없습니다.',
  confirmLabel: '다시 생성',
  cancelLabel: '취소',
} as const;

export interface ReferencePhoto {
  id: string;
  label: string;
  src: string;
}

/** AI가 보유한 상품 사진 — 상품 등록 시 올린 사진을 참고 사진 후보로 제시 */
export const referencePhotosMock: ReferencePhoto[] = [
  { id: 'ref-1', label: '보유 사진 1', src: salesPdpMain },
  { id: 'ref-2', label: '보유 사진 2', src: salesPdpSub },
];

export type GenerationModeId = 'basic' | 'model';

export interface GenerationMode {
  id: GenerationModeId;
  label: string;
  desc: string;
}

/** 생성 방식 — 기본 컷 / 모델 컷 (모델 컷은 기본 모델 4종 중 선택) */
export const generationModesMock: GenerationMode[] = [
  { id: 'basic', label: '기본 컷', desc: '상품만 단독으로 보여주는 깔끔한 컷' },
  { id: 'model', label: '모델 컷', desc: '기본 모델이 상품을 사용하는 연출 컷' },
];

export interface BaseModel {
  id: string;
  name: string;
  desc: string;
}

/** 모델 컷용 기본 모델 4종 */
export const baseModelsMock: BaseModel[] = [
  { id: 'model-1', name: '기본 모델 1', desc: '20대 여성 · 동아시아' },
  { id: 'model-2', name: '기본 모델 2', desc: '30대 남성 · 동아시아' },
  { id: 'model-3', name: '기본 모델 3', desc: '20대 여성 · 동남아시아' },
  { id: 'model-4', name: '기본 모델 4', desc: '30대 남성 · 동남아시아' },
];

/** 생성 결과 목 이미지 */
export const generatedImageSrcMock = detailImgResult;

/** 목 생성 소요 시간 (1.5~2초) */
export const GENERATE_DURATION_MS = 1800;

/** 안내 문구에 노출할 예상 소요 시간 (Figma "약 25초 남음") */
export const GENERATE_ETA_SECONDS = 25;

/** 추가 레퍼런스 업로드 최대 장수 */
export const MAX_REFERENCE_UPLOADS = 12;
