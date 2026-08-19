import styled from '@emotion/styled';

export const PageTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `0 ${theme.spacing.xs}`};
`;

/** 페이지 섹션 타이틀 (Figma 292:4227) — Title/02 18px */
export const PageTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

/**
 * 섹션 탭 — 클릭 시 해당 섹션으로 스크롤 (라우팅 없음, RPT-02-01 #5).
 * 탭 아래로 스크롤하면 ProductShell 고정 스택 바로 아래에 고정된다.
 * `--shell-sticky-h`는 ProductShell이 스택 높이를 실측해 넣어주는 값.
 */
export const SectionTabs = styled.div`
  position: sticky;
  top: var(--shell-sticky-h, 197px);
  z-index: 9;
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.xs}`};
  margin: ${({ theme }) => `-${theme.spacing.xs} 0`};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 0.8px solid ${({ theme }) => theme.colors.border};
`;

/** tab unit (Figma 311:3133) — click: 볼드 + 하단 2px 라인 / unclick: 레귤러 + 회색 */
export const SectionTab = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => `10px ${theme.spacing.none}`};
  white-space: nowrap;
  ${({ theme, $active }) => ($active ? theme.typography.label02 : theme.typography.tableCell)};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.textPrimary : theme.colors.textSecondary};
  border-bottom: 2px solid
    ${({ theme, $active }) => ($active ? theme.colors.textPrimary : 'transparent')};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

/* ── 로딩·오류 상태 ───────────────────────────── */

export const PageLoading = styled.p`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const SkeletonLine = styled.div<{ $width?: string; $height?: number }>`
  width: ${({ $width }) => $width ?? '100%'};
  height: ${({ $height }) => `${$height ?? 20}px`};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.bgLight};
`;

export const ErrorBox = styled.p`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.errorLight};
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.error};
`;

/* ── AI 종합 결론 ───────────────────────────── */

export const ConclusionBody = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xl};
  flex-wrap: wrap;
`;

export const ConclusionMain = styled.div`
  flex: 1;
  min-width: 280px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const ConclusionTitle = styled.h3`
  ${({ theme }) => theme.typography.heading03};
  color: ${({ theme }) => theme.colors.primary};
`;

export const ConclusionParagraph = styled.p`
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

/** AI 종합 결론 그라데이션 CTA (Figma 12:13779 — gradation 배경 + 우측 chevron) */
export const ConclusionCta = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  align-self: stretch;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.gradient};
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textOnPrimary};
  cursor: pointer;
  transition: filter 120ms ease-out;

  &:hover {
    filter: brightness(1.08);
  }
`;

export const InfoList = styled.div`
  width: 240px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgLight};
`;

export const InfoLabel = styled.span`
  ${({ theme }) => theme.typography.tableCell};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const InfoValue = styled.span`
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

/* ── 항목별 분석 ───────────────────────────── */

export const SummaryBox = styled.p`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.bgLight};
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const MetricList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `0 ${theme.spacing.xs}`};
`;
