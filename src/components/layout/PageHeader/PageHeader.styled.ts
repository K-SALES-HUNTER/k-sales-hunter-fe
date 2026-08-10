import styled from '@emotion/styled';

export const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.md}`};
  background: ${({ theme }) => theme.colors.surface};
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const Title = styled.h1`
  ${({ theme }) => theme.typography.heading03};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Description = styled.p`
  padding: ${({ theme }) => `${theme.spacing.xxs} 0`};
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const Action = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-shrink: 0;
`;
