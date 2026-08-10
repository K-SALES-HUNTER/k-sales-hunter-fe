import { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/common/Button';
import ProductShell from '@/components/layout/ProductShell';
import { useProduct } from '@/hooks/useProducts';
import { useDetailContent } from '@/hooks/useSales';
import type { DetailImageTarget } from '@/mocks/detailImage';
import {
  type DetailImageItem,
  type PdpContent,
  type PdpSeller,
  type ProductImageItem,
} from '@/mocks/sales';
import { buildPath, PATH } from '@/routes/paths';
import {
  detailImageKey,
  resolveImages,
  useDetailImageStore,
  type DetailImageEntry,
} from '@/stores/useDetailImageStore';
import DetailEditPanel from './components/DetailEditPanel';
import PdpPreview from './components/PdpPreview';
import { Card, CardDesc, CardTitle } from './components/ui';

const RECOMMENDED_PROMPTS = ['더 고급스럽게 만들어줘', '상품 정보 더 자세하게', '이 정보 반영해줘'];

/**
 * DTL-01-01 상세 페이지 (Figma 256:3176) —
 * AI가 생성한 Shopee 상세페이지를 검수·수정하는 화면.
 * 좌측은 실제 업로드될 미리보기, 우측은 편집 패널 (독립 스크롤 구획).
 */
const DetailPage = () => {
  const params = useParams<{ productId: string; countryCode: string }>();
  const productId = Number(params.productId);
  const countryCode = params.countryCode ?? '';

  const { data: product } = useProduct(productId);
  const { data: detail } = useDetailContent(productId, countryCode);

  if (!product) return <LoadingText>상세 페이지를 불러오는 중…</LoadingText>;

  const country = product.countries.find((c) => c.code === countryCode);

  return (
    <ProductShell
      product={product}
      title="상세 페이지"
      backTo={buildPath.countryReport(productId, countryCode)}
      countryCode={countryCode}
      recommendedPrompts={RECOMMENDED_PROMPTS}
    >
      {detail && (
        <DetailBody
          productId={productId}
          countryCode={countryCode}
          countryName={country?.name ?? countryCode}
          content={detail.content}
          seller={detail.seller}
          initialImages={detail.productImages}
          initialDetailImages={detail.detailImages}
        />
      )}
    </ProductShell>
  );
};

interface DetailBodyProps {
  productId: number;
  countryCode: string;
  countryName: string;
  content: { ko: PdpContent; local: PdpContent };
  seller: PdpSeller;
  initialImages: ProductImageItem[];
  initialDetailImages: DetailImageItem[];
}

/** 목 기본 목록 + 스토어 변경분(업로드·AI 생성·재생성·삭제)을 합쳐 노출 목록을 만든다 */
const useResolvedImages = (base: DetailImageEntry[], key: string) => {
  const added = useDetailImageStore((state) => state.addedByKey[key]);
  const replaced = useDetailImageStore((state) => state.replacedByKey[key]);
  const removed = useDetailImageStore((state) => state.removedByKey[key]);
  return useMemo(
    () => resolveImages(base, { added, replaced, removed }),
    [base, added, replaced, removed],
  );
};

const DetailBody = ({
  productId,
  countryCode,
  countryName,
  content,
  seller,
  initialImages,
  initialDetailImages,
}: DetailBodyProps) => {
  const navigate = useNavigate();

  const productImageKey = detailImageKey(productId, countryCode, 'product');
  const detailImageStoreKey = detailImageKey(productId, countryCode, 'detail');
  const addImage = useDetailImageStore((state) => state.addImage);
  const removeImage = useDetailImageStore((state) => state.removeImage);

  const images = useResolvedImages(initialImages, productImageKey);
  const detailImages = useResolvedImages(initialDetailImages, detailImageStoreKey);

  // 언어 전환 — 디폴트 한국어(검수용), 현지 언어는 영어 텍스트 목
  const [language, setLanguage] = useState<'ko' | 'local'>('ko');

  // 텍스트 수정 결과 (한국어 검수본에 반영, 저장 시 미리보기 즉시 갱신)
  const [editedName, setEditedName] = useState(content.ko.name);
  const [editedDesc, setEditedDesc] = useState(content.ko.description);

  // 상품 대표 이미지 — 삭제로 사라졌으면 첫 이미지로 자동 승격
  const [mainImageDraft, setMainImageDraft] = useState(initialImages[0]?.id ?? '');
  const mainImageId = images.some((image) => image.id === mainImageDraft)
    ? mainImageDraft
    : (images[0]?.id ?? '');

  const previewContent: PdpContent =
    language === 'ko'
      ? { ...content.ko, name: editedName, description: editedDesc }
      : content.local;

  /** 마지막 1장은 삭제 불가 (대표 이미지는 항상 1장 존재) */
  const deleteImage = (id: string) => {
    if (images.length <= 1) return;
    removeImage(productImageKey, id);
  };

  const deleteDetailImage = (id: string) => {
    if (detailImages.length <= 1) return;
    removeImage(detailImageStoreKey, id);
  };

  const uploadImage = (target: DetailImageTarget, file: File) => {
    const isProduct = target === 'product';
    const key = isProduct ? productImageKey : detailImageStoreKey;
    const nextIndex = (isProduct ? images.length : detailImages.length) + 1;
    addImage(key, {
      id: `upload-${target}-${Date.now()}`,
      label: isProduct ? `업로드 ${nextIndex}` : `상세 이미지 ${nextIndex}`,
      src: URL.createObjectURL(file),
    });
  };

  /** AI 생성 화면으로 이동 — imageId가 있으면 재생성(확인 모달) 흐름 */
  const goGenerate = (target: DetailImageTarget, imageId?: string) => {
    const query = new URLSearchParams({ target });
    if (imageId) query.set('imageId', imageId);
    navigate(`${buildPath.detailImage(productId, countryCode)}?${query.toString()}`);
  };

  return (
    <Columns>
      <PreviewColumn>
        <HeadRow>
          <div>
            <PageTitle>Shopee {countryName} 상세 페이지</PageTitle>
            <Notice>한국어로 검토할 수 있으며, 실제 Shopee 업로드는 현지 언어로 진행됩니다.</Notice>
          </div>
          <LangToggle role="group" aria-label="언어 전환">
            <LangButton type="button" $active={language === 'ko'} onClick={() => setLanguage('ko')}>
              한국어 보기
            </LangButton>
            <LangButton
              type="button"
              $active={language === 'local'}
              onClick={() => setLanguage('local')}
            >
              현지 언어 보기
            </LangButton>
          </LangToggle>
        </HeadRow>

        <PdpPreview
          content={previewContent}
          seller={seller}
          images={images}
          mainImageId={mainImageId}
          detailImages={detailImages}
          countryName={countryName}
        />

        {/* Shopee 연동 섹션 (F-07) — 이 국가의 연동 정보만 표시 */}
        <Card id="section-connect" aria-labelledby="connect-title">
          <CardTitle id="connect-title">Shopee 연동</CardTitle>
          <CardDesc>
            {countryName} Shopee 스토어가 아직 연동되지 않았습니다. 스토어를 연동하면 검수한 상세
            페이지를 현지 언어로 바로 업로드할 수 있습니다.
          </CardDesc>
          <Button
            variant="secondary"
            onClick={() =>
              // TODO: 마켓/설정 화면 개발 시 마켓플레이스 탭 딥링크로 연동 상태 연결
              navigate(`${PATH.SETTINGS}?tab=marketplace`)
            }
          >
            스토어 연동하기
          </Button>
        </Card>
      </PreviewColumn>

      <DetailEditPanel
        name={editedName}
        description={editedDesc}
        onSaveText={(name, description) => {
          setEditedName(name);
          setEditedDesc(description);
        }}
        images={images}
        mainImageId={mainImageId}
        onSetMainImage={setMainImageDraft}
        onDeleteImage={deleteImage}
        onUploadImage={(file) => uploadImage('product', file)}
        onGenerateImage={() => goGenerate('product')}
        onRegenerateImage={(id) => goGenerate('product', id)}
        detailImages={detailImages}
        onDeleteDetailImage={deleteDetailImage}
        onUploadDetailImage={(file) => uploadImage('detail', file)}
        onGenerateDetailImage={() => goGenerate('detail')}
        onRegenerateDetailImage={(id) => goGenerate('detail', id)}
      />
    </Columns>
  );
};

/* 미리보기 + 편집 패널 2단. 사이드바·AI 패널까지 겹치면 폭이 부족해 좁은 화면에서는 세로로 쌓는다 */
const Columns = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: flex-start;

  @media (max-width: 1439px) {
    flex-direction: column;
  }
`;

const PreviewColumn = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const HeadRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const PageTitle = styled.h2`
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Notice = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xxs};
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const LangToggle = styled.div`
  display: inline-flex;
  padding: 2px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgLight};
`;

const LangButton = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.xxs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radius.sm};
  ${({ theme }) => theme.typography.captionStrong};
  background: ${({ theme, $active }) => ($active ? theme.colors.surface : 'transparent')};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textSecondary)};
  box-shadow: ${({ $active }) => ($active ? '0 1px 2px rgba(0, 0, 0, 0.08)' : 'none')};
`;

const LoadingText = styled.p`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default DetailPage;
