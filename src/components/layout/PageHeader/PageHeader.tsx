import type { ReactNode } from 'react';
import * as S from './PageHeader.styled';

interface PageHeaderProps {
  title: string;
  /** 설명 줄. 없으면 높이가 줄어든다 (header desc=false 배리언트) */
  description?: string;
  /** 우측 CTA 영역 (navibutton). 조회 전용 화면이면 생략 */
  action?: ReactNode;
}

/**
 * header + navibutton (Figma 227:991 · 227:2031) — 콘텐츠 영역 최상단 고정.
 * 명세: 데이터 로딩 여부와 무관하게 항상 먼저 렌더.
 */
const PageHeader = ({ title, description, action }: PageHeaderProps) => {
  return (
    <S.Header>
      <S.TitleGroup>
        <S.Title>{title}</S.Title>
        {description && <S.Description>{description}</S.Description>}
      </S.TitleGroup>
      {action && <S.Action>{action}</S.Action>}
    </S.Header>
  );
};

export default PageHeader;
