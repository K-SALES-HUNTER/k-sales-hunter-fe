/** 상품 등록·수정 폼 목 데이터 (PRD-01-01) */

export interface CategoryOption {
  value: string;
  label: string;
}

/** 카테고리 옵션 11종 (명세: Shopee 카테고리 목록 목) */
export const CATEGORY_OPTIONS: CategoryOption[] = [
  '뷰티',
  '패션',
  '액세서리',
  '생활용품',
  '주방용품',
  '문구·취미',
  '캐릭터·굿즈',
  '디지털 액세서리',
  '반려동물용품',
  '식품',
  '기타',
].map((label) => ({ value: label, label }));

/**
 * AI 자동 채우기 목 값 (트렌드 헌터 R-001-02 상품 이해 결과 목).
 * 비어 있는 항목에만 채워지고, 사용자가 입력한 값은 덮어쓰지 않는다.
 */
export const AI_FILL_MOCK = {
  category: '캐릭터·굿즈',
  description:
    '한국 캐릭터 브랜드 말랑 프렌즈의 정품 플러시 인형입니다. 극세사 원단으로 만들어 촉감이 부드럽고, 네 가지 캐릭터를 20cm·30cm 두 사이즈로 고를 수 있습니다.',
  sellingPoints: '한국 정품 캐릭터 굿즈 · 극세사 플러시 원단 · 4가지 캐릭터 · 소장·선물용 패키지',
  mainTarget: 'K-캐릭터 굿즈를 수집하는 동남아 10~20대',
} as const;
