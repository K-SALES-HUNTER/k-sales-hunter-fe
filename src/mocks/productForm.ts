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
  category: '뷰티',
  description:
    'K-뷰티 트렌드를 반영한 데일리 아이템입니다. 순한 성분과 산뜻한 사용감으로 매일 부담 없이 사용할 수 있어요.',
  sellingPoints: '저자극 성분 · 데일리 사용 가능 · 휴대하기 좋은 사이즈 · 합리적인 가격',
  mainTarget: 'K-뷰티에 관심 많은 동남아 20~30대 여성',
} as const;
