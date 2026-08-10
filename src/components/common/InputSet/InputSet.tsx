import { useId, type InputHTMLAttributes } from 'react';
import * as S from './InputSet.styled';

interface InputSetProps extends InputHTMLAttributes<HTMLInputElement> {
  /** 라벨. 없으면 라벨 줄을 렌더하지 않음 (한 라벨에 입력칸 여러 개일 때 2번째부터) */
  label?: string;
  /** 필수 입력이면 라벨 우측에 * 표시 */
  required?: boolean;
  /** 유효성 검증 실패 문구. 있으면 테두리 경고색 + 하단 문구 */
  error?: string;
  /** 우측 고정 단위 (g · 원 · % 등). 입력값에 포함되지 않음 */
  unit?: string;
  /** AI 자동 채우기로 값이 들어간 상태 (Text Input status=AI가채움) — 그라데이션 텍스트로 구분 */
  aiFilled?: boolean;
}

/**
 * InputSet (Figma 168:164) — 라벨 + 입력 + 에러 슬롯 폼 필드 최소 단위.
 * 명세: Text Input은 단독 배치하지 않고 항상 이 컴포넌트로 감싼다.
 */
const InputSet = ({ label, required, error, unit, aiFilled, id, ...inputProps }: InputSetProps) => {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <S.Field>
      {label && (
        <S.Label htmlFor={inputId}>
          {label}
          {required && <S.Required aria-hidden>*</S.Required>}
        </S.Label>
      )}
      <S.InputBox $error={Boolean(error)} $disabled={Boolean(inputProps.disabled)}>
        <S.Input
          id={inputId}
          aria-invalid={Boolean(error)}
          $aiFilled={Boolean(aiFilled)}
          {...inputProps}
        />
        {unit && <S.Unit>{unit}</S.Unit>}
      </S.InputBox>
      {error && <S.ErrorText role="alert">{error}</S.ErrorText>}
    </S.Field>
  );
};

export default InputSet;
