import styled from '@emotion/styled';
import type { SalesStatus } from '@/types/product';

interface SalesStatusBadgeProps {
  status: SalesStatus;
}

/**
 * sales_StatusBadge (Figma 215:564) — 상품의 국가별 판매 상태 뱃지.
 * 판매중=퍼플 / 판매중단=경고 / 판매전=그레이
 */
const SalesStatusBadge = ({ status }: SalesStatusBadgeProps) => {
  return <Badge $status={status}>{status === '판매전' ? '판매 전' : status}</Badge>;
};

const Badge = styled.span<{ $status: SalesStatus }>`
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 10px;
  font-weight: 600;
  line-height: 15px;
  white-space: nowrap;
  ${({ theme, $status }) => {
    switch ($status) {
      case '판매중':
        return `background: ${theme.colors.thirdLight}; color: ${theme.colors.third};`;
      case '판매중단':
        return `background: ${theme.colors.errorLight}; color: ${theme.colors.error};`;
      default:
        return `background: ${theme.colors.bgGray}; color: ${theme.colors.textSecondary};`;
    }
  }}
`;

export default SalesStatusBadge;
