/**
 * Figma arrow 컴포넌트(102:2671)의 chevron 벡터.
 * 색을 currentColor로 두어야 흰 버튼 안·검은 헤더 양쪽에서 재사용할 수 있으므로
 * svg 에셋 대신 인라인으로 둔다.
 */
const ChevronIcon = ({ size = 22 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M9.5 6L15.5 12L9.5 18"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ChevronIcon;
