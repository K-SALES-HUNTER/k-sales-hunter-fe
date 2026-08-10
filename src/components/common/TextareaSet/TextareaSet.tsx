import { useId, type TextareaHTMLAttributes } from 'react';
import * as S from './TextareaSet.styled';

interface TextareaSetProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  required?: boolean;
  error?: string;
  /** AI 자동 채우기로 값이 들어간 상태 (Text Input status=AI가채움) — 그라데이션 텍스트로 구분 */
  aiFilled?: boolean;
}

/** InputSet의 여러 줄 입력 변형 — 상품 설명·셀링 포인트·브랜드 톤&무드 등에 사용 */
const TextareaSet = ({ label, required, error, aiFilled, id, ...textareaProps }: TextareaSetProps) => {
  const autoId = useId();
  const textareaId = id ?? autoId;

  return (
    <S.Field>
      {label && (
        <S.Label htmlFor={textareaId}>
          {label}
          {required && <S.Required aria-hidden>*</S.Required>}
        </S.Label>
      )}
      <S.TextareaBox $error={Boolean(error)} $disabled={Boolean(textareaProps.disabled)}>
        <S.Textarea
          id={textareaId}
          aria-invalid={Boolean(error)}
          $aiFilled={Boolean(aiFilled)}
          {...textareaProps}
        />
      </S.TextareaBox>
      {error && <S.ErrorText role="alert">{error}</S.ErrorText>}
    </S.Field>
  );
};

export default TextareaSet;
