import type { ChangeEvent } from 'react';
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import Dropdown from '@/components/common/Dropdown';
import InputSet from '@/components/common/InputSet';
import TextareaSet from '@/components/common/TextareaSet';
import { useCategoryOptions } from '@/hooks/useProductForm';
import type { ProductFormField, ProductFormState } from '@/hooks/useProductForm';
import ProductImageUploader from './ProductImageUploader';

interface ProductFormProps {
  form: ProductFormState;
}

/** 세 자리 콤마 표기 (입력값 자체는 숫자만 보관) */
const formatNumber = (value: string) =>
  value === '' ? '' : Number(value).toLocaleString();

/**
 * 상품 등록·수정 공용 폼 (Figma 224:4210 · 526:6580).
 * 2열 그리드: 상품명|카테고리 / 공급 원가|무게 / 상품 설명|셀링 포인트 / 상품 이미지|메인 타겟
 */
const ProductForm = ({ form }: ProductFormProps) => {
  const { data: categoryOptions, isLoading: categoriesLoading } = useCategoryOptions();
  const {
    values,
    setValue,
    images,
    addImages,
    removeImage,
    aiFilledFields,
    aiLoading,
  } = form;

  const isAiFilled = (field: ProductFormField) => aiFilledFields.has(field);
  /** AI 처리 중 + 비어 있는 대상 필드 → 스켈레톤 (명세 F-10) */
  const isAiTargetLoading = (field: ProductFormField) =>
    aiLoading && !values[field].trim();

  const handleText =
    (field: ProductFormField) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValue(field, event.target.value);

  const handleNumber =
    (field: ProductFormField) => (event: ChangeEvent<HTMLInputElement>) =>
      setValue(field, event.target.value.replace(/[^\d]/g, ''));

  return (
    <Grid>
      <InputSet
        label="상품명"
        required
        placeholder="상품명을 입력해 주세요."
        value={values.name}
        onChange={handleText('name')}
      />

      {/* Figma 526:6596 — 카테고리 라벨의 * 는 hidden */}
      <Dropdown
        label="카테고리"
        placeholder="선택"
        options={categoryOptions ?? []}
        loading={categoriesLoading || isAiTargetLoading('category')}
        value={values.category}
        onChange={(event) => setValue('category', event.target.value)}
      />

      <InputSet
        label="공급 원가"
        required
        unit="원"
        inputMode="numeric"
        placeholder="공급 원가를 입력해 주세요."
        value={formatNumber(values.costPrice)}
        onChange={handleNumber('costPrice')}
      />

      <InputSet
        label="무게"
        required
        unit="(g)"
        inputMode="numeric"
        placeholder="무게를 입력해 주세요."
        value={formatNumber(values.weight)}
        onChange={handleNumber('weight')}
      />

      <AiSlot $loading={isAiTargetLoading('description')}>
        <TextareaSet
          label="상품 설명"
          placeholder="상품에 대한 설명을 입력해 주세요."
          rows={5}
          value={values.description}
          aiFilled={isAiFilled('description')}
          onChange={handleText('description')}
        />
      </AiSlot>

      <AiSlot $loading={isAiTargetLoading('sellingPoints')}>
        <TextareaSet
          label="셀링 포인트"
          placeholder="상품의 셀링 포인트를 입력해 주세요."
          rows={5}
          value={values.sellingPoints}
          aiFilled={isAiFilled('sellingPoints')}
          onChange={handleText('sellingPoints')}
        />
      </AiSlot>

      <UploaderField>
        <UploaderLabel>상품 이미지</UploaderLabel>
        <ProductImageUploader images={images} onAdd={addImages} onRemove={removeImage} />
      </UploaderField>

      {/* Figma 526:6609 — 메인 타겟은 한 줄 입력 */}
      <AiSlot $loading={isAiTargetLoading('mainTarget')}>
        <InputSet
          label="메인 타겟"
          placeholder="상품의 메인 타겟을 입력해 주세요."
          value={values.mainTarget}
          aiFilled={isAiFilled('mainTarget')}
          onChange={handleText('mainTarget')}
        />
      </AiSlot>
    </Grid>
  );
};

/**
 * 2열 그리드 (Figma 526:6589) — 열 간격 16, 행 간격 16.
 * 첫 행(상품명·카테고리)만 아래 여백이 16 더 붙어 32로 벌어진다 (Frame 94).
 */
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: ${({ theme }) => theme.spacing.md};
  row-gap: ${({ theme }) => theme.spacing.md};
  align-items: start;

  & > *:nth-of-type(-n + 2) {
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }

  ${({ theme }) => theme.media.tablet} {
    grid-template-columns: 1fr;
  }
`;

const shimmer = keyframes`
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
`;

/**
 * AI 자동 채우기 처리 중 대상 필드 스켈레톤 오버레이 (명세 F-10).
 * 라벨(20px + 4px 간격)은 남기고 입력 영역만 덮는다.
 */
const AiSlot = styled.div<{ $loading: boolean }>`
  position: relative;

  ${({ theme, $loading }) =>
    $loading &&
    css`
      &::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 24px;
        bottom: 0;
        border-radius: ${theme.radius.lg};
        background: linear-gradient(
          90deg,
          ${theme.colors.bgLight} 25%,
          ${theme.colors.bgGray} 50%,
          ${theme.colors.bgLight} 75%
        );
        background-size: 200% 100%;
        animation: ${shimmer} 1.2s ease-in-out infinite;
      }
    `}
`;

const UploaderField = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
`;

const UploaderLabel = styled.p`
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export default ProductForm;
