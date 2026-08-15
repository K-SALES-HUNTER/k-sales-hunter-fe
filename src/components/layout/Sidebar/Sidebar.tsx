import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import navDashboardActive from '@/assets/icons/nav-dashboard-active.svg';
import navDashboard from '@/assets/icons/nav-dashboard.svg';
import navMarketActive from '@/assets/icons/nav-market-active.svg';
import navMarket from '@/assets/icons/nav-market.svg';
import navProductActive from '@/assets/icons/nav-product-active.svg';
import navProduct from '@/assets/icons/nav-product.svg';
import logoutIcon from '@/assets/icons/logout.svg';
import sidebarToggleIcon from '@/assets/icons/sidebar-toggle.svg';
import Button from '@/components/common/Button';
import Logo from '@/components/common/Logo';
import Modal from '@/components/common/Modal';
import { useResponsiveSidebar } from '@/hooks/useResponsiveSidebar';
import { PATH } from '@/routes/paths';
import { useAuthStore } from '@/stores/useAuthStore';
import { resetDemoSession } from '@/stores/useDemoProgressStore';
import { useSidebarStore } from '@/stores/useSidebarStore';
import * as S from './Sidebar.styled';

const NAV_ITEMS = [
  { to: PATH.DASHBOARD, label: '대시보드', icon: navDashboard, activeIcon: navDashboardActive },
  { to: PATH.PRODUCTS, label: '상품 관리', icon: navProduct, activeIcon: navProductActive },
  { to: PATH.SETTINGS, label: '마켓 / 설정', icon: navMarket, activeIcon: navMarketActive },
] as const;

interface SidebarProps {
  /** 2 Depth 화면의 상품 트리 영역 (기본 메뉴 아래 구분선과 함께 렌더) */
  tree?: ReactNode;
}

/**
 * sidebar (Figma 219:1369) — 좌측 260px 고정 패널.
 * 접으면 52.8px 아이콘만 남고, 로그아웃은 확인 모달을 거친다 (레이아웃 명세).
 */
const Sidebar = ({ tree }: SidebarProps) => {
  const navigate = useNavigate();
  const { collapsed, toggle } = useSidebarStore();
  const hasTree = Boolean(tree);

  // 1280px 경계 자동 접힘/펼침은 1 Depth에서만 (2 Depth는 트리가 주 내비게이션이라 제외)
  useResponsiveSidebar({ enabled: !hasTree });

  const logout = useAuthStore((s) => s.logout);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    // [DEMO-ONLY] 목 상태는 계정과 무관하게 세션에 남으므로 로그아웃 때 함께 비운다
    resetDemoSession();
    navigate(PATH.LOGIN, { replace: true });
  };

  return (
    <S.Aside $collapsed={collapsed}>
      <S.Top $collapsed={collapsed}>
        {!collapsed && <Logo size="sm" />}
        <S.ToggleButton
          type="button"
          onClick={toggle}
          aria-label={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
        >
          <img src={sidebarToggleIcon} alt="" />
        </S.ToggleButton>
      </S.Top>

      <S.Nav>
        <S.NavTop>
          <S.NavList>
            {NAV_ITEMS.map(({ to, label, icon, activeIcon }) => (
              <li key={to}>
                <S.NavItem to={to} $collapsed={collapsed} title={collapsed ? label : undefined}>
                  {({ isActive }) => (
                    <>
                      <S.NavIcon src={isActive ? activeIcon : icon} alt="" />
                      {!collapsed && <S.NavLabel $active={isActive}>{label}</S.NavLabel>}
                    </>
                  )}
                </S.NavItem>
              </li>
            ))}
          </S.NavList>

          {tree && !collapsed && <S.TreeSection>{tree}</S.TreeSection>}
        </S.NavTop>

        <S.LogoutButton
          type="button"
          $collapsed={collapsed}
          onClick={() => setLogoutModalOpen(true)}
          title={collapsed ? '로그아웃' : undefined}
        >
          <S.NavIcon src={logoutIcon} alt="" />
          {!collapsed && <S.LogoutLabel>로그아웃</S.LogoutLabel>}
        </S.LogoutButton>
      </S.Nav>

      <Modal
        open={logoutModalOpen}
        title="로그아웃"
        description="정말 로그아웃하시겠어요?"
        onClose={() => setLogoutModalOpen(false)}
        footer={
          <>
            <Button variant="primary" onClick={handleLogout}>
              로그아웃
            </Button>
            <Button variant="secondary" onClick={() => setLogoutModalOpen(false)}>
              취소
            </Button>
          </>
        }
      />
    </S.Aside>
  );
};

export default Sidebar;
