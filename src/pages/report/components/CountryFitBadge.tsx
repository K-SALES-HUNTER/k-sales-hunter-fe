import styled from '@emotion/styled';
import type { CountryFitGrade } from '@/types/product';

interface CountryFitBadgeProps {
  grade: CountryFitGrade;
  /** 표시 문구 — 없으면 등급명. 국가 카드에서는 'N위 · 매우 적합' 형태로 사용 */
  label?: string;
}

/** 국가난이도 BIG (Figma 234:4624) — 국가 진입 적합도 등급 뱃지 */
const CountryFitBadge = ({ grade, label }: CountryFitBadgeProps) => {
  return <Badge $grade={grade}>{label ?? grade}</Badge>;
};

const Badge = styled.span<{ $grade: CountryFitGrade }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.xxs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radius.xl};
  white-space: nowrap;
  ${({ theme }) => theme.typography.label02};
  ${({ theme, $grade }) => {
    switch ($grade) {
      case '매우 적합':
        return `background: ${theme.colors.thirdLight}; color: ${theme.colors.third};`;
      case '일부 적합':
        return `background: ${theme.colors.primaryLight}; color: ${theme.colors.primary};`;
      case '보통':
        return `background: ${theme.colors.successLight}; color: ${theme.colors.success};`;
      default:
        return `background: ${theme.colors.bgLight}; color: ${theme.colors.textPrimary};`;
    }
  }}
`;

export default CountryFitBadge;
