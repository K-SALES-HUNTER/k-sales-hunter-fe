import styled from '@emotion/styled';
import { resultSectionNoticeMock, resultSectionTitleMock } from '@/mocks/detailImage';
import * as S from './detailImage.styled';

interface ResultSectionProps {
  src: string;
  /** 요청 내용 요약에 표시할 문구 */
  prompt: string;
}

/** 생성 결과 + 요청 내용 요약 (Figma 604:10255 · 604:10262) */
const ResultSection = ({ src, prompt }: ResultSectionProps) => (
  <>
    <S.SectionCard aria-labelledby="result-title">
      <S.SectionHeader>
        <S.SectionTitle id="result-title">{resultSectionTitleMock}</S.SectionTitle>
        <S.SectionNotice>{resultSectionNoticeMock}</S.SectionNotice>
      </S.SectionHeader>
      <ResultGrid>
        <ResultFrame>
          <ResultImage src={src} alt="AI가 생성한 이미지" />
        </ResultFrame>
      </ResultGrid>
    </S.SectionCard>

    <PromptSummary>
      <SummaryLabel>요청 내용</SummaryLabel>
      <SummaryText>{prompt}</SummaryText>
    </PromptSummary>
  </>
);

const ResultGrid = styled.div`
  display: flex;
  justify-content: center;
`;

const ResultFrame = styled.div`
  width: 412px;
  max-width: 100%;
  padding: 6px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
`;

const ResultImage = styled.img`
  width: 100%;
  aspect-ratio: 1 / 1;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgLight};
`;

const PromptSummary = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
  padding: ${({ theme }) => `14px ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgLight};
`;

const SummaryLabel = styled.span`
  ${({ theme }) => theme.typography.captionStrong};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SummaryText = styled.p`
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export default ResultSection;
