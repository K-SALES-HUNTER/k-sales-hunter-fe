import styled from '@emotion/styled';
import { baseModelsMock, generationModesMock, type GenerationModeId } from '@/mocks/detailImage';
import * as S from './detailImage.styled';

interface ModeSectionProps {
  mode: GenerationModeId;
  onChangeMode: (mode: GenerationModeId) => void;
  modelId: string;
  onChangeModel: (modelId: string) => void;
  disabled?: boolean;
}

/**
 * 생성 방식 선택 — 기본 컷 / 모델 컷.
 * 모델 컷을 고르면 기본 모델 4종 중 하나를 함께 선택한다 (명세 F-12).
 */
const ModeSection = ({
  mode,
  onChangeMode,
  modelId,
  onChangeModel,
  disabled = false,
}: ModeSectionProps) => (
  <S.SectionCard $muted={disabled} aria-labelledby="mode-title">
    <S.SectionHeader>
      <S.SectionTitle id="mode-title">생성 방식</S.SectionTitle>
      <S.SectionNotice>
        상품만 보여주는 기본 컷과 모델이 사용하는 모델 컷 중에서 고를 수 있어요.
      </S.SectionNotice>
    </S.SectionHeader>

    <OptionRow role="radiogroup" aria-label="생성 방식">
      {generationModesMock.map((item) => (
        <OptionCard
          key={item.id}
          type="button"
          role="radio"
          aria-checked={mode === item.id}
          $selected={mode === item.id}
          onClick={() => onChangeMode(item.id)}
        >
          <OptionLabel>{item.label}</OptionLabel>
          <OptionDesc>{item.desc}</OptionDesc>
        </OptionCard>
      ))}
    </OptionRow>

    {mode === 'model' && (
      <ModelBlock>
        <S.FieldLabel>기본 모델 선택</S.FieldLabel>
        <ModelGrid role="radiogroup" aria-label="기본 모델">
          {baseModelsMock.map((model) => (
            <ModelCard
              key={model.id}
              type="button"
              role="radio"
              aria-checked={modelId === model.id}
              $selected={modelId === model.id}
              onClick={() => onChangeModel(model.id)}
            >
              <OptionLabel>{model.name}</OptionLabel>
              <OptionDesc>{model.desc}</OptionDesc>
            </ModelCard>
          ))}
        </ModelGrid>
      </ModelBlock>
    )}
  </S.SectionCard>
);

const OptionRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};

  ${({ theme }) => theme.media.mobile} {
    flex-direction: column;
  }
`;

const OptionCard = styled.button<{ $selected: boolean }>`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid
    ${({ theme, $selected }) => ($selected ? theme.colors.primary : theme.colors.border)};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primaryLight : theme.colors.surface};
  text-align: left;
`;

const OptionLabel = styled.span`
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const OptionDesc = styled.span`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ModelBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ModelGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};

  ${({ theme }) => theme.media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const ModelCard = styled(OptionCard)``;

export default ModeSection;
