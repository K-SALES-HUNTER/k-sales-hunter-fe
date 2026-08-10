import InputSet from '@/components/common/InputSet';
import { promptSectionMock } from '@/mocks/detailImage';
import * as S from './detailImage.styled';

interface PromptSectionProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

/** ②. 요청 내용 (Figma 573:6763) — 원하는 이미지를 자연어 한 문장으로 입력 */
const PromptSection = ({ value, onChange, disabled = false }: PromptSectionProps) => (
  <S.SectionCard $muted={disabled} aria-labelledby="prompt-title">
    <S.SectionHeader>
      <S.SectionTitle id="prompt-title">{promptSectionMock.title}</S.SectionTitle>
      <S.SectionNotice>{promptSectionMock.notice}</S.SectionNotice>
    </S.SectionHeader>

    <InputSet
      aria-label={promptSectionMock.title}
      placeholder={promptSectionMock.placeholder}
      value={value}
      onChange={(event) => onChange(event.target.value)}
    />
  </S.SectionCard>
);

export default PromptSection;
