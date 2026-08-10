import type { ReactNode } from 'react';
import styled from '@emotion/styled';

interface SectionCardProps {
  /** 섹션 제목. 없으면 헤더 줄 미렌더 */
  title?: string;
  /** 제목 좌측 아이콘 (AI 스파클·돋보기 등) */
  icon?: string;
  /** 헤더 우측 요소 (뱃지 등) */
  headerRight?: ReactNode;
  children: ReactNode;
}

/** 보고서 공통 카드 (Figma Card) — 흰 배경 + 보더 + 라운드 컨테이너 */
const SectionCard = ({ title, icon, headerRight, children }: SectionCardProps) => {
  return (
    <Card>
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

const Card = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.spacing.md};
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
