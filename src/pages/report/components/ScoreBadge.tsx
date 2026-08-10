import styled from '@emotion/styled';
import type { ScoreGrade } from '@/types/product';

interface ScoreBadgeProps {
  grade: ScoreGrade;
  /**
   * 경쟁 강도처럼 "높을수록 불리"한 지표 — 색 의미 반대 적용 (RPT-01-01 #6)
   * 기본: 높음=유리(퍼플) / invert: 높음=불리(경고), 낮음=유리(퍼플)
   */
  invert?: boolean;
}

/** 국가점수 (Figma 234:4390) — 높음/보통/낮음 3단계 등급 뱃지 */
const ScoreBadge = ({ grade, invert = false }: ScoreBadgeProps) => {
  return (
    <Badge $grade={grade} $invert={invert}>
      {grade}
    </Badge>
  );
};

const Badge = styled.span<{ $grade: ScoreGrade; $invert: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xxs} ${theme.spacing.xs}`};
  border-radius: ${({ theme }) => theme.radius.sm};
  white-space: nowrap;
  ${({ theme }) => theme.typography.captionStrong};
  ${({ theme, $grade, $invert }) => {
    const favorable = `background: ${theme.colors.thirdLight}; color: ${theme.colors.third};`;
    const neutral = `background: ${theme.colors.successLight}; color: ${theme.colors.success};`;
    const muted = `background: ${theme.colors.bgLight}; color: ${theme.colors.textPrimary};`;
    const unfavorable = `background: ${theme.colors.errorLight}; color: ${theme.colors.error};`;

    if ($grade === '보통') return neutral;
    if ($grade === '높음') return $invert ? unfavorable : favorable;
    return $invert ? favorable : muted;
  }}
`;

export default ScoreBadge;
