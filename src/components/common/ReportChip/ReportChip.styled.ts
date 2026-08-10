import styled from '@emotion/styled';

export const Chip = styled.button<{ $variant: 'total' | 'country' }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radius.xl};
  ${({ theme }) => theme.typography.label02};
  white-space: nowrap;
  background: ${({ theme, $variant }) =>
    $variant === 'total' ? theme.colors.primary : theme.colors.primaryLight};
  color: ${({ theme, $variant }) =>
    $variant === 'total' ? theme.colors.textOnPrimary : theme.colors.textPrimary};
  transition: filter 120ms ease-out;

  &:hover {
    filter: brightness(0.94);
  }
`;
