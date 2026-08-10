import styled from '@emotion/styled';

/** 판매 준비·운영 페이지 공용 카드 (Figma Card) */
export const Card = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
`;

export const CardTitle = styled.h2`
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const CardDesc = styled.p`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const SubTitle = styled.h3`
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

/** 카드 안 하위 단계 블록 (제목 + 입력 묶음) */
export const StepBlock = styled.div<{ $disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  opacity: ${({ $disabled }) => ($disabled ? 0.45 : 1)};
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};
  transition: opacity 120ms ease-out;
`;

export const FieldGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns ?? 2}, minmax(0, 1fr));
  gap: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.sm}`};
`;

/** 수익 지표 등 스탯 박스 */
export const StatBox = styled.div<{ $tone?: 'default' | 'positive' }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $tone }) =>
    $tone === 'positive' ? theme.colors.successLight : theme.colors.bgLight};
`;

export const StatLabel = styled.span`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const StatValue = styled.strong<{ $tone?: 'default' | 'positive' }>`
  ${({ theme }) => theme.typography.heading03};
  color: ${({ theme, $tone }) =>
    $tone === 'positive' ? theme.colors.success : theme.colors.textStrong};
`;

export const StatGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $columns }) => $columns ?? 3}, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

/* ─────────────────────────── 테이블 ─────────────────────────── */

export const TableScroll = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    text-align: left;
    white-space: nowrap;
    ${({ theme }) => theme.typography.tableHeader};
    color: ${({ theme }) => theme.colors.textSecondary};
    background: ${({ theme }) => theme.colors.bgLight};
  }

  td {
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    white-space: nowrap;
    ${({ theme }) => theme.typography.tableCell};
    color: ${({ theme }) => theme.colors.textPrimary};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

export const EmptyText = styled.p`
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

/** 경고(원가 이하·배송 대행 안내 등) 문구 */
export const WarningText = styled.p`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.error};
`;

/** 안내 문구 박스 (연한 배경) */
export const NoticeBox = styled.p`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgLight};
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;
