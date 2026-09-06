import { useEffect, useState } from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Outlet, useLocation } from 'react-router-dom';

const TRANSITION_MS = 320;

const TransitionIndicator = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), TRANSITION_MS);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <Overlay role="status" aria-live="polite" aria-label="페이지를 불러오는 중">
      <Spinner aria-hidden />
    </Overlay>
  );
};

/** 모든 라우트 전환에서 중복 없이 하나의 브랜드 컬러 스피너만 노출한다. */
const RouteTransition = () => {
  const location = useLocation();

  return (
    <>
      <Outlet />
      <TransitionIndicator key={location.key} />
    </>
  );
};

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 120;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, ${({ theme }) => theme.colors.surface} 78%, transparent);
  pointer-events: none;
`;

const Spinner = styled.span`
  width: 44px;
  height: 44px;
  border: 4px solid ${({ theme }) => theme.colors.primaryLight};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-right-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.75s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 1.5s;
  }
`;

export default RouteTransition;
