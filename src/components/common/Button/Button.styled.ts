import { css, keyframes, type Theme } from '@emotion/react';
import styled from '@emotion/styled';
import type { ButtonVariant } from './Button';

const variantStyles = (theme: Theme) => ({
  // 화면의 주 동작 — 그라데이션 채움 (화면당 1개 원칙)
  primary: css`
    background: ${theme.colors.gradient};
    color: ${theme.colors.textOnPrimary};
  `,
  // 보조 동작 (취소·전체보기 등)
  secondary: css`
    background: ${theme.colors.primaryLight};
    color: ${theme.colors.textPrimary};

    &:disabled {
      color: ${theme.colors.textSecondary};
    }
  `,
  // 되돌릴 수 없는 동작 (삭제·판매 중단) — 실행 전 모달 확인 필수
  warning: css`
    background: ${theme.colors.error};
    color: ${theme.colors.textOnPrimary};

    /* 명세: warning은 focus 아웃라인 색을 경고색으로 */
    &:focus-visible {
      outline-color: ${theme.colors.error};
    }

    &:disabled {
      color: ${theme.colors.bgGray};
    }
  `,
  // 배경 없는 텍스트 버튼 (더보기 등)
  text: css`
    background: transparent;
    color: ${theme.colors.textPrimary};

    &:disabled {
      color: ${theme.colors.textSecondary};
    }
  `,
});

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Spinner = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

/**
 * StateLayer (Figma 705:10249) — 상태마다 배경색을 따로 두지 않고
 * ::after 오버레이 하나로 hover/focus/disabled를 표현한다.
 */
export const Button = styled.button<{ $variant: ButtonVariant; $fullWidth: boolean }>`
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
  ${({ theme }) => theme.typography.label02};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background: transparent;
    transition: background 120ms ease-out;
  }

  @media (hover: hover) {
    &:hover:not(:disabled)::after {
      background: rgba(0, 0, 0, 0.08);
    }
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;

    &::after {
      background: rgba(0, 0, 0, 0.12);
    }
  }

  &:disabled {
    pointer-events: none;

    &::after {
      background: rgba(255, 255, 255, 0.6);
    }
  }

  ${({ theme, $variant }) => variantStyles(theme)[$variant]}
`;
