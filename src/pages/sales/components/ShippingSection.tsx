import { useState } from 'react';
import styled from '@emotion/styled';
import InputSet from '@/components/common/InputSet';
import { SALES_STEP_DELAY_MS } from '@/apis/sales';
import {
  packagingMock,
  shippingInfoNoteMock,
  shippingNoticeMock,
  type ShippingMethod,
  type ShippingMethodId,
} from '@/mocks/sales';
import { Card, CardDesc, CardTitle, NoticeBox, SolidButton, SubTitle, WarningText } from './ui';

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

  /**
   * 상품 포장 정보 4칸은 모두 화면에 자동으로 채워진 값이다 —
   * 치수는 AI가 상품 정보로 추정하고, 무게는 등록 정보에서 그대로 끌어온다.
   * QA 규칙(직접 입력이 아닌 자동 표기 값은 전부 그라데이션)에 따라 네 칸 모두 대상이며,
   * 셀러가 한 글자라도 고치면 그 칸만 일반 텍스트로 승격된다.
   */
  const isAiPack = (key: keyof typeof packaging) => packaging[key] === String(packagingMock[key]);

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
              <MethodName $selected={selected}>{method.name}</MethodName>
              <MethodMeta $selected={selected}>
                <dt>예상 비용</dt>
                <dd>{method.cost}</dd>
              </MethodMeta>
              <MethodMeta $selected={selected}>
                <dt>기간</dt>
                <dd>{method.period}</dd>
              </MethodMeta>
              {/* Figma 12:14476 · 12:14726 — 선택된 방식의 태그는 남색 채움 */}
              <MethodNote $selected={selected}>{method.note}</MethodNote>
            </MethodCard>
          );
        })}
      </MethodRow>

      <NoticeBox>{shippingInfoNoteMock}</NoticeBox>

      <div>
        <SubTitle>상품 포장 정보</SubTitle>
        {/* 치수가 바뀌면 요금 구간이 달라져 배송비·순이익이 재계산된다 (OPS-01-01 #15) */}
        <CardDesc>상품 포장 정보 입력 시 더욱 정확한 비용 계산이 가능합니다.</CardDesc>
        <PackGrid>
          <InputSet
            label="무게"
            unit="(g)"
            inputMode="numeric"
            aiFilled={isAiPack('weight')}
            disabled={disabled}
            value={packaging.weight}
            onChange={(e) => setPack('weight', e.target.value)}
          />
          <InputSet
            label="가로"
            unit="cm"
            inputMode="numeric"
            aiFilled={isAiPack('width')}
            disabled={disabled}
            value={packaging.width}
            onChange={(e) => setPack('width', e.target.value)}
          />
          <InputSet
            label="세로"
            unit="cm"
            inputMode="numeric"
            aiFilled={isAiPack('depth')}
            disabled={disabled}
            value={packaging.depth}
            onChange={(e) => setPack('depth', e.target.value)}
          />
          <InputSet
            label="높이"
            unit="cm"
            inputMode="numeric"
            aiFilled={isAiPack('height')}
            disabled={disabled}
            value={packaging.height}
            onChange={(e) => setPack('height', e.target.value)}
          />
        </PackGrid>
      </div>

      <SolidButton fullWidth loading={saving} disabled={disabled} onClick={savePackaging}>
        저장
      </SolidButton>
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

/* Figma 12:14476 · 12:14726 — 선택하지 않은 방식은 제목·값까지 회색으로 물러난다 */
const MethodName = styled.strong<{ $selected: boolean }>`
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.textStrong : theme.colors.textSecondary};
`;

const MethodMeta = styled.dl<{ $selected: boolean }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  ${({ theme }) => theme.typography.body02};

  dt {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  dd {
    color: ${({ theme, $selected }) =>
      $selected ? theme.colors.textPrimary : theme.colors.textSecondary};
    font-weight: 600;
  }
`;

/* Figma 12:14476 · 12:14726 — 선택: 남색 채움 + 흰 글자 / 미선택: 테두리 칩 */
const MethodNote = styled.span<{ $selected: boolean }>`
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  ${({ theme }) => theme.typography.caption01};
  ${({ theme, $selected }) =>
    $selected
      ? `background: ${theme.colors.primary}; color: ${theme.colors.textOnPrimary};`
      : `background: ${theme.colors.surface};
         border: 1px solid ${theme.colors.border};
         color: ${theme.colors.textSecondary};`}
`;

const PackGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export default ShippingSection;
