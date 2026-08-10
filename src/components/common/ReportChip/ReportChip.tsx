import type { ButtonHTMLAttributes } from 'react';
import * as S from './ReportChip.styled';

interface ReportChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** total: 전체 분석 보고서(네이비) / country: 국가 보고서(라이트) */
  variant: 'total' | 'country';
  label: string;
}

/**
 * 보고서 이동 (Figma 102:2627) — 테이블 셀 안에서 보고서로 이동하는 링크 칩.
 * 클릭 시 해당하는 전체/국가별 보고서 페이지로 이동한다.
 */
const ReportChip = ({ variant, label, ...props }: ReportChipProps) => {
  return (
    <S.Chip type="button" $variant={variant} {...props}>
      {label} →
    </S.Chip>
  );
};

export default ReportChip;
