import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
`;

/** AILoadingState (Figma 599:9830) — 세로 gap 28px, 최대 704px */
export const Panel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: min(704px, 100%);
`;

/** 어느 화면에서 호출한 로딩인지 표시 */
export const ScreenName = styled.p`
  ${({ theme }) => theme.typography.captionStrong};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Title = styled.h2`
  ${({ theme }) => theme.typography.heading03};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Remaining = styled.p`
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 4px;
  border-radius: 2px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bgGray};
`;

export const ProgressFill = styled.div<{ $ratio: number }>`
  height: 100%;
  border-radius: 2px;
  background: ${({ theme }) => theme.colors.primary};
  width: ${({ $ratio }) => `${Math.round($ratio * 100)}%`};
  transition: width 400ms ease-out;
`;

export const StepList = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
`;

/** 단계 행 — padding 13/0 + 하단 구분선 (Figma 599:9782) */
export const StepRow = styled.li`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 13px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const Indicator = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  flex-shrink: 0;
`;

export const DoneIcon = styled.img`
  width: 18px;
  height: 18px;
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const LoadingIcon = styled.img`
  width: 24px;
  height: 24px;
  animation: ${spin} 1s linear infinite;
`;

export const PendingDot = styled.span`
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

export const StepText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

export const StepTask = styled.p<{ $pending: boolean }>`
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme, $pending }) =>
    $pending ? theme.colors.textSecondary : theme.colors.textPrimary};
`;

export const StepAgent = styled.p<{ $pending: boolean }>`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textSecondary};
  opacity: ${({ $pending }) => ($pending ? 0.8 : 1)};
`;

/** 진행 중 단계의 보조 문구 (예: 3개 국가를 동시에 살펴보고 있습니다) */
export const StepNote = styled.p`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.primary};
`;

export const StepStatus = styled.p<{ $pending: boolean }>`
  ${({ theme }) => theme.typography.captionStrong};
  flex-shrink: 0;
  width: 52px;
  text-align: right;
  color: ${({ theme, $pending }) =>
    $pending ? theme.colors.textSecondary : theme.colors.primary};
`;

export const CancelRow = styled.div`
  display: flex;
  justify-content: center;
`;
