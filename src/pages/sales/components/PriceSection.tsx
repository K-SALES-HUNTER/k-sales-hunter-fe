import { useState } from 'react';
import styled from '@emotion/styled';
import salesCheckIcon from '@/assets/icons/sales-check.svg';
import InputSet from '@/components/common/InputSet';
import {
  appliedCostBadgesMock,
  marginBasisMock,
  type PriceScenario,
} from '@/mocks/sales';
import { Card, CardTitle, NoticeBox, StatBox, StatGrid, StatLabel, StatValue } from './ui';

interface PriceSectionProps {
  /** 공급 원가 — 최종가가 이보다 낮으면 경고 (저장은 허용) */
  costPrice: number;
  /** 선택된 배송 방식의 개당 배송비(원) — 변경 시 수익 지표 즉시 재계산 */
  shippingCostKrw: number;
  scenarios: PriceScenario[];
}

/**
 * 개당 순이익 — 국가별 보고서의 비용 차감 구조와 같은 순서로 계산한다.
 * 관세·수입 VAT는 CIF(공급 원가 + 국제 배송비) 기준, Shopee 수수료만 판매가 기준이다.
 * 수수료는 화면 표기와 어긋나지 않도록 십원 단위로 반올림한다.
 */
const calcUnitProfit = (price: number, costPrice: number, shippingKrw: number) => {
  const cif = costPrice + shippingKrw;
  const duty = cif * marginBasisMock.dutyRate;
  const importVat = (cif + duty) * marginBasisMock.importVatRate;
  const shopeeFee = Math.round((price * marginBasisMock.shopeeFeeRate) / 10) * 10;
  return Math.round(price - costPrice - shippingKrw - duty - importVat - shopeeFee);
};

const formatPrice = (value: number) => `₩${value.toLocaleString()}`;

/**
 * 판매가 섹션 (SEL-01-01 #6~9) — 가격 3안 → 최종 판매가 → 수익 지표.
 * 가격안 선택·최종가 수정·배송 방식 변경 시 하단 지표를 즉시 재계산한다.
 */
