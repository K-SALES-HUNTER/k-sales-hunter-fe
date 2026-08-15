import { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import Button from '@/components/common/Button';
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
import { Card, CardDesc, CardTitle, FieldGrid, StepBlock, SubTitle, WarningText } from './ui';

/** 단계 순서 — 앞 단계를 저장해야 다음 단계가 열린다 (단계 종속 폼) */
const STEP_ORDER = ['category', 'attrs', 'option1', 'option2', 'stock'] as const;
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

  const setCell = (key: string, patch: Partial<StockCell>) => {
    invalidateFrom('stock');
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
        <Button
          fullWidth
          loading={saving === 'category'}
          disabled={category === '' || saved.category}
          onClick={() => saveStep('category')}
        >
          {saved.category ? '저장됨' : '저장'}
        </Button>
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

        <Button
          fullWidth
          loading={saving === 'attrs'}
          disabled={!saved.category || saved.attrs}
          onClick={() => saveStep('attrs')}
        >
          {saved.attrs ? '저장됨' : '저장'}
        </Button>
      </StepBlock>

      {/* 3) 1단 속성 — 카테고리 속성 저장 후 활성 */}
      <StepBlock $disabled={!saved.attrs} aria-disabled={!saved.attrs}>
        <SubTitle>1단 속성</SubTitle>
        <FieldGrid>
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
          <OptionValueColumn>
            <OptionValueLabel>옵션값</OptionValueLabel>
            {option1Values.map((value, index) => (
              <InputSet
                key={index}
                aria-label={`1단 옵션값 ${index + 1}`}
                disabled={!saved.attrs}
                value={value}
                placeholder="옵션값"
                onChange={(e) => {
                  setOption1Values((prev) =>
                    prev.map((v, i) => (i === index ? e.target.value : v)),
                  );
                  invalidateFrom('option1');
                }}
              />
            ))}
            <Button
              variant="secondary"
              disabled={!saved.attrs}
              onClick={() => {
                setOption1Values((prev) => [...prev, '']);
                invalidateFrom('option1');
              }}
            >
              항목 추가 +
            </Button>
          </OptionValueColumn>
        </FieldGrid>
        <Button
          fullWidth
          loading={saving === 'option1'}
          disabled={!saved.attrs || saved.option1 || option1Name.trim() === '' || option1Filled.length === 0}
          onClick={() => saveStep('option1')}
        >
          {saved.option1 ? '저장됨' : '저장'}
        </Button>
      </StepBlock>

      {/* 4) 2단 속성 — 옵션 미사용이면 숨김, 1단 저장 후 활성 */}
      {useOptions && (
        <StepBlock $disabled={!saved.option1} aria-disabled={!saved.option1}>
          <SubTitle>2단 속성</SubTitle>
          <FieldGrid>
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
            <OptionValueColumn>
              <OptionValueLabel>옵션값</OptionValueLabel>
              {option2Values.map((value, index) => (
                <InputSet
                  key={index}
                  aria-label={`2단 옵션값 ${index + 1}`}
                  disabled={!saved.option1}
                  value={value}
                  placeholder="옵션값"
                  onChange={(e) => {
                    setOption2Values((prev) =>
                      prev.map((v, i) => (i === index ? e.target.value : v)),
                    );
                    invalidateFrom('option2');
                  }}
                />
              ))}
              <Button
                variant="secondary"
                disabled={!saved.option1}
                onClick={() => {
                  setOption2Values((prev) => [...prev, '']);
                  invalidateFrom('option2');
                }}
              >
                항목 추가 +
              </Button>
            </OptionValueColumn>
          </FieldGrid>
          <Button
            fullWidth
            loading={saving === 'option2'}
            disabled={!saved.option1 || saved.option2 || option2Name.trim() === '' || option2Filled.length === 0}
            onClick={() => saveStep('option2')}
          >
            {saved.option2 ? '저장됨' : '저장'}
          </Button>
        </StepBlock>
      )}

      {/* 5) 재고 매트릭스 — 1단×2단 조합 행 자동 생성 */}
      <StepBlock $disabled={!stockReady} aria-disabled={!stockReady}>
        <SubTitle>재고 수량 · 옵션별 추가 금액</SubTitle>
        <MatrixHeader $useOptions={useOptions}>
          <span>1단 속성</span>
          {useOptions && <span>2단 속성</span>}
          <span>수량</span>
          <span>옵션별 추가 금액</span>
        </MatrixHeader>
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
        {stockReady && allStockZero && (
          <WarningText role="alert">재고가 0이면 판매할 수 없습니다.</WarningText>
        )}
        <Button
          fullWidth
          loading={saving === 'stock'}
          disabled={!stockReady || saved.stock || allStockZero}
          onClick={() => saveStep('stock')}
        >
          {saved.stock ? '저장됨' : '저장'}
        </Button>
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

const OptionValueColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const OptionValueLabel = styled.span`
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const MatrixHeader = styled.div<{ $useOptions: boolean }>`
  display: grid;
  grid-template-columns: repeat(${({ $useOptions }) => ($useOptions ? 4 : 3)}, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};

  span {
    ${({ theme }) => theme.typography.tableHeader};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const MatrixRow = styled.div<{ $useOptions: boolean }>`
  display: grid;
  grid-template-columns: repeat(${({ $useOptions }) => ($useOptions ? 4 : 3)}, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: start;
`;

export default OptionStockSection;
