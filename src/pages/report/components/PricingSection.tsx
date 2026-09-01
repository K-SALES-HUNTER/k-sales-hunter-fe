import { useState } from 'react';
import styled from '@emotion/styled';
import type { CountryReport, PriceScenario } from '@/types/report';

interface PricingSectionProps {
  pricing: CountryReport['pricing'];
}

/**
 * RPT-02-01 가격·마진 섹션 — 가격 3안(Low/추천 Mid/High) 중 추천안 기본 선택.
 * 선택 변경 시 하단 지표 4종·요약·비용 차감 표가 즉시 재계산된다 (#19~22).
 */
const PricingSection = ({ pricing }: PricingSectionProps) => {
  const recommended = pricing.scenarios.find((s) => s.recommended) ?? pricing.scenarios[0];
  const [selectedId, setSelectedId] = useState<PriceScenario['id']>(recommended.id);
  const selected = pricing.scenarios.find((s) => s.id === selectedId) ?? recommended;

  return (
    <>
      <ScenarioGrid role="radiogroup" aria-label="가격안 선택">
        {pricing.scenarios.map((scenario) => {
          const isSelected = scenario.id === selectedId;
          return (
            <ScenarioCard
              key={scenario.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              $selected={isSelected}
              onClick={() => setSelectedId(scenario.id)}
            >
              <ScenarioLabel>{scenario.label}</ScenarioLabel>
              <ScenarioPrice $selected={isSelected}>
                ₩{scenario.price.toLocaleString()}
              </ScenarioPrice>
              <ScenarioProfit>
                순이익 ₩{scenario.netProfit.toLocaleString()} · {scenario.marginRate.toFixed(1)}%
              </ScenarioProfit>
              <ScenarioBadge $recommended={Boolean(scenario.recommended)}>
                {scenario.badge}
              </ScenarioBadge>
            </ScenarioCard>
          );
        })}
      </ScenarioGrid>

      <SummaryBox>{selected.summary}</SummaryBox>

      {/* 지표 4종 — 선택 가격안 기준 즉시 재계산 */}
      <StatGrid>
        <StatTile>
          <StatLabel>판매가</StatLabel>
          <StatValue>₩{selected.price.toLocaleString()}</StatValue>
        </StatTile>
        <StatTile>
          <StatLabel>상품 1개당 남는 금액</StatLabel>
          <StatValue>₩{selected.netProfit.toLocaleString()}</StatValue>
        </StatTile>
        <StatTile>
          <StatLabel>예상 마진율</StatLabel>
          <StatValue>{selected.marginRate.toFixed(1)}%</StatValue>
        </StatTile>
        <StatTile>
          <StatLabel>손익분기 판매량</StatLabel>
          <StatValue>{selected.breakevenUnits.toLocaleString()}개</StatValue>
        </StatTile>
      </StatGrid>

      {/* 반영 뱃지 — 누락 비용 검증용 (R-002-08) */}
      <BadgeRow>
        {pricing.appliedBadges.map((badge) => (
          <AppliedBadge key={badge}>✓ {badge}</AppliedBadge>
        ))}
      </BadgeRow>

      <div>
        <SubTitle>비용 차감 구조 (판매가 → 순이익)</SubTitle>
        <CostTable>
          <tbody>
            {selected.costRows.map((row) => (
              <CostRow key={row.label} $emphasis={Boolean(row.emphasis)}>
                <td>{row.label}</td>
                <AmountCell>{row.amountText}</AmountCell>
              </CostRow>
            ))}
          </tbody>
        </CostTable>
      </div>
    </>
  );
};

const ScenarioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.media.mobile} {
    grid-template-columns: 1fr;
  }
`;

const ScenarioCard = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xxs};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid
    ${({ theme, $selected }) => ($selected ? theme.colors.third : theme.colors.border)};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primaryLight : theme.colors.surface};
  transition:
    border-color 120ms ease-out,
    background 120ms ease-out;
`;

const ScenarioLabel = styled.span`
  ${({ theme }) => theme.typography.captionStrong};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ScenarioPrice = styled.strong<{ $selected: boolean }>`
  ${({ theme }) => theme.typography.heading03};
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary : theme.colors.textStrong};
`;

const ScenarioProfit = styled.span`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ScenarioBadge = styled.span<{ $recommended: boolean }>`
  margin-top: ${({ theme }) => theme.spacing.xxs};
  padding: ${({ theme }) => `2px ${theme.spacing.xs}`};
  border-radius: ${({ theme }) => theme.radius.sm};
  ${({ theme }) => theme.typography.captionStrong};
  ${({ theme, $recommended }) =>
    $recommended
      ? `background: ${theme.colors.primary}; color: ${theme.colors.textOnPrimary};`
      : `background: ${theme.colors.bgLight}; color: ${theme.colors.textPrimary};`}
`;

const SummaryBox = styled.p`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.bgLight};
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};

  ${({ theme }) => theme.media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const StatTile = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgLight};
`;

const StatLabel = styled.span`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StatValue = styled.strong`
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme }) => theme.colors.textStrong};
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const AppliedBadge = styled.span`
  padding: ${({ theme }) => `${theme.spacing.xxs} ${theme.spacing.xs}`};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.successLight};
  ${({ theme }) => theme.typography.captionStrong};
  color: ${({ theme }) => theme.colors.success};
`;

const SubTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

/* Figma 12:13779 — 판매 관리의 총 비용 차감 구조 표와 같은 형태: 구분선 없이 첫·마지막 행만 강조 */
const CostTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;

  td {
    width: 50%;
    padding: ${({ theme }) => `10px ${theme.spacing.sm}`};
    ${({ theme }) => theme.typography.tableCell};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const CostRow = styled.tr<{ $emphasis: boolean }>`
  ${({ theme, $emphasis }) =>
    $emphasis
      ? `background: ${theme.colors.bgLight};
         td { font-weight: 700; color: ${theme.colors.textStrong}; }`
      : ''}
`;

/* 금액 열은 우측 정렬이 아니라 표 중앙(50%)에서 시작하는 좌측 정렬 */
const AmountCell = styled.td``;

export default PricingSection;
