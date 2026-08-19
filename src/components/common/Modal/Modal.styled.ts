import styled from '@emotion/styled';

export const Dim = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
`;

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  width: min(427px, calc(100vw - 32px));
  padding: ${({ theme }) => `${theme.spacing.xl} ${theme.spacing.lg}`};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.surface};
  text-align: center;
`;

/* Figma 12:15474 — 제목 위 원형 아이콘 (연한 남색 원 + 흰 느낌표) */
export const IconCircle = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.surface};
`;

export const Title = styled.h2`
  ${({ theme }) => theme.typography.heading03};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Description = styled.p`
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Footer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: center;
  margin-top: ${({ theme }) => theme.spacing.md};
`;
