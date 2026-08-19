import { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import Dropdown from '@/components/common/Dropdown';
import InputSet from '@/components/common/InputSet';
import { SALES_STEP_DELAY_MS } from '@/apis/sales';
import {
  categoryAttrsMock,
  optionLevel1Mock,
  optionLevel2Mock,
  shopeeCategoryDefaultMock,
  shopeeCategoryOptionsMock,
} from '@/mocks/sales';
import { Card, CardDesc, CardTitle, FieldGrid, SolidButton, StepBlock, SubTitle, WarningText } from './ui';

/** 단계 순서 — 앞 단계를 저장해야 다음 단계가 열린다 (단계 종속 폼) */
const STEP_ORDER = ['category', 'attrs', 'option1', 'option2', 'stock', 'extra'] as const;
type StepId = (typeof STEP_ORDER)[number];

interface StockCell {
  qty: string;
  extra: string;
}

/**
 * 옵션·재고 섹션 (SEL-01-01 #10~15) — 카테고리 → 카테고리 속성 → 1단 → 2단 → 재고 매트릭스.
 * 각 단계 저장 시 0.5초 로딩으로 다음 옵션을 Shopee에서 받아오는 흉내를 낸다.
 * 앞 단계를 수정하면 뒤 단계 저장 상태가 초기화된다 (단계 종속적).
 */
interface OptionStockSectionProps {
  /** [DEMO-ONLY] 재고까지 저장을 마쳤을 때 — 판매 정보 완료 처리 (백엔드 연동 시 제거) */
  onSaved?: () => void;
}

const OptionStockSection = ({ onSaved }: OptionStockSectionProps) => {
  const [category, setCategory] = useState(shopeeCategoryDefaultMock);
  const [attrs, setAttrs] = useState<Record<string, string>>(() =>
    Object.fromEntries(categoryAttrsMock.map((a) => [a.key, a.value])),
  );
  const [useOptions, setUseOptions] = useState(true);
  const [option1Name, setOption1Name] = useState(optionLevel1Mock.name);
  const [option1Values, setOption1Values] = useState<string[]>(optionLevel1Mock.values);
  const [option2Name, setOption2Name] = useState(optionLevel2Mock.name);
  const [option2Values, setOption2Values] = useState<string[]>(optionLevel2Mock.values);
  const [stockCells, setStockCells] = useState<Record<string, StockCell>>({});

  const [saved, setSaved] = useState<Record<StepId, boolean>>({
    category: false,
    attrs: false,
    option1: false,
    option2: false,
    stock: false,
    extra: false,
  });
  const [saving, setSaving] = useState<StepId | null>(null);

  /** 해당 단계와 그 뒤 단계의 저장 상태를 무효화 (앞 단계 수정 시) */
  const invalidateFrom = (step: StepId) => {
    const start = STEP_ORDER.indexOf(step);
    setSaved((prev) => {
      const next = { ...prev };
      STEP_ORDER.slice(start).forEach((s) => {
        next[s] = false;
      });
      return next;
    });
  };

  const saveStep = (step: StepId) => {
    setSaving(step);
    // 목 0.5초 로딩 — 저장한 데이터에 맞는 다음 옵션·속성을 Shopee에서 받아오는 흉내
    setTimeout(() => {
      setSaving(null);
      setSaved((prev) => ({ ...prev, [step]: true }));
      if (step === 'stock') onSaved?.();
    }, SALES_STEP_DELAY_MS);
  };

  // 옵션 미사용이면 2단은 숨김 → 재고 단계 선행 조건은 1단 저장
  const stockReady = saved.option1 && (!useOptions || saved.option2);

  const option1Filled = option1Values.filter((v) => v.trim() !== '');
  const option2Filled = option2Values.filter((v) => v.trim() !== '');

  /** 1단×2단 조합 행 자동 생성 (옵션 미사용이면 1단만) */
  const stockRows = useMemo(() => {
    const level2 = useOptions && option2Filled.length > 0 ? option2Filled : ['—'];
    return option1Filled.flatMap((v1) => level2.map((v2) => ({ key: `${v1}|${v2}`, v1, v2 })));
  }, [option1Filled, option2Filled, useOptions]);

  const getCell = (key: string): StockCell => stockCells[key] ?? { qty: '', extra: '' };

  /** 재고(qty)는 stock 단계, 추가 금액(extra)은 extra 단계 저장 상태를 무효화 */
  const setCell = (key: string, patch: Partial<StockCell>) => {
    invalidateFrom('qty' in patch ? 'stock' : 'extra');
    setStockCells((prev) => ({ ...prev, [key]: { ...getCell(key), ...patch } }));
  };

  const allStockZero =
    stockRows.length > 0 && stockRows.every((row) => (Number(getCell(row.key).qty) || 0) === 0);

  return (
    <Card id="section-options" aria-labelledby="options-title">
      <div>
        <CardTitle id="options-title">옵션·재고</CardTitle>
        <CardDesc>
          카테고리에 따라 상품 옵션 정보를 자동으로 쇼피에서 가져옵니다. 사전에 입력한 정보에 따라
          AI가 자동으로 값을 채우며, 직접 수정할 수 있습니다.
        </CardDesc>
      </div>

      {/* 1) 카테고리 */}
      <StepBlock>
        <Dropdown
          label="카테고리"
          required
          options={shopeeCategoryOptionsMock}
          value={category}
          loading={saving === 'category'}
          onChange={(e) => {
            setCategory(e.target.value);
            invalidateFrom('category');
          }}
        />
        <SolidButton
          fullWidth
          loading={saving === 'category'}
          disabled={category === '' || saved.category}
          onClick={() => saveStep('category')}
        >
          {saved.category ? '저장됨' : '저장'}
        </SolidButton>
      </StepBlock>

      {/* 2) 카테고리 속성 — 카테고리 저장 후 활성 */}
      <StepBlock $disabled={!saved.category} aria-disabled={!saved.category}>
        <SubTitle>카테고리 속성</SubTitle>
        <FieldGrid>
          {categoryAttrsMock.map((attr) => (
            <InputSet
              key={attr.key}
              label={attr.label}
              required={attr.required}
              aiFilled
              disabled={!saved.category}
              value={attrs[attr.key] ?? ''}
              onChange={(e) => {
                setAttrs((prev) => ({ ...prev, [attr.key]: e.target.value }));
                invalidateFrom('attrs');
              }}
            />
          ))}
        </FieldGrid>

        <RadioField>
          <RadioLegend>옵션 사용 여부 (추가 색상, 사이즈 등)</RadioLegend>
          <RadioRow>
            <RadioLabel>
              <input
                type="radio"
                name="use-options"
                checked={useOptions}
                disabled={!saved.category}
                onChange={() => {
                  setUseOptions(true);
                  invalidateFrom('attrs');
                }}
              />
              사용
            </RadioLabel>
            <RadioLabel>
              <input
                type="radio"
                name="use-options"
                checked={!useOptions}
                disabled={!saved.category}
                onChange={() => {
                  setUseOptions(false);
                  invalidateFrom('attrs');
                }}
              />
              미사용
            </RadioLabel>
          </RadioRow>
        </RadioField>

        <SolidButton
          fullWidth
          loading={saving === 'attrs'}
          disabled={!saved.category || saved.attrs}
          onClick={() => saveStep('attrs')}
        >
          {saved.attrs ? '저장됨' : '저장'}
        </SolidButton>
      </StepBlock>

      {/* 3) 1단 속성 — 카테고리 속성 저장 후 활성 */}
      <StepBlock $disabled={!saved.attrs} aria-disabled={!saved.attrs}>
        <SubTitle>1단 속성</SubTitle>
        {/* Figma 12:14476 — 옵션명 입력과 옵션값들이 2열 그리드로 흐르고 마지막 셀이 '항목 추가 +' */}
        <OptionGrid>
          <InputSet
            label="옵션명"
            required
            aiFilled
            disabled={!saved.attrs}
            value={option1Name}
            onChange={(e) => {
              setOption1Name(e.target.value);
              invalidateFrom('option1');
            }}
          />
          {option1Values.map((value, index) => (
            <InputSet
              key={index}
              aria-label={`1단 옵션값 ${index + 1}`}
              disabled={!saved.attrs}
              value={value}
              placeholder="1단 속성"
              onChange={(e) => {
                setOption1Values((prev) =>
                  prev.map((v, i) => (i === index ? e.target.value : v)),
                );
                invalidateFrom('option1');
              }}
            />
          ))}
          <AddItemButton
            type="button"
            disabled={!saved.attrs}
            onClick={() => {
              setOption1Values((prev) => [...prev, '']);
              invalidateFrom('option1');
            }}
          >
            항목 추가
            <span aria-hidden>+</span>
          </AddItemButton>
        </OptionGrid>
        <SolidButton
          fullWidth
          loading={saving === 'option1'}
          disabled={!saved.attrs || saved.option1 || option1Name.trim() === '' || option1Filled.length === 0}
          onClick={() => saveStep('option1')}
        >
          {saved.option1 ? '저장됨' : '저장'}
        </SolidButton>
      </StepBlock>

      {/* 4) 2단 속성 — 옵션 미사용이면 숨김, 1단 저장 후 활성 */}
      {useOptions && (
        <StepBlock $disabled={!saved.option1} aria-disabled={!saved.option1}>
          <SubTitle>2단 속성</SubTitle>
          <OptionGrid>
            <InputSet
              label="옵션명"
              required
              aiFilled
              disabled={!saved.option1}
              value={option2Name}
              onChange={(e) => {
                setOption2Name(e.target.value);
                invalidateFrom('option2');
              }}
            />
            {option2Values.map((value, index) => (
              <InputSet
                key={index}
                aria-label={`2단 옵션값 ${index + 1}`}
                disabled={!saved.option1}
                value={value}
                placeholder="2단 속성"
                onChange={(e) => {
                  setOption2Values((prev) =>
                    prev.map((v, i) => (i === index ? e.target.value : v)),
                  );
                  invalidateFrom('option2');
                }}
              />
            ))}
            <AddItemButton
              type="button"
              disabled={!saved.option1}
              onClick={() => {
                setOption2Values((prev) => [...prev, '']);
                invalidateFrom('option2');
              }}
            >
              항목 추가
              <span aria-hidden>+</span>
            </AddItemButton>
          </OptionGrid>
          <SolidButton
            fullWidth
            loading={saving === 'option2'}
            disabled={!saved.option1 || saved.option2 || option2Name.trim() === '' || option2Filled.length === 0}
            onClick={() => saveStep('option2')}
          >
            {saved.option2 ? '저장됨' : '저장'}
          </SolidButton>
        </StepBlock>
      )}

      {/* 5) 재고 수량 — 1단×2단 조합 행 자동 생성 (Figma 12:14476: 추가 금액과 분리된 블록) */}
      <StepBlock $disabled={!stockReady} aria-disabled={!stockReady}>
        <SubTitle>재고 수량</SubTitle>
        <FieldLabel>
          판매 재고
          <RequiredMark aria-hidden>*</RequiredMark>
        </FieldLabel>
        {stockRows.map((row) => (
          <MatrixRow key={row.key} $useOptions={useOptions}>
            <InputSet aria-label="1단 속성" value={row.v1} readOnly disabled />
            {useOptions && <InputSet aria-label="2단 속성" value={row.v2} readOnly disabled />}
            <InputSet
              aria-label={`${row.v1} ${row.v2} 수량`}
              unit="개"
              inputMode="numeric"
              disabled={!stockReady}
              value={getCell(row.key).qty}
              placeholder="0"
              onChange={(e) => setCell(row.key, { qty: e.target.value.replace(/[^0-9]/g, '') })}
            />
          </MatrixRow>
        ))}
        {stockReady && allStockZero && (
          <WarningText role="alert">재고가 0이면 판매할 수 없습니다.</WarningText>
        )}
        <SolidButton
          fullWidth
          loading={saving === 'stock'}
          disabled={!stockReady || saved.stock || allStockZero}
          onClick={() => saveStep('stock')}
        >
          {saved.stock ? '저장됨' : '저장'}
        </SolidButton>
      </StepBlock>

      {/* 6) 옵션별 추가 금액 (Figma 12:14476 — 별도 블록 + 저장 버튼) */}
      <StepBlock $disabled={!stockReady} aria-disabled={!stockReady}>
        <SubTitle>옵션별 추가 금액</SubTitle>
        <FieldLabel>추가 금액</FieldLabel>
        {stockRows.map((row) => (
          <MatrixRow key={row.key} $useOptions={useOptions}>
            <InputSet aria-label="1단 속성" value={row.v1} readOnly disabled />
            {useOptions && <InputSet aria-label="2단 속성" value={row.v2} readOnly disabled />}
            <InputSet
              aria-label={`${row.v1} ${row.v2} 추가 금액`}
              unit="원"
              inputMode="numeric"
              disabled={!stockReady}
              value={getCell(row.key).extra}
              placeholder="0"
              onChange={(e) => setCell(row.key, { extra: e.target.value.replace(/[^0-9]/g, '') })}
            />
          </MatrixRow>
        ))}
        <SolidButton
          fullWidth
          loading={saving === 'extra'}
          disabled={!stockReady || saved.extra}
          onClick={() => saveStep('extra')}
        >
          {saved.extra ? '저장됨' : '저장'}
        </SolidButton>
      </StepBlock>
    </Card>
  );
};

const RadioField = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  border: 0;
`;

const RadioLegend = styled.legend`
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const RadioRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const RadioLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textPrimary};
  cursor: pointer;

  input {
    accent-color: ${({ theme }) => theme.colors.primary};
  }
`;

/* Figma 12:14476 — 옵션명·옵션값·항목 추가 버튼이 2열로 흐르는 그리드 */
const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.sm}`};
  align-items: end;
`;

/* Figma 12:14476 — '항목 추가  +' (연한 배경, 텍스트 좌측 · + 우측) */
const AddItemButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 38px;
  padding: ${({ theme }) => `0 ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primaryLight};
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textPrimary};

  &:disabled {
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: default;
  }
`;

/** 매트릭스 상단 필드 라벨 (Figma '판매 재고 *' · '추가 금액') */
const FieldLabel = styled.span`
  display: inline-flex;
  gap: 2px;
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const RequiredMark = styled.span`
  color: ${({ theme }) => theme.colors.error};
`;

const MatrixRow = styled.div<{ $useOptions: boolean }>`
  display: grid;
  grid-template-columns: repeat(${({ $useOptions }) => ($useOptions ? 3 : 2)}, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: start;
`;

export default OptionStockSection;
