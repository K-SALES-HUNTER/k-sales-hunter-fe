import styled from '@emotion/styled';

export const Page = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.background};
`;

/** Figma 526:4710 — 폭 642px, 로고·필드·버튼 3블록 사이 32px */
export const JoinBox = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xl};
  width: min(642px, 100%);
`;

export const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;

/**
 * 2열 필드 행 (Figma 526:4713 items-start · 526:4716 items-center) —
 * 비밀번호 행은 조건 안내/불일치 문구가 붙어도 두 칸이 세로 중앙에 맞도록 center.
 */
export const FieldRow = styled.div<{ $align?: 'start' | 'center' }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: ${({ $align = 'start' }) => ($align === 'center' ? 'center' : 'flex-start')};
  width: 100%;

  > * {
    flex: 1;
    min-width: 0;
  }

  ${({ theme }) => theme.media.mobile} {
    flex-direction: column;
    align-items: stretch;
  }
`;

/** 비밀번호 확인 칸 + 일치 체크 아이콘 (Figma 538:8874) */
export const ConfirmSlot = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  > *:first-of-type {
    flex: 1;
    min-width: 0;
  }
`;

/** 비밀번호 일치 표시 (Figma 525:4397) — 18px 초록 체크 */
export const MatchIcon = styled.img`
  flex-shrink: 0;
  width: 18px;
  height: 18px;
`;

export const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
`;
