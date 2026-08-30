import { useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/common/Button';
import CtaChevron from '@/components/common/CtaChevron';
import Modal from '@/components/common/Modal';
import ProductShell from '@/components/layout/ProductShell';
import { useProduct } from '@/hooks/useProducts';
import { useDetailContent } from '@/hooks/useSales';
import { useConnectedStores } from '@/hooks/useSettings';
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
import { useDemoProgressStore } from '@/stores/useDemoProgressStore';
import type { ConnectedStore } from '@/types/settings';
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
  const { data: stores, isPending: storesLoading } = useConnectedStores();
  const markUploaded = useDemoProgressStore((s) => s.markUploaded);
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);

  if (!product) return <LoadingText>상세 페이지를 불러오는 중…</LoadingText>;

  const country = product.countries.find((c) => c.code === countryCode);
  const countryName = country?.name ?? countryCode;
  const store = stores?.find((s) => s.countryCode === countryCode);
  const uploaded = Boolean(country && country.salesStatus !== '판매전');

  /**
   * [DEMO-ONLY] 오토 업로드 (Figma 12:14200 헤더 우측) —
   * 공모전 제출 범위에서 실제 Shopee Open API 연동은 제외한다 (2026-08-15 회의 결정).
   * 백엔드 연동 시: setTimeout을 업로드 API 호출로 바꾸고 markUploaded 대신 응답 상태를 쓴다.
   */
  const uploadToShopee = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      markUploaded(productId, countryCode);
      setUploadDone(true);
    }, 1600);
  };

  /**
   * 업로드 후에는 판매 관리로, 연동 전이면 설정으로 — 그 외에는 오토 업로드.
   * QA-8: 연동 정보 로딩 중(stores === undefined)에는 미연동으로 단정하지 않고
   * '오토 업로드'를 로딩 상태로 보류한다. (재진입 시 쿼리 refetch 동안 '스토어 연동하기' 오표시 방지)
   */
  const headerAction = uploaded ? (
    <Button
      variant="secondary"
      onClick={() => navigate(buildPath.salesOps(productId, countryCode))}
    >
      판매 관리로 이동
    </Button>
  ) : storesLoading ? (
    <Button variant="primary" loading icon={<CtaChevron />}>
      오토 업로드
    </Button>
  ) : !store ? (
    <Button variant="secondary" onClick={() => navigate(`${PATH.SETTINGS}?tab=marketplace`)}>
      스토어 연동하기
    </Button>
  ) : (
    /* QA-7: 헤더 CTA는 텍스트 우측 chevron (Figma 헤더 CTA 공통) */
    <Button variant="primary" loading={uploading} icon={<CtaChevron />} onClick={uploadToShopee}>
      오토 업로드
    </Button>
  );

  return (
    <ProductShell
      product={product}
      title={`${countryName} 보고서`}
      backTo={buildPath.countryReport(productId, countryCode)}
      countryCode={countryCode}
      recommendedPrompts={RECOMMENDED_PROMPTS}
      headerAction={headerAction}
    >
      {detail && (
        <DetailBody
          productId={productId}
          countryCode={countryCode}
          countryName={countryName}
          content={detail.content}
          seller={detail.seller}
          initialImages={detail.productImages}
          initialDetailImages={detail.detailImages}
          store={store}
          storeLoading={storesLoading}
        />
      )}

      {/* 업로드 성공 (F-07) — 확인 후 상단 '판매 관리' 탭이 열린다 */}
      <Modal
        open={uploadDone}
        title="Shopee에 업로드했습니다"
        description={`${countryName} Shopee에 상품이 등록되어 판매가 시작됐습니다. 이제 주문·재고·가격을 판매 관리 화면에서 관리할 수 있습니다.`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setUploadDone(false)}>
              상세 페이지에 머무르기
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setUploadDone(false);
                navigate(buildPath.salesOps(productId, countryCode));
              }}
            >
              판매 관리로 이동
            </Button>
          </>
        }
      />
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
  /** 이 국가의 연동 스토어 — 로딩 중에는 undefined와 구분하기 위해 storeLoading을 함께 본다 */
  store: ConnectedStore | undefined;
  storeLoading: boolean;
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
  store,
  storeLoading,
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
          language={language}
        />

        {/*
          Shopee 연동 정보 (F-07 · QA-6 복원) — 이 국가의 실제 연동 상태를 표시한다.
          QA-8과 같은 원칙: 연동 정보를 아직 모르는 로딩 동안에는 미연동으로 단정하지 않는다.
        */}
        <Card id="section-connect" aria-labelledby="connect-title">
          <CardTitle id="connect-title">Shopee 연동</CardTitle>
          {storeLoading ? (
            <CardDesc>연동 정보를 불러오는 중입니다…</CardDesc>
          ) : store ? (
            <>
              <CardDesc>
                {countryName} Shopee 스토어와 연동되어 있습니다. 검수한 상세 페이지를 현지 언어로
                바로 업로드할 수 있습니다.
              </CardDesc>
              <StoreRow>
                <ShopeeBadge aria-hidden>S</ShopeeBadge>
                <StoreMeta>
                  <StoreName>
                    {store.countryName} · {store.storeName}
                  </StoreName>
                  <StoreDate>연결일: {store.connectedAt}</StoreDate>
                </StoreMeta>
                <StoreState>연동 완료</StoreState>
              </StoreRow>
            </>
          ) : (
            <>
              <CardDesc>
                {countryName} Shopee 스토어가 아직 연동되지 않았습니다. 스토어를 연동하면 검수한
                상세 페이지를 현지 언어로 바로 업로드할 수 있습니다.
              </CardDesc>
              <Button
                variant="secondary"
                onClick={() => navigate(`${PATH.SETTINGS}?tab=marketplace`)}
              >
                스토어 연동하기
              </Button>
            </>
          )}
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

/* ─────────── Shopee 연동 카드 (QA-6) — 마켓/설정 연동 카드(Figma 12:15303)와 같은 성공 톤 ─────────── */

const StoreRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.successLight};
`;

/** Shopee 브랜드 배지 — 브랜드 고유색이라 theme 토큰 대신 Shopee 오렌지 그라데이션 사용 */
const ShopeeBadge = styled.div`
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

const StoreMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
  min-width: 0;
`;

const StoreName = styled.strong`
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.primary};
`;

const StoreDate = styled.span`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

/** '연동 완료' — 연동 완료 전용 그린 (Figma 12:15677) */
const StoreState = styled.span`
  margin-left: auto;
  flex-shrink: 0;
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.successVivid};
`;

export default DetailPage;
