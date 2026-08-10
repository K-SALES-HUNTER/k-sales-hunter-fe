/** 사업자등록번호 3-2-5 자리 분할 (명세: 하이픈은 UI 표기용, 저장값 제외) */
export const BUSINESS_NUMBER_LENGTHS = [3, 2, 5] as const;

export type BusinessNumberParts = [string, string, string];

export const isBusinessNumberComplete = (parts: BusinessNumberParts): boolean =>
  parts.every((part, i) => part.length === BUSINESS_NUMBER_LENGTHS[i]);

/** 저장값은 하이픈 제외 10자리 */
export const joinBusinessNumber = (parts: BusinessNumberParts): string => parts.join('');

export const splitBusinessNumber = (value: string): BusinessNumberParts => [
  value.slice(0, 3),
  value.slice(3, 5),
  value.slice(5, 10),
];
