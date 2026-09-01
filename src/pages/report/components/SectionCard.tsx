import type { ReactNode } from 'react';
import styled from '@emotion/styled';

interface SectionCardProps {
  /** 섹션 제목. 없으면 헤더 줄 미렌더 */
  title?: string;
  /** 제목 좌측 아이콘 (AI 스파클·돋보기 등) */
  icon?: string;
  /** 헤더 우측 요소 (뱃지 등) */
  headerRight?: ReactNode;
  /**
   * 테두리 없는 변형 (Figma 576:6776 · 12:13779) —
   * 'AI 종합 결론'은 카드가 아니라 페이지 위에 그대로 놓인 블록이다.
   */
  bare?: boolean;
  children: ReactNode;
}

/** 보고서 공통 카드 (Figma Card) — 흰 배경 + 보더 + 라운드 컨테이너 */
const SectionCard = ({ title, icon, headerRight, bare = false, children }: SectionCardProps) => {
  return (
    <Card $bare={bare}>
      {title && (
        <Header>
          <HeaderLeft>
            {icon && (
              <IconChip aria-hidden>
                <img src={icon} alt="" />
              </IconChip>
            )}
            <Title>{title}</Title>
          </HeaderLeft>
          {headerRight}
        </Header>
      )}
      {children}
    </Card>
  );
};

const Card = styled.section<{ $bare: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme, $bare }) => ($bare ? `0 ${theme.spacing.xs}` : theme.spacing.lg)};
  background: ${({ theme }) => theme.colors.surface};
  border: ${({ theme, $bare }) => ($bare ? 'none' : `1px solid ${theme.colors.border}`)};
  /* 판매 정보·판매 관리의 Card와 같은 라운드 토큰을 쓴다 (보고서만 16px이던 것을 통일) */
  border-radius: ${({ theme, $bare }) => ($bare ? '0' : theme.radius.xl)};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const IconChip = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 7px;
  background: ${({ theme }) => theme.colors.primaryLight};

  img {
    width: 13px;
    height: 13px;
  }
`;

const Title = styled.h2`
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export default SectionCard;
