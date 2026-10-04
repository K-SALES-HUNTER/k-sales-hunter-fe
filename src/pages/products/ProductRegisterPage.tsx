import { useCallback, useEffect, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  cancelAnalysis,
  completedStepsOf,
  fetchAnalysisStatus,
  isAnalysisFinished,
} from '@/apis/analysis';
import { USE_MOCK_API } from '@/apis/config';
import { pollUntil } from '@/apis/poll';
import { registerProduct } from '@/apis/productForm';
import AiLoadingOverlay from '@/components/common/AiLoadingOverlay';
import { useProductForm } from '@/hooks/useProductForm';
import { DEMO_PRODUCT_ID } from '@/mocks/products';
import { buildPath, PATH } from '@/routes/paths';
import { useDemoProgressStore } from '@/stores/useDemoProgressStore';
import FormPageHeader from './components/FormPageHeader';
import ProductForm from './components/ProductForm';
import * as S from './components/formPage.styled';

const toNumber = (raw: string) => Number(raw.replace(/[^0-9]/g, '')) || 0;

/** 상품 등록 (PRD-01-01, Figma 224:4210 · 526:6580) */
const ProductRegisterPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const form = useProductForm();
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const markRegistered = useDemoProgressStore((s) => s.markRegistered);

  /** 실연동: 등록 응답의 productId 와 서버 분석 진행 단계 */
  const [productId, setProductId] = useState<number | null>(null);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [errorText, setErrorText] = useState<string | null>(null);
  const pollAbortRef = useRef<AbortController | null>(null);

  useEffect(() => () => pollAbortRef.current?.abort(), []);

  /** 등록 → 분석 잡 폴링. 오버레이 단계는 서버 step 을 따른다 */
  const startRegister = async () => {
    setErrorText(null);
    setCompletedSteps(0);
    setAnalysisOpen(true);
    if (USE_MOCK_API) return;

    const controller = new AbortController();
    pollAbortRef.current = controller;
    try {
      const { values } = form;
      const { productId: id } = await registerProduct({
        name: values.name.trim(),
        category: values.category,
        costPrice: toNumber(values.costPrice),
        weight: toNumber(values.weight),
        description: values.description.trim(),
        sellingPoints: values.sellingPoints.trim(),
        mainTarget: values.mainTarget.trim(),
        imageUrls: form.uploadedImageUrls,
        aiFilledFields: [...form.aiFilledFields],
      });
      setProductId(id);
      const last = await pollUntil(() => fetchAnalysisStatus(id), {
        done: isAnalysisFinished,
        onTick: (status) => setCompletedSteps(completedStepsOf(status)),
        signal: controller.signal,
      });
      if (last.status !== 'COMPLETED') {
        setAnalysisOpen(false);
        setErrorText(
          last.status === 'CANCELLED'
            ? '분석을 중단했어요.'
            : `분석에 실패했어요. 잠시 후 다시 등록해 주세요. (${last.errorCode ?? '오류'})`,
        );
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setAnalysisOpen(false);
      setErrorText('등록 요청에 실패했어요. 서버 연결을 확인해 주세요.');
    }
  };

  const handleComplete = useCallback(() => {
    if (USE_MOCK_API) {
      // [DEMO-ONLY] 분석까지 끝나야 상품 목록·대시보드에 노출된다.
      markRegistered(DEMO_PRODUCT_ID);
      navigate(buildPath.totalReport(DEMO_PRODUCT_ID), { replace: true });
      return;
    }
    if (productId === null) return;
    void queryClient.invalidateQueries({ queryKey: ['products'] });
    navigate(buildPath.totalReport(productId), { replace: true });
  }, [markRegistered, navigate, productId, queryClient]);

  const handleCancel = () => {
    pollAbortRef.current?.abort();
    if (!USE_MOCK_API && productId !== null) void cancelAnalysis(productId);
    setAnalysisOpen(false);
  };

  /**
   * 우측 상단 버튼은 항상 1개 (Figma navibutton).
   * 빈 항목이 있으면 '자동 채우기', 모두 채워지면 '등록'.
   */
  const isFillMode = form.hasEmptyField;
  const actionDisabled = isFillMode
    ? !form.canRunAiFill
    : !form.requiredFilled || form.imagesUploading;

  const hint =
    errorText ??
    (form.aiFillDone
      ? '입력하지 않은 항목을 AI가 알아서 채웠어요!'
      : '입력하지 않은 항목은 AI가 알아서 채울게요!');

  return (
    <>
      <FormPageHeader
        title="상품 등록"
        backTo={PATH.PRODUCTS}
        hint={hint}
        actionLabel={isFillMode ? '자동 채우기' : '등록'}
        actionLoading={form.aiLoading}
        actionDisabled={actionDisabled}
        onAction={() => {
          if (isFillMode) {
            void form.runAiFill();
            return;
          }
          void startRegister();
        }}
      />

      <S.Content>
        <ProductForm form={form} />
      </S.Content>

      {/* 등록 → 국가별 분석 파이프라인 로딩 (SYS-01-01) → 전체 분석 보고서 이동 */}
      <AiLoadingOverlay
        open={analysisOpen}
        screenName="상품 등록"
        completedSteps={USE_MOCK_API ? undefined : completedSteps}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </>
  );
};

export default ProductRegisterPage;
