import styled from '@emotion/styled';

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

export const MetricList = styled.div`
  width: 220px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const MetricRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgLight};
`;

export const MetricLabel = styled.span`
  ${({ theme }) => theme.typography.tableCell};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const MetricValue = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
`;

/** 등급 텍스트 (Figma 12:15740 — 배지 없이 볼드 텍스트) */
export const MetricGrade = styled.strong`
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const MetricScore = styled.span`
  ${({ theme }) => theme.typography.captionStrong};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

/** AI 종합 결론 그라데이션 CTA (Figma 12:15740 — gradation 배경 + 우측 chevron) */
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

/* ── 판매 현황 ───────────────────────────── */

/** 판매 국가 수 뱃지 (Figma 576:7155) — bg/light + stroke/black, radius 12 */
export const SalesCountBadge = styled.span`
  padding: ${({ theme }) => `5px ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.bgLight};
  ${({ theme }) => theme.typography.captionStrong};
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
`;

export const SalesAsOf = styled.p`
  margin-top: -${({ theme }) => theme.spacing.xs};
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const SalesStatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};

  ${({ theme }) => theme.media.mobile} {
    grid-template-columns: 1fr;
  }
`;

export const SalesStatTile = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.bgLight};
`;

export const SalesStatLabel = styled.span`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const SalesStatValue = styled.strong`
  ${({ theme }) => theme.typography.heading03};
  color: ${({ theme }) => theme.colors.textStrong};
`;

export const SalesStatDelta = styled.span<{ $up: boolean }>`
  ${({ theme }) => theme.typography.captionStrong};
  color: ${({ theme, $up }) => ($up ? theme.colors.success : theme.colors.error)};
`;

export const SubTitle = styled.h4`
  margin-bottom: 10px;
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

/* ── 판매 중인 국가별 매출 행 (Figma 577:15381) ───────────────────────────── */

export const CountryRevenueList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const CountryRevenueRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  ${({ theme }) => theme.media.mobile} {
    flex-wrap: wrap;
  }
`;

/** 국가점수 (Figma 234:4390) 순위 뱃지 — secondary/light + secondary/strong */
export const RankBadge = styled.span`
  flex-shrink: 0;
  padding: ${({ theme }) => `${theme.spacing.xxs} ${theme.spacing.xs}`};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.successLight};
  ${({ theme }) => theme.typography.captionStrong};
  color: ${({ theme }) => theme.colors.success};
  white-space: nowrap;
`;

export const CountryRevenueMain = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: 10px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  ${({ theme }) => theme.typography.tableCell};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

/** Figma 12:15740 — 금액은 국가명과 같은 레귤러 웨이트 */
export const RevenueValue = styled.span`
  ${({ theme }) => theme.typography.tableCell};
  color: ${({ theme }) => theme.colors.textPrimary};
`;


/** 국가별 판매 관리 이동 버튼 (Figma 577:15376) — main/light 배경 + 우측 화살표 */
export const RowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-shrink: 0;
  width: 200px;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primaryLight};
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: filter 120ms ease-out;

  &:hover {
    filter: brightness(0.96);
  }

  ${({ theme }) => theme.media.mobile} {
    width: 100%;
  }
`;

export const RowButtonIcon = styled.img`
  width: 8px;
  flex-shrink: 0;
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

export const SkeletonCard = styled.div`
  height: 193px;
  border-radius: ${({ theme }) => theme.radius.xl};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.bgLight};
`;

export const ErrorBox = styled.p`
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.errorLight};
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.error};
`;

/* ── 국가별 분석 결과 ───────────────────────────── */

export const SectionTitle = styled.h2`
  /* Figma 576:6776 — 제목과 카드 그리드는 한 묶음이라 16px만 띄운다 (콘텐츠 기본 간격 24 - 8) */
  margin-bottom: -${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `0 ${theme.spacing.xs}`};
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const CountryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.media.tablet} {
    grid-template-columns: 1fr;
  }
`;

/* ── 후보국 조사 과정 ───────────────────────────── */

export const Paragraph = styled.p`
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ChipGroups = styled.div`
  display: flex;
  flex-wrap: wrap;
  /* Figma 576:6776 — 조사 국가 · 분석 기준 · 기준 플랫폼 세 묶음은 넉넉히 벌어져 있다 */
  gap: ${({ theme }) => theme.spacing.xxxl};
`;

export const ChipGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const ChipGroupLabel = styled.span`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textMuted};
`;

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xxs};
`;

export const Chip = styled.span`
  padding: ${({ theme }) => `${theme.spacing.xxs} ${theme.spacing.xs}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textPrimary};
  background: ${({ theme }) => theme.colors.surface};
`;
