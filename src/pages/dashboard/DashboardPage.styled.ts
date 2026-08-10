import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: ${({ theme }) => `0 ${theme.spacing.md}`};
`;

/**
 * icon/plus — Figma 에셋이 가로/세로 획 2개의 벡터로 분리되어 있어
 * 두 이미지를 겹쳐 십자를 구성한다.
 */
export const PlusIcon = styled.span`
  position: relative;
  display: inline-block;
  width: 22px;
  height: 22px;
  flex-shrink: 0;

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  img:first-of-type {
    width: 13px;
  }

  img:last-of-type {
    height: 13px;
  }
`;

/* ─── 로딩 스켈레톤 (명세 DSH-01-01 #4·#7·#8 — 응답 전 카드 자리 유지) ─── */

const shimmer = keyframes`
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
`;

export const Skeleton = styled.div<{ $height: number }>`
  height: ${({ $height }) => `${$height}px`};
  border-radius: ${({ theme }) => theme.radius.md};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.bgLight} 25%,
    ${({ theme }) => theme.colors.bgGray} 50%,
    ${({ theme }) => theme.colors.bgLight} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;

export const SkeletonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

/* ─── 빈 상태 (Title section · Figma 167:332) ─── */

export const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  background: ${({ theme }) => theme.colors.bgLight};
`;

export const TitleSectionTitle = styled.p`
  ${({ theme }) => theme.typography.heading03};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const TitleSectionDescription = styled.p`
  ${({ theme }) => theme.typography.body01};
  color: ${({ theme }) => theme.colors.textSecondary};
`;
