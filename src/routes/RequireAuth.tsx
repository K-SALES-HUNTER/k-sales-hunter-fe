import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { PATH } from './paths';

/** 레이아웃 없이 인증만 요구하는 라우트 가드 (ProductShell 페이지용 — 사이드바는 셸이 렌더) */
const RequireAuth = () => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  if (!isLoggedIn) return <Navigate to={PATH.LOGIN} replace />;
  return <Outlet />;
};

export default RequireAuth;
