import styled from '@emotion/styled';
import { NavLink } from 'react-router-dom';

/** 레이아웃 명세: 열림 260px / 닫힘 52.8px */
export const Aside = styled.aside<{ $collapsed: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  flex-shrink: 0;
  width: ${({ $collapsed }) => ($collapsed ? '52.8px' : '260px')};
  height: 100%;
  padding: ${({ theme, $collapsed }) =>
    $collapsed ? `${theme.spacing.lg} 6px` : `${theme.spacing.lg} ${theme.spacing.md}`};
  background: ${({ theme }) => theme.colors.bgLight};
  border-right: 0.8px solid ${({ theme }) => theme.colors.border};
  overflow: hidden;
  transition: width 0.2s ease;
`;

export const Top = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'space-between')};
  padding: ${({ theme }) => `${theme.spacing.xxs} 0`};
`;

export const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radius.sm};

  img {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.bgGray};
  }
`;

export const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  min-height: 0;
`;

export const NavTop = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
`;

export const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
`;

export const TreeSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 0.8px solid ${({ theme }) => theme.colors.bgGray};
`;

export const NavItem = styled(NavLink, {
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  height: 40px;
  padding: ${({ $collapsed }) => ($collapsed ? '0' : '0 12px')};
  border-radius: ${({ theme }) => theme.radius.md};

  &.active {
    background: ${({ theme }) => theme.colors.primaryLight};
  }

  &:hover:not(.active) {
    background: ${({ theme }) => theme.colors.bgGray};
  }
`;

export const NavIcon = styled.img`
  width: 16px;
  height: 16px;
  flex-shrink: 0;
`;

export const NavLabel = styled.span<{ $active: boolean }>`
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.textSecondary};
  white-space: nowrap;
`;

export const LogoutButton = styled.button<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: ${({ $collapsed }) => ($collapsed ? 'center' : 'flex-start')};
  height: 40px;
  padding: ${({ $collapsed }) => ($collapsed ? '0' : '0 12px')};
  border-radius: ${({ theme }) => theme.radius.md};

  &:hover {
    background: ${({ theme }) => theme.colors.bgGray};
  }
`;

export const LogoutLabel = styled.span`
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
`;
