import styled from '@emotion/styled';

/** 등록·수정 페이지 공용 콘텐츠 래퍼 (Figma 526:6590 — 좌우 24) */
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: ${({ theme }) => `0 ${theme.spacing.lg}`};
`;

/**
 * 등록·수정 화면 전용 헤더 (Figma 526:6586 = header + navibutton).
 * 좌측 header는 flex-1 + padding 24/16, 우측 navibutton은 padding 16.
 */
export const Header = styled.div`
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
`;

export const TitleRow = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.md}`};
`;

/** 뒤로가기 화살표 — Figma는 arrow를 180도 회전해 좌향으로 쓴다 */
export const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  transform: rotate(180deg);
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
    border-radius: ${({ theme }) => theme.radius.sm};
  }
`;

export const Title = styled.h1`
  ${({ theme }) => theme.typography.heading03};
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
`;

/** PageHeader 우측 액션 묶음 — 안내 문구 + 단일 버튼 (navibutton) */
export const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  flex-shrink: 0;
  padding: ${({ theme }) => theme.spacing.md};
`;

/** '입력하지 않은 항목은 AI가 알아서 채울게요!' 안내 문구 */
export const ActionHint = styled.p`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;

  ${({ theme }) => theme.media.mobile} {
    display: none;
  }
`;

export const SparkleIcon = styled.img`
  width: 16px;
  height: 16px;
`;
