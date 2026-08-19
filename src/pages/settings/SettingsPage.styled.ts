import styled from '@emotion/styled';
import Button from '@/components/common/Button';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
`;

/* ─── 탭 (MKT-01-01 #3 · Figma 223:3116) ─── */

export const TabList = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  /* Figma: 탭 컨테이너는 헤더와 같은 16px 좌우 패딩, 아래로 20px 여백 */
  padding: ${({ theme }) => `0 ${theme.spacing.md}`};
  margin-bottom: 20px;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
  ${({ theme }) => theme.typography.label01};
  background: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.bgLight};
  /* Figma: 활성 탭 글자색은 순백이 아니라 main/light */
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primaryLight : theme.colors.textSecondary};
  transition: background 120ms ease-out;

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background: ${({ theme, $active }) =>
        $active ? theme.colors.primary : theme.colors.bgGray};
    }
  }
`;

export const TabPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  /* Figma: 탭 콘텐츠 영역은 좌우 24px */
  padding: ${({ theme }) => `0 ${theme.spacing.lg}`};
`;

/* ─── 폼 공통 ─── */

/**
 * button default(기본 채움) — Figma의 저장·연동·완료 버튼은 solid main/main.
 * 공용 Button의 primary는 그라데이션(important 스타일)이라 배경만 재정의한다.
 */
export const DefaultButton = styled(Button)`
  && {
    background: ${({ theme }) => theme.colors.primary};
  }
`;

/** 2열 필드 행 — Figma 223:3509(items-start) / 223:3510(items-center) */
export const FieldRow = styled.div<{ $align?: 'start' | 'center' }>`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: ${({ $align = 'start' }) => ($align === 'center' ? 'center' : 'flex-start')};

  > * {
    flex: 1;
    min-width: 0;
  }

  ${({ theme }) => theme.media.tablet} {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const FieldRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

/** 라벨 + 임의 콘텐츠(버튼 등) 세로 묶음 — InputSet과 같은 라벨 규격 */
export const LabeledSlot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xxs};
`;

export const SlotLabel = styled.span`
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const RequiredMark = styled.span`
  margin-left: 2px;
  color: ${({ theme }) => theme.colors.error};
`;

export const SaveRow = styled.div`
  display: flex;
  justify-content: flex-end;
`;

/* ─── 마켓플레이스 연동 탭 (MKT-01-01 #14~17) ─── */

/** Figma 224:4069 — 안내·연동 카드·버튼·준비사항 블록 사이 16px */
export const MarketplaceSections = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

export const SectionTitle = styled.h2`
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const SectionDesc = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xxs};
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

/** Shopee 브랜드 배지 — 브랜드 고유색이라 theme 토큰 대신 Shopee 오렌지 그라데이션 사용 */
export const ShopeeBadge = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background-image: linear-gradient(135deg, #ff6b35 0%, #ee4d2d 100%);
  color: ${({ theme }) => theme.colors.textOnPrimary};
  font-size: 18px;
  font-weight: 800;
`;

/** 연동 상태 카드 — 비연동(경고 톤) / 연동(성공 톤) */
export const StoreCard = styled.div<{ $connected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.lg};
  /* Figma 12:15303 — 연동 카드는 배경과 같은 successLight 테두리(사실상 무테) */
  border: 1px solid
    ${({ theme, $connected }) =>
      $connected ? theme.colors.successLight : theme.colors.errorLight};
  background: ${({ theme, $connected }) =>
    $connected ? theme.colors.successLight : theme.colors.errorLight};
`;

export const StoreCardBody = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const StoreCardTitle = styled.p<{ $connected: boolean }>`
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme, $connected }) =>
    $connected ? theme.colors.primary : theme.colors.textPrimary};
`;

export const StoreCardStatus = styled.p<{ $connected: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme, $connected }) =>
    $connected ? theme.colors.success : theme.colors.error};

  img {
    width: 16px;
    height: 16px;
  }
`;

/** 스토어 해제 (카드 우측) — 경고 톤 보조 버튼 */
export const ReleaseButton = styled.button`
  flex-shrink: 0;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
  ${({ theme }) => theme.typography.label02};
  background: ${({ theme }) => theme.colors.errorLight};
  color: ${({ theme }) => theme.colors.error};

  @media (hover: hover) {
    &:hover {
      background: ${({ theme }) => theme.colors.bgGray};
    }
  }
`;

export const StoreList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const ActionRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};

  > * {
    flex: 1;
  }

  ${({ theme }) => theme.media.mobile} {
    flex-direction: column;
  }
`;

/** Shopee 연동 준비사항 (MKT-01-01 #17) */
export const GuideBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

export const GuideTitle = styled.h3`
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const GuideList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
  padding-left: ${({ theme }) => theme.spacing.md};
  list-style: decimal;
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;
