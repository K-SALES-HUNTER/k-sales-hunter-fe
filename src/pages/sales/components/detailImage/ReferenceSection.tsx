import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import styled from '@emotion/styled';
import detailImgTrashIcon from '@/assets/icons/detailimg-trash.svg';
import detailImgUploadIcon from '@/assets/icons/detailimg-upload.svg';
import {
  MAX_REFERENCE_UPLOADS,
  referenceSectionMock,
  type ReferencePhoto,
} from '@/mocks/detailImage';
import * as S from './detailImage.styled';

export interface UploadedReference {
  id: string;
  label: string;
  src: string;
}

interface ReferenceSectionProps {
  /** AI가 보유한 상품 사진 */
  photos: ReferencePhoto[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  uploads: UploadedReference[];
  onUpload: (files: File[]) => void;
  onRemoveUpload: (id: string) => void;
  /** 생성 중에는 입력 불가 */
  disabled?: boolean;
}

/**
 * ①. 참고 사진 (Figma 573:6740) —
 * 보유 사진 중 선택 + 추가 레퍼런스 업로드. 최소 1장이 선택되면 생성 버튼이 열린다.
 */
const ReferenceSection = ({
  photos,
  selectedIds,
  onToggle,
  uploads,
  onUpload,
  onRemoveUpload,
  disabled = false,
}: ReferenceSectionProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const isFull = uploads.length >= MAX_REFERENCE_UPLOADS;

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList).filter((file) => file.type.startsWith('image/'));
    if (files.length > 0) onUpload(files.slice(0, MAX_REFERENCE_UPLOADS - uploads.length));
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    // 같은 파일 재선택 가능하도록 초기화
    event.target.value = '';
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    if (isFull) return;
    handleFiles(event.dataTransfer.files);
  };

  return (
    <S.SectionCard $muted={disabled} aria-labelledby="reference-title">
      <S.SectionHeader>
        <S.SectionTitle id="reference-title">{referenceSectionMock.title}</S.SectionTitle>
        <S.SectionNotice>{referenceSectionMock.notice}</S.SectionNotice>
      </S.SectionHeader>

      <Columns>
        <OwnedColumn>
          <S.FieldLabel>{referenceSectionMock.ownedLabel}</S.FieldLabel>
          <S.CardRow role="group" aria-label={referenceSectionMock.ownedLabel}>
            {photos.map((photo) => {
              const selected = selectedIds.includes(photo.id);
              return (
                <SelectableCard
                  key={photo.id}
                  type="button"
                  aria-pressed={selected}
                  $selected={selected}
                  onClick={() => onToggle(photo.id)}
                >
                  <img src={photo.src} alt={photo.label} />
                  {selected && <SelectedMark aria-hidden>선택</SelectedMark>}
                </SelectableCard>
              );
            })}
          </S.CardRow>
        </OwnedColumn>

        <UploadColumn>
          <S.FieldLabel>{referenceSectionMock.uploadLabel}</S.FieldLabel>
          <Dropzone
            role="button"
            tabIndex={isFull ? -1 : 0}
            aria-disabled={isFull}
            $dragActive={dragActive}
            $disabled={isFull}
            onClick={() => {
              if (!isFull) inputRef.current?.click();
            }}
            onKeyDown={(event) => {
              if (!isFull && (event.key === 'Enter' || event.key === ' ')) {
                event.preventDefault();
                inputRef.current?.click();
              }
            }}
            onDragOver={(event) => {
              event.preventDefault();
              if (!isFull) setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
          >
            <UploadIcon src={detailImgUploadIcon} alt="" aria-hidden />
            <DropzoneText>
              {isFull
                ? `최대 ${MAX_REFERENCE_UPLOADS}장까지 업로드했어요. 삭제 후 추가할 수 있어요.`
                : referenceSectionMock.dropzoneText}
            </DropzoneText>
          </Dropzone>

          <S.HiddenFileInput
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleChange}
          />

          {uploads.length > 0 && (
            <S.CardRow>
              {uploads.map((upload) => (
                <S.ImageCard key={upload.id}>
                  <img src={upload.src} alt={upload.label} />
                  <S.CardOverlay
                    type="button"
                    aria-label={`${upload.label} 삭제`}
                    onClick={() => onRemoveUpload(upload.id)}
                  >
                    <img src={detailImgTrashIcon} alt="" aria-hidden />
                  </S.CardOverlay>
                </S.ImageCard>
              ))}
            </S.CardRow>
          )}
        </UploadColumn>
      </Columns>
    </S.SectionCard>
  );
};

const Columns = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: flex-start;

  ${({ theme }) => theme.media.tablet} {
    flex-direction: column;
  }
`;

const OwnedColumn = styled.div`
  width: 318px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  ${({ theme }) => theme.media.tablet} {
    width: 100%;
  }
`;

const UploadColumn = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SelectableCard = styled.button<{ $selected: boolean }>`
  position: relative;
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bgLight};
  outline: 2px solid ${({ theme, $selected }) => ($selected ? theme.colors.primary : 'transparent')};
  outline-offset: -2px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const SelectedMark = styled.span`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.xxs};
  left: ${({ theme }) => theme.spacing.xxs};
  padding: 1px 6px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.primary};
  ${({ theme }) => theme.typography.captionStrong};
  color: ${({ theme }) => theme.colors.textOnPrimary};
`;

/* Figma UploadDropzone — main/light 배경, radius 14, 높이 104 */
const Dropzone = styled.div<{ $dragActive: boolean; $disabled: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 104px;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.xxxl}`};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme, $disabled }) =>
    $disabled ? theme.colors.bgGray : theme.colors.primaryLight};
  border: 2px dashed
    ${({ theme, $dragActive }) => ($dragActive ? theme.colors.primary : 'transparent')};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  text-align: center;
`;

const UploadIcon = styled.img`
  width: 32px;
  height: 32px;
`;

const DropzoneText = styled.p`
  ${({ theme }) => theme.typography.body01};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default ReferenceSection;
