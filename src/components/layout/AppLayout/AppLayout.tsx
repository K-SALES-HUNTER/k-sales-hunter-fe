import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '@/components/layout/Sidebar';
import { PATH } from '@/routes/paths';
import { useAuthStore } from '@/stores/useAuthStore';
import * as S from './AppLayout.styled';

/**
 * 1 Depth 기본 레이아웃 — 사이드바 + 콘텐츠 2단.
 * 로그인하지 않았으면 로그인 페이지로 보낸다.
 * (사이드바 반응형 동작은 Sidebar 내부의 useResponsiveSidebar가 담당)
 */
const AppLayout = () => {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);

  if (!isLoggedIn) return <Navigate to={PATH.LOGIN} replace />;

  return (
    <S.Layout>
      <Sidebar />
      <S.Content>
        <Outlet />
      </S.Content>
    </S.Layout>
  );
};

export default AppLayout;
