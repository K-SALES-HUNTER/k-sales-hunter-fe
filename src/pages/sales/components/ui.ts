import styled from '@emotion/styled';
import Button from '@/components/common/Button';

/**
 * 폼 저장류 CTA (Figma 12:14476 · 12:14726 · 12:16361) —
 * 헤더 CTA(그라데이션)와 달리 본문 저장/추가 버튼은 단색 네이비 채움이다.
 *
 * $done: 저장을 마친 단계. 공통 disabled 처리(흰 오버레이)만 쓰면
 * '저장됨'과 '아직 못 누르는 저장'이 똑같이 흐린 네이비로 보여 구분되지 않으므로,
 * 완료 상태는 성공 톤(연초록 + 초록 글씨)으로 따로 그린다.
 */
export const SolidButton = styled(Button)<{ $done?: boolean }>`
  background: ${({ theme, $done }) =>
    $done ? theme.colors.successLight : theme.colors.primary};
  ${({ theme, $done }) => $done && `color: ${theme.colors.success};`}

  &:disabled::after {
    background: ${({ $done }) => ($done ? 'transparent' : 'rgba(255, 255, 255, 0.6)')};
  }
`;

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

/**
 * 소제목 + 표·차트 한 덩어리 (Figma 12:14726 — 소제목과 내용 사이 10px).
 * 카드 gap(16)이 적용되지 않는 중첩 블록에서 소제목이 내용에 붙어 보이지 않게 한다.
 */
export const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

/**
 * 카드 안 하위 단계 블록 (제목 + 입력 묶음).
 * 순차 노출 폼: 앞 단계를 저장하기 전의 뒤 단계는 disabled로 흐리게 두지 않고 아예 렌더하지 않는다.
 */
export const StepBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
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

/* Figma 12:14726 스탯 타일 — 값은 16px 볼드 (heading03은 타일 대비 과대) */
export const StatValue = styled.strong<{ $tone?: 'default' | 'positive' }>`
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme, $tone }) =>
    $tone === 'positive' ? theme.colors.success : theme.colors.textPrimary};
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

/**
 * 표 (Figma 12:14726) — 헤더만 연회색 배경이고 본문 행에는 구분선이 없다. 행 높이 40px.
 * $fixed는 열을 같은 폭으로 나누는 표(가격별 예상 영향·가격 변경 기록)에 쓴다.
 */
export const Table = styled.table<{ $fixed?: boolean }>`
  width: 100%;
  border-collapse: collapse;
  table-layout: ${({ $fixed }) => ($fixed ? 'fixed' : 'auto')};

  th {
    padding: ${({ theme }) => `10px ${theme.spacing.sm}`};
    text-align: left;
    white-space: nowrap;
    ${({ theme }) => theme.typography.tableHeader};
    color: ${({ theme }) => theme.colors.textSecondary};
    background: ${({ theme }) => theme.colors.bgLight};
  }

  td {
    padding: ${({ theme }) => `10px ${theme.spacing.sm}`};
    white-space: nowrap;
    ${({ theme }) => theme.typography.tableCell};
    color: ${({ theme }) => theme.colors.textPrimary};
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
