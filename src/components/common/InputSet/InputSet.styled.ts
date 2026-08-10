import styled from '@emotion/styled';

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
  width: 100%;
`;

export const Label = styled.label`
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Required = styled.span`
  margin-left: 2px;
  color: ${({ theme }) => theme.colors.error};
`;

export const InputBox = styled.div<{ $error: boolean; $disabled: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  height: 38px;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid
    ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.border)};
  background: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.bgGray : theme.colors.surface};
`;

export const Input = styled.input<{ $aiFilled: boolean }>`
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textPrimary};

  /* AI가채움 상태 — 그라데이션 텍스트로 사람이 쓴 값과 구분 (명세) */
  ${({ theme, $aiFilled }) =>
    $aiFilled &&
    `
    background-image: ${theme.colors.gradient};
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  `}

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    -webkit-text-fill-color: ${({ theme }) => theme.colors.textSecondary};
  }

  &:disabled {
    pointer-events: none;
  }
`;

export const Unit = styled.span`
  flex-shrink: 0;
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ErrorText = styled.p`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.error};
`;
