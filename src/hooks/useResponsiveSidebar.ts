import { useEffect } from 'react';
import { useSidebarStore } from '@/stores/useSidebarStore';
import { theme } from '@/styles/theme';

/**
 * 사이드바 반응형 동작 (레이아웃 명세 2.1 ①)
 * - 화면 폭이 1280px 미만이 되면 자동으로 접는다.
 * - 다시 1280px 이상이 되면 자동으로 펼친다.
 * - 경계를 넘을 때만 전환하므로, 같은 구간 안에서 사용자가 직접 토글한 상태는 그대로 유지된다.
 */
export const useResponsiveSidebar = () => {
  const setCollapsed = useSidebarStore((s) => s.setCollapsed);

  useEffect(() => {
    const query = `(max-width: ${theme.breakpoints.sidebarCollapse - 1}px)`;
    const isNarrow = () => window.matchMedia(query).matches;

    // 진입 시점에는 좁을 때만 접는다 — 넓은 화면에서 세션 중 접어둔 상태(명세: 세션 동안 유지)는 존중
    const collapseIfNarrow = () => {
      if (isNarrow()) setCollapsed(true);
    };
    collapseIfNarrow();
    // persist 복원(비동기)이 초기 자동 접힘을 덮어쓸 수 있어 복원 완료 후 한 번 더 동기화
    const unsubHydration = useSidebarStore.persist.onFinishHydration(collapseIfNarrow);

    // 경계를 넘는 순간에만 전환 — 좁아지면 접고, 넓어지면 펼친다
    let wasNarrow = isNarrow();
    const syncOnCross = () => {
      const narrow = isNarrow();
      if (narrow === wasNarrow) return;
      wasNarrow = narrow;
      setCollapsed(narrow);
    };

    // 일부 환경(임베디드 웹뷰 등)에서 matchMedia change가 발화하지 않아 resize를 함께 구독
    const mql = window.matchMedia(query);
    mql.addEventListener('change', syncOnCross);
    window.addEventListener('resize', syncOnCross);

    return () => {
      unsubHydration();
      mql.removeEventListener('change', syncOnCross);
      window.removeEventListener('resize', syncOnCross);
    };
  }, [setCollapsed]);
};
