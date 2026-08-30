/**
 * CTA 버튼 우측 화살표 (Figma — 헤더 CTA·결론 CTA 공통).
 * currentColor를 쓰므로 버튼 글자색을 그대로 따라간다 (흰 버튼 위 흰 화살표).
 */
const CtaChevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden focusable="false">
    <path
      d="M9.5 6L15.5 12L9.5 18"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CtaChevron;
