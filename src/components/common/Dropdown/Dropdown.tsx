import { useId, type SelectHTMLAttributes } from 'react';
import * as S from './Dropdown.styled';

export interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  required?: boolean;
  error?: string;
  options: DropdownOption[];
  placeholder?: string;
  /** 목록을 외부 API에서 받아오는 동안 disabled + 스켈레톤 (명세: dropdown 로딩 상태) */
  loading?: boolean;
  /** AI 자동 채우기로 값이 들어간 상태 — InputSet과 동일하게 그라데이션 텍스트로 구분 */
  aiFilled?: boolean;
}

/**
 * dropdown (Figma 224:3642) — 선택 목록. 목록은 기본 브라우저 UI(native select) 사용.
 * 상태: Default(placeholder) / inputvalue / disabled(+로딩 스켈레톤)
 */
const Dropdown = ({
  label,
  required,
  error,
  options,
  placeholder = '선택',
  loading = false,
  aiFilled = false,
  disabled,
  id,
  value,
  ...selectProps
}: DropdownProps) => {
  const autoId = useId();
  const selectId = id ?? autoId;
  const hasValue = value !== undefined && value !== '';
  // 그라데이션 오버레이에 그릴 표시 문자열 (값이 있을 때만)
  const selectedLabel = hasValue
    ? (options.find((option) => option.value === value)?.label ?? String(value))
    : '';
  const showGradient = aiFilled && hasValue && !loading;

  return (
    <S.Field>
      {label && (
        <S.Label htmlFor={selectId}>
          {label}
          {required && <S.Required aria-hidden>*</S.Required>}
        </S.Label>
      )}
      <S.SelectBox $error={Boolean(error)} $disabled={Boolean(disabled) || loading}>
        {loading && <S.Skeleton aria-hidden />}
        <S.Select
          id={selectId}
          value={value}
          disabled={disabled || loading}
          aria-invalid={Boolean(error)}
          $placeholder={!hasValue}
          $aiFilled={showGradient}
          {...selectProps}
        >
          <option value="" disabled hidden>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </S.Select>
        {showGradient && <S.GradientValue aria-hidden>{selectedLabel}</S.GradientValue>}
        <S.Chevron aria-hidden>▾</S.Chevron>
      </S.SelectBox>
      {error && <S.ErrorText role="alert">{error}</S.ErrorText>}
    </S.Field>
  );
};

export default Dropdown;
