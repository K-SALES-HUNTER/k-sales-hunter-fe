import { css, Global, useTheme } from '@emotion/react';

const GlobalStyle = () => {
  const theme = useTheme();

  return (
    <Global
      styles={css`
        /* Pretendard Variable — public/fonts/ 셀프호스팅 (가변 폰트: 파일 하나로 굵기 45~920 지원) */
        @font-face {
          font-family: 'Pretendard Variable';
          font-weight: 45 920;
          font-style: normal;
          font-display: swap;
          src: url('/fonts/PretendardVariable.woff2') format('woff2-variations');
        }

        /* 리셋 */
        *,
        *::before,
        *::after {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html {
          font-size: 16px;
        }

        body {
          font-family:
            'Pretendard Variable',
            Pretendard,
            -apple-system,
            BlinkMacSystemFont,
            system-ui,
            Roboto,
            'Helvetica Neue',
            'Segoe UI',
            'Apple SD Gothic Neo',
            'Noto Sans KR',
            'Malgun Gothic',
            sans-serif;
          background-color: ${theme.colors.background};
          color: ${theme.colors.textPrimary};
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        button {
          font: inherit;
          border: none;
          background: none;
          cursor: pointer;
        }

        ul,
        ol {
          list-style: none;
        }

        input,
        textarea,
        select {
          font: inherit;
        }

        img,
        svg {
          display: block;
          max-width: 100%;
        }

        /**
         * 섹션 탭 스크롤 목적지 — ProductShell 고정 스택(--shell-sticky-h, 실측값)과
         * 섹션 탭 높이만큼 여백을 둬 상단 고정 영역에 가려지지 않게 한다.
         */
        [id^='section-'] {
          scroll-margin-top: calc(var(--shell-sticky-h, 197px) + 56px);
        }
      `}
    />
  );
};

export default GlobalStyle;
