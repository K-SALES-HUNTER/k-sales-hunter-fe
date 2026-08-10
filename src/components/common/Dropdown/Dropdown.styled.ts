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

export const Select = styled.select<{ $placeholder: boolean }>`
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

  &:disabled {
    cursor: not-allowed;
  }
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
