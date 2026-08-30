import { keyframes } from '@emotion/react';
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

export const SelectBox = styled.div<{ $error: boolean; $disabled: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  height: 38px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid
    ${({ theme, $error }) => ($error ? theme.colors.error : theme.colors.border)};
  background: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.bgGray : theme.colors.surface};
  overflow: hidden;
`;

const shimmer = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
`;

export const Skeleton = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent);
  animation: ${shimmer} 1.2s ease-in-out infinite;
  pointer-events: none;
`;

export const Select = styled.select<{ $placeholder: boolean; $aiFilled: boolean }>`
  flex: 1;
  min-width: 0;
  height: 100%;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: none;
  outline: none;
  background: transparent;
  appearance: none;
  cursor: pointer;
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme, $placeholder }) =>
    $placeholder ? theme.colors.textSecondary : theme.colors.textPrimary};

  /* AI가채움 상태 — 선택값 텍스트는 GradientValue가 대신 그린다 (native select는 background-clip:text 미지원) */
  ${({ $aiFilled }) => $aiFilled && `color: transparent;`}

  /* 펼친 목록(option)은 그라데이션 대상이 아니다 — OS 렌더라 상속되면 안 보인다 */
  option {
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

/**
 * AI가채움 상태의 선택값을 그라데이션 텍스트로 덧그리는 레이어.
 * Select와 동일한 패딩·타이포로 겹쳐 두고 클릭은 Select가 받는다.
 */
export const GradientValue = styled.span`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  right: 32px;
  ${({ theme }) => theme.typography.body02};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  pointer-events: none;
  background-image: ${({ theme }) => theme.colors.gradient};
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

export const Chevron = styled.span`
  position: absolute;
  right: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  pointer-events: none;
  font-size: 12px;
`;

export const ErrorText = styled.p`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.error};
`;
