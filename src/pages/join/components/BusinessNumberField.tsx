import { useRef } from 'react';
import styled from '@emotion/styled';
import { BUSINESS_NUMBER_LENGTHS, type BusinessNumberParts } from '@/utils/businessNumber';

interface BusinessNumberFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  value: BusinessNumberParts;
  onChange: (next: BusinessNumberParts) => void;
}

/**
 * 사업자등록번호 (JOI-01-01 #6 · MKT-01-01 #6) —
 * 3-2-5 자리 3분할 입력. 자릿수를 채우면 자동으로 다음 칸 포커스.
 */
const BusinessNumberField = ({
  label = '사업자등록번호',
  required,
  error,
  value,
  onChange,
}: BusinessNumberFieldProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, BUSINESS_NUMBER_LENGTHS[index]);
    const next = [...value] as BusinessNumberParts;
    next[index] = digits;
    onChange(next);

    // 자릿수를 다 채우면 다음 칸으로 자동 이동
    if (digits.length === BUSINESS_NUMBER_LENGTHS[index] && index < 2) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  return (
    <Field>
      {label && (
        <Label>
          {label}
          {required && <Required aria-hidden>*</Required>}
        </Label>
      )}
      <Row>
        {BUSINESS_NUMBER_LENGTHS.map((length, index) => (
          <Segment key={index}>
            {index > 0 && <Hyphen aria-hidden>-</Hyphen>}
            <InputBox $error={Boolean(error)}>
              <Input
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                inputMode="numeric"
                maxLength={length}
                placeholder={'0'.repeat(length)}
                aria-label={`${label} ${index + 1}번째`}
                aria-invalid={Boolean(error)}
                value={value[index]}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            </InputBox>
          </Segment>
        ))}
      </Row>
      {error && <ErrorText role="alert">{error}</ErrorText>}
    </Field>
  );
};

export default BusinessNumberField;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
`;

const Label = styled.span`
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Required = styled.span`
  margin-left: 2px;
  color: ${({ theme }) => theme.colors.error};
`;

/* Figma 526:4723 — 입력칸·하이픈 사이 간격 4px */
const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
`;

const Segment = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
`;

const Hyphen = styled.span`
  ${({ theme }) => theme.typography.body01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const InputBox = styled.div<{ $error: boolean }>`
  display: flex;
  align-items: center;
  height: 38px;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid
    ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.border)};
  background: ${({ theme }) => theme.colors.surface};
`;

const Input = styled.input`
  width: 5ch;
  border: none;
  outline: none;
  background: transparent;
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textPrimary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const ErrorText = styled.p`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.error};
`;
