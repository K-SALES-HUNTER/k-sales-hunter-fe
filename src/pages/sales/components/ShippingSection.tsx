import { useState } from 'react';
import styled from '@emotion/styled';
import Button from '@/components/common/Button';
import InputSet from '@/components/common/InputSet';
import { SALES_STEP_DELAY_MS } from '@/apis/sales';
import {
  packagingMock,
  shippingInfoNoteMock,
  shippingNoticeMock,
  type ShippingMethod,
  type ShippingMethodId,
} from '@/mocks/sales';
import { Card, CardDesc, CardTitle, NoticeBox, SubTitle, WarningText } from './ui';

interface ShippingSectionProps {
  methods: ShippingMethod[];
  value: ShippingMethodId;
  /** 변경 시 판매가 섹션 수익 지표 재계산 (배송비 차이 반영) */
  onChange: (id: ShippingMethodId) => void;
  /** 판매 중단 상태 등 판매 중 전용 조작 비활성 */
  disabled?: boolean;
  id?: string;
  /** [DEMO-ONLY] 포장 정보 저장 완료 — 판매 정보 완료 처리 (백엔드 연동 시 제거) */
  onSaved?: () => void;
}

/**
 * 배송 방식 선택 + 상품 포장 정보 (SEL-01-01 #16 · OPS-01-01 #14~15).
 * AI 추천 방식이 기본 선택이며, 변경 시 순이익·수익률·손익분기가 재계산된다.
 */
const ShippingSection = ({
  methods,
  value,
  onChange,
  disabled = false,
  id = 'section-shipping',
  onSaved,
}: ShippingSectionProps) => {
  const [packaging, setPackaging] = useState({
    weight: String(packagingMock.weight),
    width: String(packagingMock.width),
    depth: String(packagingMock.depth),
    height: String(packagingMock.height),
  });
  const [saving, setSaving] = useState(false);

  const setPack = (key: keyof typeof packaging, raw: string) =>
    setPackaging((prev) => ({ ...prev, [key]: raw.replace(/[^0-9.]/g, '') }));

  const savePackaging = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      onSaved?.();
    }, SALES_STEP_DELAY_MS);
  };

  return (
    <Card id={id} aria-labelledby={`${id}-title`}>
      <div>
        <CardTitle id={`${id}-title`}>배송 방식 선택</CardTitle>
        <WarningText>{shippingNoticeMock}</WarningText>
      </div>

      <MethodRow>
        {methods.map((method) => {
          const selected = value === method.id;
          return (
            <MethodCard
              key={method.id}
              type="button"
              $selected={selected}
              aria-pressed={selected}
              disabled={disabled}
              onClick={() => onChange(method.id)}
            >
              <MethodHead>
                <MethodName>{method.name}</MethodName>
                {method.aiRecommended && <AiBadge>AI 추천</AiBadge>}
              </MethodHead>
              <MethodMeta>
                <dt>예상 비용</dt>
                <dd>{method.cost}</dd>
              </MethodMeta>
              <MethodMeta>
                <dt>기간</dt>
                <dd>{method.period}</dd>
              </MethodMeta>
              <MethodNote>{method.note}</MethodNote>
            </MethodCard>
          );
        })}
      </MethodRow>

      <NoticeBox>{shippingInfoNoteMock}</NoticeBox>

      <div>
        <SubTitle>상품 포장 정보</SubTitle>
        {/* 치수가 바뀌면 요금 구간이 달라져 배송비·순이익이 재계산된다 (OPS-01-01 #15) */}
        <CardDesc>
          포장 정보를 정확히 입력하면 배송비와 순이익 계산이 더 정확해집니다. 변경하면 이후
          주문부터 반영됩니다.
        </CardDesc>
        <PackGrid>
          <InputSet
            label="무게"
            unit="g"
            inputMode="numeric"
            disabled={disabled}
            value={packaging.weight}
            onChange={(e) => setPack('weight', e.target.value)}
          />
          <InputSet
            label="가로"
            unit="cm"
            inputMode="numeric"
            disabled={disabled}
            value={packaging.width}
            onChange={(e) => setPack('width', e.target.value)}
          />
          <InputSet
            label="세로"
            unit="cm"
            inputMode="numeric"
            disabled={disabled}
            value={packaging.depth}
            onChange={(e) => setPack('depth', e.target.value)}
          />
          <InputSet
            label="높이"
            unit="cm"
            inputMode="numeric"
            disabled={disabled}
            value={packaging.height}
            onChange={(e) => setPack('height', e.target.value)}
          />
        </PackGrid>
      </div>

      <Button fullWidth loading={saving} disabled={disabled} onClick={savePackaging}>
        저장
      </Button>
    </Card>
  );
};

const MethodRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

const MethodCard = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1.5px solid
    ${({ theme, $selected }) => ($selected ? theme.colors.primary : theme.colors.border)};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primaryLight : theme.colors.surface};
  transition: border-color 120ms ease-out, background 120ms ease-out;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const MethodHead = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const MethodName = styled.strong`
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme }) => theme.colors.textStrong};
`;

const AiBadge = styled.span`
  padding: 1px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-size: 10px;
  font-weight: 600;
  line-height: 15px;
  background: ${({ theme }) => theme.colors.gradient};
  color: ${({ theme }) => theme.colors.textOnPrimary};
`;

const MethodMeta = styled.dl`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  ${({ theme }) => theme.typography.body02};

  dt {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  dd {
    color: ${({ theme }) => theme.colors.textPrimary};
    font-weight: 600;
  }
`;

const MethodNote = styled.span`
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.bgGray};
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const PackGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export default ShippingSection;
