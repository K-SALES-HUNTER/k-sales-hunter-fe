import styled from '@emotion/styled';

/** 화면 콘텐츠 폭 (Figma 573:6736 — 900px 고정 폭 단일 컬럼) */
export const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 100%;
  max-width: 900px;
`;

export const PageTitle = styled.h2`
  ${({ theme }) => theme.typography.heading02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const PageNotice = styled.p`
  margin-top: 6px;
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

/** 섹션 카드 (Figma ①. 참고 사진 / ②. 요청 내용 — radius 10, border 1px) */
export const SectionCard = styled.section<{ $muted?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  opacity: ${({ $muted }) => ($muted ? 0.5 : 1)};
  pointer-events: ${({ $muted }) => ($muted ? 'none' : 'auto')};
  transition: opacity 120ms ease-out;
`;

export const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
`;

export const SectionTitle = styled.h3`
  ${({ theme }) => theme.typography.heading03};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export const SectionNotice = styled.p`
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export const FieldLabel = styled.p`
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

/**
 * 카드 호버 시 오버레이를 노출한다.
 * @emotion/babel-plugin 없이도 동작하도록 컴포넌트 셀렉터 대신 클래스명으로 연결한다.
 */
export const CARD_OVERLAY_CLASS = 'image-card-overlay';

/** 100 × 100 이미지 카드 (Figma ImagePreviewCard) */
export const ImageCard = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;

  &:hover .${CARD_OVERLAY_CLASS} {
    opacity: 1;
  }

  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bgLight};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const CardRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

/**
 * 호버 시에만 노출되는 오버레이 버튼 (Figma ImagePreviewCard 호버 상태).
 * 배경은 textPrimary(stroke/black) 50% 딤 — 알파값이라 토큰으로 표현할 수 없어 rgba로 둔다.
 */
export const CardOverlay = styled.button`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(54, 65, 83, 0.5);
  opacity: 0;
  transition: opacity 120ms ease-out;

  &:focus-visible {
    opacity: 1;
  }

  img {
    width: 15px;
    height: 15px;
  }
`;

export const HiddenFileInput = styled.input`
  display: none;
`;

export const ActionRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.xxs};
`;

export const HintText = styled.p`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textSecondary};
`;
