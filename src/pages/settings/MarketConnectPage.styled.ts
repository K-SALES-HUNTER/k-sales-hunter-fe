import styled from '@emotion/styled';
import Button from '@/components/common/Button';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

/* ─── 2 Depth 헤더 (뒤로가기 + 제목) ─── */

export const TopBar = styled.header`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.lg} ${theme.spacing.md}`};
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;

  img {
    width: 11px;
    height: 19px;
    /* 다운로드한 chevron은 우향 → 뒤로가기용으로 180도 회전 */
    transform: rotate(180deg);
  }
`;

export const TopTitle = styled.h1`
  ${({ theme }) => theme.typography.heading03};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

/* ─── 콘텐츠 ─── */

export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  width: min(900px, 100%);
  margin: ${({ theme }) => theme.spacing.xxxl} auto 0;
  padding: ${({ theme }) => `0 ${theme.spacing.lg} ${theme.spacing.xxxl}`};
`;

export const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  text-align: center;
`;

export const Title = styled.h2`
  ${({ theme }) => theme.typography.heading02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Description = styled.p`
  ${({ theme }) => theme.typography.body01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const Notice = styled.p`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.errorLight};
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.error};
`;

/* ─── 국가 목록 (2열×6행, 열 우선 순서) ─── */

export const CountryGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(6, auto);
  grid-auto-flow: column;
  gap: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.media.mobile} {
    grid-template-columns: 1fr;
    grid-template-rows: none;
    grid-auto-flow: row;
  }
`;

export const CountryRow = styled.div<{ $connected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  min-height: 46px;
  padding: ${({ theme }) => `${theme.spacing.xxs} ${theme.spacing.xs}`};
  padding-left: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid
    ${({ theme, $connected }) => ($connected ? theme.colors.successVivid : theme.colors.border)};
  background: ${({ theme }) => theme.colors.surface};
`;

export const CountryName = styled.p`
  flex: 1;
  min-width: 0;
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const ConnectedBadge = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
  padding-right: ${({ theme }) => theme.spacing.xxs};
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.successVivid};

  img {
    width: 16px;
    height: 16px;
  }
`;

/** 연동하기 — Figma의 solid navy 소형 버튼 (공용 primary는 그라데이션 CTA라 별도 정의) */
export const ConnectButton = styled.button`
  flex-shrink: 0;
  height: 32px;
  padding: ${({ theme }) => `0 ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
  ${({ theme }) => theme.typography.label02};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textOnPrimary};

  &:disabled {
    opacity: 0.6;
    pointer-events: none;
  }

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.textStrong};
    }
  }
`;

/**
 * 완료 — Figma의 button default(기본 채움)는 solid main/main.
 * 공용 Button primary는 그라데이션(important)이라 배경만 재정의한다.
 */
export const DefaultButton = styled(Button)`
  && {
    background: ${({ theme }) => theme.colors.primary};
  }
`;

/** 스토어 해제 — 라이트 네이비 소형 버튼 */
export const ReleaseButton = styled.button`
  flex-shrink: 0;
  height: 32px;
  padding: ${({ theme }) => `0 ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
  ${({ theme }) => theme.typography.label02};
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.textPrimary};

  @media (hover: hover) {
    &:hover {
      background: ${({ theme }) => theme.colors.bgGray};
    }
  }
`;
