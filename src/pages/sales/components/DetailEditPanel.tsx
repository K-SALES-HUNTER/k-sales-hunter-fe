import { useRef, useState } from 'react';
import styled from '@emotion/styled';
import salesCopyIcon from '@/assets/icons/sales-copy.svg';
import salesDeleteIcon from '@/assets/icons/sales-delete.svg';
import Button from '@/components/common/Button';
import InputSet from '@/components/common/InputSet';
import TextareaSet from '@/components/common/TextareaSet';
import type { DetailImageEntry } from '@/stores/useDetailImageStore';

export interface DetailTextDraft {
  name: string;
  description: string;
  sellingPoints: string;
  mainTarget: string;
}

interface DetailEditPanelProps {
  name: string;
  description: string;
  /** 상품 등록에서 확정한 셀링 포인트 — 여기서 직접 타이핑해 고칠 수 있다 */
  sellingPoints: string;
  /** 상품 등록에서 확정한 메인 타겟 — 여기서 직접 타이핑해 고칠 수 있다 */
  mainTarget: string;
  /** 저장 시 미리보기 즉시 반영 */
  onSaveText: (draft: DetailTextDraft) => void;
  /**
   * AI 재생성 회차. 셀링 포인트·메인 타겟 수정으로 상세 설명이 다시 생성되면 증가하고,
   * 그때 패널의 상세 설명 입력값을 재생성 결과로 되돌리고 다시 그라데이션으로 표시한다.
   */
  aiRevision: number;
  /** 재생성 진행 중 — 저장 버튼 로딩 */
  regenerating: boolean;
  images: DetailImageEntry[];
  mainImageId: string;
  onSetMainImage: (id: string) => void;
  onDeleteImage: (id: string) => void;
  onUploadImage: (file: File) => void;
  /** AI로 생성 — 상세 이미지 AI 생성 화면으로 이동 */
  onGenerateImage: () => void;
  /** 기존 상품 이미지 재생성 (생성 화면에서 재생성 확인 모달) */
  onRegenerateImage: (id: string) => void;
  detailImages: DetailImageEntry[];
  onDeleteDetailImage: (id: string) => void;
  onUploadDetailImage: (file: File) => void;
  onGenerateDetailImage: () => void;
  onRegenerateDetailImage: (id: string) => void;
}

const copyText = (value: string) => {
  void navigator.clipboard.writeText(value);
};

/**
 * 상세 페이지 편집 패널 (DTL-01-01 #10~21, Figma 344:3063 — 우측 320px 고정) —
 * 수정 탭 클릭 시 해당 헤더로 스크롤, 텍스트 저장 시 미리보기 즉시 반영.
 * 이미지 행은 대표 지정·재생성·삭제를 제공한다.
 */
