import styled from '@emotion/styled';
import { generatingHeadlineMock, generatingNoticeMock } from '@/mocks/detailImage';
import { SolidButton } from '../ui';
import * as S from './detailImage.styled';

interface GeneratingSectionProps {
  /** 0 ~ 1 진행률 */
  progress: number;
  /** 남은 예상 시간 (초) */
  remainingSeconds: number;
  onCancel: () => void;
}

/**
 * 이미지 생성 중 (Figma 574:6754 + 677:10454 진행 상태) —
 * 진행 바 · 남은 시간 안내 · 결과 자리 스켈레톤 · 생성 취소.
 */
const GeneratingSection = ({ progress, remainingSeconds, onCancel }: GeneratingSectionProps) => (
  <>
    <S.SectionNotice>{generatingNoticeMock}</S.SectionNotice>

    <ProgressCard role="status" aria-live="polite">
      <ProgressTrack
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <ProgressFill $ratio={progress} />
      </ProgressTrack>
      <ProgressText>{`${generatingHeadlineMock}  ·  약 ${remainingSeconds}초 남음`}</ProgressText>
    </ProgressCard>

    <SkeletonWrap>
      <Skeleton aria-hidden />
      <SkeletonText>생성 중…</SkeletonText>
    </SkeletonWrap>

    {/* Figma 12:15609 AI 생성 로딩 템플릿 — 중단 버튼은 전폭 남색 '중단하기' */}
    <SolidButton fullWidth onClick={onCancel}>
      중단하기
    </SolidButton>
  </>
);

const ProgressCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bgGray};
`;

const ProgressFill = styled.div<{ $ratio: number }>`
  width: ${({ $ratio }) => `${Math.min(Math.max($ratio, 0), 1) * 100}%`};
  height: 100%;
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.primary};
  transition: width 200ms linear;
`;

const ProgressText = styled.p`
  ${({ theme }) => theme.typography.tableCell};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

/* Figma 결과 자리 — 400 × 400 스켈레톤 + "생성 중…" */
const SkeletonWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const Skeleton = styled.div`
  width: 400px;
  max-width: 100%;
  aspect-ratio: 1 / 1;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.bgGray};
  animation: detail-image-pulse 1.2s ease-in-out infinite;

  @keyframes detail-image-pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.55;
    }
  }
`;

const SkeletonText = styled.p`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default GeneratingSection;
