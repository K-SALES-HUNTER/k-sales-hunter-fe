import { useRef, useState, type ChangeEvent, type DragEvent } from 'react';
import styled from '@emotion/styled';
import trashIcon from '@/assets/icons/product-trash.svg';
import uploadIcon from '@/assets/icons/product-upload.svg';
import { MAX_PRODUCT_IMAGES, type ProductFormImage } from '@/hooks/useProductForm';

interface ProductImageUploaderProps {
  images: ProductFormImage[];
  onAdd: (files: File[]) => void;
  onRemove: (id: string) => void;
}

/**
 * ProductImageUploader (Figma 165:288) — UploadDropzone + ImagePreviewCard.
 * 드래그&드롭·클릭 선택, 최대 12장(차면 드롭존 비활성), 최신이 왼쪽, 첫 번째가 대표.
 */
const ProductImageUploader = ({ images, onAdd, onRemove }: ProductImageUploaderProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const isFull = images.length >= MAX_PRODUCT_IMAGES;

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList).filter((file) => file.type.startsWith('image/'));
    if (files.length > 0) onAdd(files);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFiles(event.target.files);
    // 같은 파일 재선택 가능하도록 초기화
    event.target.value = '';
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isFull) setDragActive(true);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragActive(false);
    if (isFull) return;
    handleFiles(event.dataTransfer.files);
  };

  return (
    <Wrapper>
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
        onDragOver={handleDragOver}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <UploadIcon src={uploadIcon} alt="" aria-hidden />
        <DropzoneText>
          {isFull
            ? `최대 ${MAX_PRODUCT_IMAGES}장까지 업로드했어요. 삭제 후 추가할 수 있어요.`
            : `상품 이미지를 드래그하거나 클릭하세요 (최대 ${MAX_PRODUCT_IMAGES}장)`}
        </DropzoneText>
      </Dropzone>

      <HiddenInput
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleChange}
      />

      {images.length > 0 && (
        <PreviewGrid>
          {images.map((image, index) => {
            // 업로드 중 카드 — 썸네일 대신 프로그레스 바가 차오른다 (Figma 163:199)
            if (image.uploadProgress !== null) {
              return (
                <PreviewCard key={image.id} aria-label="이미지 업로드 중" aria-busy>
                  <ProgressTrack>
                    <ProgressFill $ratio={image.uploadProgress} />
                  </ProgressTrack>
                </PreviewCard>
              );
            }
            return (
              <PreviewCard key={image.id}>
                <PreviewImage src={image.url} alt={`상품 이미지 ${index + 1}`} />
                {/* 첫 번째 이미지가 대표 (명세 F-11) */}
                {index === 0 && <MainBadge>대표</MainBadge>}
                <RemoveButton
                  type="button"
                  aria-label="이미지 삭제"
                  onClick={() => onRemove(image.id)}
                >
                  <TrashIcon src={trashIcon} alt="" aria-hidden />
                </RemoveButton>
              </PreviewCard>
            );
          })}
        </PreviewGrid>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  width: 100%;
`;

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

const HiddenInput = styled.input`
  display: none;
`;

/** 드롭존 아래 3열 그리드 (Figma 165:229 — grid-cols repeat(3), gap 16) */
const PreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 100px);
  gap: ${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.media.mobile} {
    grid-template-columns: repeat(2, 100px);
  }
`;

const PreviewCard = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bgLight};
`;

/** 업로드 진행 바 (Figma I163:199;163:164 — 52x8, bg/gray 트랙 + main 채움) */
const ProgressTrack = styled.div`
  width: 52px;
  height: 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bgGray};
`;

const ProgressFill = styled.div<{ $ratio: number }>`
  height: 100%;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.primary};
  width: ${({ $ratio }) => `${Math.round($ratio * 100)}%`};
  transition: width 80ms linear;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const MainBadge = styled.span`
  position: absolute;
  top: ${({ theme }) => theme.spacing.xxs};
  left: ${({ theme }) => theme.spacing.xxs};
  padding: 2px 6px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.textOnPrimary};
  ${({ theme }) => theme.typography.captionStrong};
`;

/* 호버 시에만 노출되는 삭제 오버레이 (Figma 165:225 — stroke/black 50%) */
const RemoveButton = styled.button`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: ${({ theme }) =>
    `color-mix(in srgb, ${theme.colors.textPrimary} 50%, transparent)`};
  opacity: 0;
  transition: opacity 120ms ease-out;

  ${PreviewCard}:hover &,
  &:focus-visible {
    opacity: 1;
  }
`;

const TrashIcon = styled.img`
  width: 15px;
  height: 15px;
`;

export default ProductImageUploader;