const DetailEditPanel = ({
  name,
  description,
  sellingPoints,
  mainTarget,
  onSaveText,
  aiRevision,
  regenerating,
  images,
  mainImageId,
  onSetMainImage,
  onDeleteImage,
  onUploadImage,
  onGenerateImage,
  onRegenerateImage,
  detailImages,
  onDeleteDetailImage,
  onUploadDetailImage,
  onGenerateDetailImage,
  onRegenerateDetailImage,
}: DetailEditPanelProps) => {
  const [nameDraft, setNameDraft] = useState(name);
  const [descDraft, setDescDraft] = useState(description);
  const [pointsDraft, setPointsDraft] = useState(sellingPoints);
  const [targetDraft, setTargetDraft] = useState(mainTarget);
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  /**
   * 네 칸 모두 AI가 채워 둔 값이라 그라데이션 텍스트로 시작하고,
   * 셀러가 한 글자라도 고치면 그 칸만 사용자 문장으로 승격되어 일반 텍스트가 된다.
   */
  const [nameIsAi, setNameIsAi] = useState(true);
  const [descIsAi, setDescIsAi] = useState(true);
  const [pointsIsAi, setPointsIsAi] = useState(true);
  const [targetIsAi, setTargetIsAi] = useState(true);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const detailImageInputRef = useRef<HTMLInputElement>(null);

  /**
   * 셀링 포인트·메인 타겟 수정으로 상세 설명이 다시 생성되면 입력값도 그 결과로 갈아 끼운다.
   * (props가 바뀔 때 state를 맞추는 경우라 effect가 아니라 렌더 중 조정 — react.dev 권장 패턴)
   */
  const [appliedRevision, setAppliedRevision] = useState(aiRevision);
  if (appliedRevision !== aiRevision) {
    setAppliedRevision(aiRevision);
    setDescDraft(description);
    setDescIsAi(true);
  }

  // 저장하기 — 값 변경 시만 활성
  const changed =
    nameDraft !== name ||
    descDraft !== description ||
    pointsDraft !== sellingPoints ||
    targetDraft !== mainTarget;

  const scrollTo = (tab: 'text' | 'image') => {
    setActiveTab(tab);
    document
      .getElementById(tab === 'text' ? 'section-edit-text' : 'section-edit-image')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <Panel aria-label="상세 페이지 수정">
      <PanelTitle>상세 페이지 수정</PanelTitle>

      <TabRow role="tablist">
        <TabButton
          type="button"
          role="tab"
          aria-selected={activeTab === 'text'}
          $active={activeTab === 'text'}
          onClick={() => scrollTo('text')}
        >
          텍스트 수정
        </TabButton>
        <TabButton
          type="button"
          role="tab"
          aria-selected={activeTab === 'image'}
          $active={activeTab === 'image'}
          onClick={() => scrollTo('image')}
        >
          이미지 수정
        </TabButton>
      </TabRow>

      {/* 텍스트 수정 */}
      <SectionHeading id="section-edit-text">텍스트 수정</SectionHeading>

      <Field>
        <LabelRow>
          <span>상품명</span>
          <CopyButton
            type="button"
            aria-label="상품명 복사"
            disabled={nameDraft === ''}
            onClick={() => copyText(nameDraft)}
          >
            <img src={salesCopyIcon} alt="" aria-hidden />
          </CopyButton>
        </LabelRow>
        <InputSet
          aria-label="상품명"
          aiFilled={nameIsAi}
          value={nameDraft}
          onChange={(e) => {
            setNameDraft(e.target.value);
            setNameIsAi(false);
          }}
        />
      </Field>

      <Field>
        <LabelRow>
          <span>상세 설명</span>
          <CopyButton
            type="button"
            aria-label="상세 설명 복사"
            disabled={descDraft === ''}
            onClick={() => copyText(descDraft)}
          >
            <img src={salesCopyIcon} alt="" aria-hidden />
          </CopyButton>
        </LabelRow>
        <TextareaSet
          aria-label="상세 설명"
          rows={5}
          aiFilled={descIsAi}
          value={descDraft}
          onChange={(e) => {
            setDescDraft(e.target.value);
            setDescIsAi(false);
          }}
        />
      </Field>

      {/*
        셀링 포인트·메인 타겟 (시연 11단계) — 상품 정보로 돌아가지 않고 이 자리에서 직접 타이핑해
        고치면, 저장 시 상세 설명과 상세 이미지가 그 내용으로 다시 생성된다.
      */}
      <Field>
        <LabelRow>
          <span>셀링 포인트</span>
          <CopyButton
            type="button"
            aria-label="셀링 포인트 복사"
            disabled={pointsDraft === ''}
            onClick={() => copyText(pointsDraft)}
          >
            <img src={salesCopyIcon} alt="" aria-hidden />
          </CopyButton>
        </LabelRow>
        <TextareaSet
          aria-label="셀링 포인트"
          rows={3}
          aiFilled={pointsIsAi}
          value={pointsDraft}
          placeholder="상품의 셀링 포인트를 입력해 주세요."
          onChange={(e) => {
            setPointsDraft(e.target.value);
            setPointsIsAi(false);
          }}
        />
      </Field>

      <Field>
        <LabelRow>
          <span>메인 타겟</span>
        </LabelRow>
        <InputSet
          aria-label="메인 타겟"
          aiFilled={targetIsAi}
          value={targetDraft}
          placeholder="상품의 메인 타겟을 입력해 주세요."
          onChange={(e) => {
            setTargetDraft(e.target.value);
            setTargetIsAi(false);
          }}
        />
      </Field>

      <RegenerateHint>
        셀링 포인트·메인 타겟을 고쳐 저장하면 상세 설명과 상세 이미지가 다시 생성됩니다.
      </RegenerateHint>

      <Button
        variant="secondary"
        fullWidth
        loading={regenerating}
        disabled={!changed}
        onClick={() =>
          onSaveText({
            name: nameDraft,
            description: descDraft,
            sellingPoints: pointsDraft,
            mainTarget: targetDraft,
          })
        }
      >
        저장하기
      </Button>

      {/* 상품 이미지 수정 */}
      <SectionHeading id="section-edit-image">상품 이미지 수정</SectionHeading>

      <ImageList>
        {images.map((image) => {
          const isMain = image.id === mainImageId;
          return (
            <ImageRow key={image.id}>
              <ImageThumb src={image.src} alt={image.label} />
              <ImageInfo>
                <ImageName>{image.label}</ImageName>
                <ChipRow>
                  {isMain ? (
                    <MainBadge>대표 이미지</MainBadge>
                  ) : (
                    <SetMainButton type="button" onClick={() => onSetMainImage(image.id)}>
                      대표 이미지로 설정
                    </SetMainButton>
                  )}
                  <RegenerateButton type="button" onClick={() => onRegenerateImage(image.id)}>
                    AI로 재생성
                  </RegenerateButton>
                </ChipRow>
              </ImageInfo>
              {/* 마지막 1장은 삭제 불가 (최소 1장 유지) · 대표 삭제 시 자동 승격 */}
              <DeleteButton
                type="button"
                aria-label={`${image.label} 삭제`}
                disabled={images.length <= 1}
                onClick={() => onDeleteImage(image.id)}
              >
                <img src={salesDeleteIcon} alt="" aria-hidden />
              </DeleteButton>
            </ImageRow>
          );
        })}
      </ImageList>

      <ButtonRow>
        <Button variant="secondary" fullWidth onClick={() => imageInputRef.current?.click()}>
          이미지 추가 업로드
        </Button>
        <Button variant="secondary" fullWidth onClick={onGenerateImage}>
          AI로 생성
        </Button>
      </ButtonRow>
      <HiddenFileInput
        ref={imageInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUploadImage(file);
          e.target.value = '';
        }}
      />

      {/* 상세 이미지 수정 */}
      <SectionHeading id="section-edit-detail-image">상세 이미지 수정</SectionHeading>

      <ImageList>
        {detailImages.map((image) => (
          <ImageRow key={image.id}>
            <ImageThumb src={image.src} alt={image.label} />
            <ImageInfo>
              <ImageName>{image.label}</ImageName>
              <ChipRow>
                <RegenerateButton type="button" onClick={() => onRegenerateDetailImage(image.id)}>
                  AI로 재생성
                </RegenerateButton>
              </ChipRow>
            </ImageInfo>
            <DeleteButton
              type="button"
              aria-label={`${image.label} 삭제`}
              disabled={detailImages.length <= 1}
              onClick={() => onDeleteDetailImage(image.id)}
            >
              <img src={salesDeleteIcon} alt="" aria-hidden />
            </DeleteButton>
          </ImageRow>
        ))}
      </ImageList>

      <ButtonRow>
        <Button variant="secondary" fullWidth onClick={() => detailImageInputRef.current?.click()}>
          상세 이미지 추가 업로드
        </Button>
        <Button variant="secondary" fullWidth onClick={onGenerateDetailImage}>
          AI로 생성
        </Button>
      </ButtonRow>
      <HiddenFileInput
        ref={detailImageInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUploadDetailImage(file);
          e.target.value = '';
        }}
      />
    </Panel>
  );
};

