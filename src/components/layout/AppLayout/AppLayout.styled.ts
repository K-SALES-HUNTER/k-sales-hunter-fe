import styled from '@emotion/styled';

/* 레이아웃 명세: 세로 스크롤은 콘텐츠 영역에서만 발생 (사이드바·헤더 고정) */
export const Layout = styled.div`
  display: flex;
  align-items: stretch;
  height: 100vh;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
`;

export const Content = styled.main`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding-bottom: ${({ theme }) => theme.spacing.lg};
`;
