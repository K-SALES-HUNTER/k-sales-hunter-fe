import { useState } from 'react';
import styled from '@emotion/styled';

export interface SectionTabItem {
  label: string;
  /** 스크롤 대상 요소 id */
  targetId: string;
}

interface SectionTabsProps {
  tabs: SectionTabItem[];
}

/**
 * 섹션 탭 (Figma tab unit) — 클릭 시 해당 섹션으로 스크롤 이동 (라우팅 없음).
 * 페이지 탭(라우팅)과 구분된다.
 */
const SectionTabs = ({ tabs }: SectionTabsProps) => {
  const [active, setActive] = useState(tabs[0]?.targetId);

  const handleClick = (targetId: string) => {
    setActive(targetId);
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <TabRow role="tablist">
      {tabs.map((tab) => (
        <TabButton
          key={tab.targetId}
          type="button"
          role="tab"
          aria-selected={active === tab.targetId}
          $active={active === tab.targetId}
          onClick={() => handleClick(tab.targetId)}
        >
          {tab.label}
        </TabButton>
      ))}
    </TabRow>
  );
};

/* 명세: 탭 아래로 스크롤하면 ProductShell 고정 스택 바로 아래에 고정된다 */
const TabRow = styled.div`
  position: sticky;
  top: var(--shell-sticky-h, 197px);
  z-index: 9;
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.xs} 0`};
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 0.8px solid ${({ theme }) => theme.colors.border};
`;

/** tab unit (Figma 311:3133) — click: 볼드 + 하단 2px 라인 / unclick: 레귤러 + 회색 */
const TabButton = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => `10px ${theme.spacing.none}`};
  margin-bottom: -0.8px;
  white-space: nowrap;
  ${({ theme, $active }) => ($active ? theme.typography.label02 : theme.typography.tableCell)};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.textPrimary : theme.colors.textSecondary};
  border-bottom: 2px solid
    ${({ theme, $active }) => ($active ? theme.colors.textPrimary : 'transparent')};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

export default SectionTabs;