const Panel = styled.aside`
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  align-self: flex-start;

  /* 2단이 세로로 쌓이는 폭에서는 전체 폭 사용 (DetailPage Columns와 동일 기준) */
  @media (max-width: 1439px) {
    width: 100%;
  }
`;

const PanelTitle = styled.h2`
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TabRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  border-bottom: 0.8px solid ${({ theme }) => theme.colors.border};
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.xxs}`};
  margin-bottom: -0.8px;
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textSecondary)};
  border-bottom: 2px solid
    ${({ theme, $active }) => ($active ? theme.colors.primary : 'transparent')};
`;

const SectionHeading = styled.h3`
  margin-top: ${({ theme }) => theme.spacing.sm};
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
`;

const LabelRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    ${({ theme }) => theme.typography.label02};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

/** 셀링 포인트·메인 타겟 수정이 무엇을 다시 만드는지 알려주는 한 줄 (재생성 트리거 안내) */
const RegenerateHint = styled.p`
  padding: ${({ theme }) => `${theme.spacing.xs} 10px`};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primaryLight};
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.primary};
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.radius.sm};

  img {
    width: 16px;
    height: 16px;
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.bgLight};
  }

  &:disabled {
    opacity: 0.4;
  }
`;

const ImageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ImageRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: ${({ theme }) => `9px ${theme.spacing.md}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
`;

const ImageThumb = styled.img`
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 7px;
  object-fit: cover;
  background: ${({ theme }) => theme.colors.bgLight};
`;

const ImageInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xxs};
`;

const ImageName = styled.span`
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xxs};
`;

/* Figma 327:2653 — 대표 이미지 뱃지 (main 배경 + 흰 글씨) */
const MainBadge = styled.span`
  padding: 1px ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.primary};
  ${({ theme }) => theme.typography.captionStrong};
  color: ${({ theme }) => theme.colors.textOnPrimary};
`;

/* Figma 327:2659 — 대표 이미지로 설정 (bg/light 칩) */
const SetMainButton = styled.button`
  padding: 1px 6px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.bgLight};
  ${({ theme }) => theme.typography.captionStrong};
  color: ${({ theme }) => theme.colors.textSecondary};

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const RegenerateButton = styled(SetMainButton)`
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
`;

/* Figma 12:14200 — 삭제(X) 버튼은 행에 상시 노출 */
const DeleteButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.sm};

  img {
    width: 12px;
    height: 12px;
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.errorLight};
  }

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const HiddenFileInput = styled.input`
  display: none;
`;

export default DetailEditPanel;
