import styled from '@emotion/styled';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

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

/**
 * Figma 514:4264 — 헤더와 240px 간격을 두고 가운데 정렬,
 * 제목/입력/버튼 사이 간격은 32px, 폭은 제목 너비(380px)에 맞춘 컬럼.
 */
export const Content = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  width: min(380px, calc(100% - 48px));
  margin: 240px auto 0;
  padding: ${({ theme }) => `0 0 ${theme.spacing.xxxl}`};

  ${({ theme }) => theme.media.mobile} {
    margin-top: ${({ theme }) => theme.spacing.xxxl};
  }
`;

export const StepTitle = styled.h2`
  ${({ theme }) => theme.typography.heading02};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: center;
`;