const PriceSection = ({ costPrice, shippingCostKrw, scenarios }: PriceSectionProps) => {
  const recommended = scenarios.find((s) => s.recommended) ?? scenarios[0];
  const [selectedId, setSelectedId] = useState(recommended?.id);
  const [finalPriceRaw, setFinalPriceRaw] = useState(String(recommended?.price ?? ''));

  const finalPrice = Number(finalPriceRaw.replace(/[^0-9]/g, '')) || 0;
  const belowCost = finalPrice > 0 && finalPrice <= costPrice;

  const unitProfit = finalPrice > 0 ? calcUnitProfit(finalPrice, costPrice, shippingCostKrw) : null;
  const marginRate = unitProfit !== null && finalPrice > 0 ? (unitProfit / finalPrice) * 100 : null;
  const bepQty =
    unitProfit !== null && unitProfit > 0
      ? Math.ceil(marginBasisMock.fixedCostKrw / unitProfit)
      : null;

  // 가격안에서 그대로 들어온 값이면 'AI가채움'(그라데이션), 직접 타이핑하면 사용자 입력으로 승격
  const priceFromScenario = scenarios.some((s) => s.price === finalPrice);

  const selectScenario = (scenario: PriceScenario) => {
    setSelectedId(scenario.id);
    // 선택한 가격안이 최종 판매가의 디폴트 입력값이 된다 (추가 수정 가능)
    setFinalPriceRaw(String(scenario.price));
  };

  return (
    <Card id="section-price" aria-labelledby="price-title">
      <CardTitle id="price-title">판매가</CardTitle>

      <ScenarioRow>
        {scenarios.map((scenario) => {
          const profit = calcUnitProfit(scenario.price, costPrice, shippingCostKrw);
          const rate = ((profit / scenario.price) * 100).toFixed(1);
          const selected = selectedId === scenario.id;
          return (
            <ScenarioCard
              key={scenario.id}
              type="button"
              $selected={selected}
              aria-pressed={selected}
              onClick={() => selectScenario(scenario)}
            >
              <ScenarioLabel>{scenario.label}</ScenarioLabel>
              <ScenarioPrice>{formatPrice(scenario.price)}</ScenarioPrice>
              <ScenarioProfit>
                순이익 {formatPrice(profit)} · {rate}%
              </ScenarioProfit>
              <ScenarioBadge $selected={selected}>{scenario.badge}</ScenarioBadge>
            </ScenarioCard>
          );
        })}
      </ScenarioRow>

      <InputSet
        label="최종 가격"
        required
        unit="원"
        inputMode="numeric"
        aiFilled={priceFromScenario}
        value={finalPrice > 0 ? finalPrice.toLocaleString() : ''}
        onChange={(e) => setFinalPriceRaw(e.target.value.replace(/[^0-9]/g, ''))}
        error={belowCost ? '공급 원가보다 낮은 가격입니다. 손실이 발생합니다' : undefined}
        placeholder="판매가를 입력해 주세요"
      />

      {/* Figma 12:14476 안내 문구 */}
      {unitProfit !== null && (
        <NoticeBox>
          {formatPrice(finalPrice)}에 판매할 경우, 관세·현지 부가세·국제 배송비·Shopee 수수료를
          모두 제외하고 상품 1개당 약 {formatPrice(unitProfit)}의 순이익이 예상됩니다.
        </NoticeBox>
      )}

      <StatGrid $columns={3}>
        <StatBox>
          <StatLabel>상품 1개당 남는 금액</StatLabel>
          <StatValue>{unitProfit !== null ? formatPrice(unitProfit) : '—'}</StatValue>
        </StatBox>
        <StatBox>
          <StatLabel>예상 수익률</StatLabel>
          <StatValue>{marginRate !== null ? `${marginRate.toFixed(1)}%` : '—'}</StatValue>
        </StatBox>
        <StatBox>
          <StatLabel>손익분기 판매량</StatLabel>
          <StatValue>{bepQty !== null ? `${bepQty.toLocaleString()}개` : '—'}</StatValue>
        </StatBox>
      </StatGrid>

      {/* 반영 비용 뱃지 — 어떤 비용이 계산에 포함됐는지 검증 (R-002-08) */}
      <BadgeRow>
        {appliedCostBadgesMock.map((badge) => (
          <CostBadge key={badge}>
            <img src={salesCheckIcon} alt="" aria-hidden />
            {badge}
          </CostBadge>
        ))}
      </BadgeRow>
    </Card>
  );
};

const ScenarioRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ScenarioCard = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xxs};
  padding: ${({ theme }) => theme.spacing.sm};
  text-align: left;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1.5px solid
    ${({ theme, $selected }) => ($selected ? theme.colors.primary : theme.colors.border)};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primaryLight : theme.colors.surface};
  transition: border-color 120ms ease-out, background 120ms ease-out;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ScenarioLabel = styled.span`
  ${({ theme }) => theme.typography.captionStrong};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ScenarioPrice = styled.strong`
  ${({ theme }) => theme.typography.heading03};
  color: ${({ theme }) => theme.colors.textStrong};
`;

const ScenarioProfit = styled.span`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

/* Figma 12:14476 — 선택: 남색 채움 / 미선택: 테두리 칩 */
const ScenarioBadge = styled.span<{ $selected: boolean }>`
  padding: 1px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 10px;
  font-weight: 600;
  line-height: 15px;
  ${({ theme, $selected }) =>
    $selected
      ? `background: ${theme.colors.primary}; color: ${theme.colors.textOnPrimary};`
      : `background: ${theme.colors.surface};
         border: 1px solid ${theme.colors.border};
         color: ${theme.colors.textSecondary};`}
`;

const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xxs};
`;

/* Figma 12:14476 — 반영 비용 뱃지는 연초록 배경 + 초록 텍스트 */
const CostBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.successLight};
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.success};

  img {
    width: 10px;
    height: 10px;
  }
`;

export default PriceSection;
