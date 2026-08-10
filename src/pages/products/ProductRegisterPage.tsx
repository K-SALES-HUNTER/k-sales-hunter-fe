import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AiLoadingOverlay from '@/components/common/AiLoadingOverlay';
import { useProductForm } from '@/hooks/useProductForm';
import { buildPath, PATH } from '@/routes/paths';
import FormPageHeader from './components/FormPageHeader';
import ProductForm from './components/ProductForm';
import * as S from './components/formPage.styled';

/** TODO: 등록 API 응답의 productId로 교체 — 현재는 목 상품 1번 보고서로 이동 */
const REGISTERED_PRODUCT_ID = 1;

/** 상품 등록 (PRD-01-01, Figma 224:4210 · 526:6580) */
const ProductRegisterPage = () => {
  const navigate = useNavigate();
  const form = useProductForm();
  const [analysisOpen, setAnalysisOpen] = useState(false);

  /**
   * 우측 상단 버튼은 항상 1개 (Figma navibutton).
   * 빈 항목이 있으면 '자동 채우기', 모두 채워지면 '등록'.
   */
  const isFillMode = form.hasEmptyField;
  const actionDisabled = isFillMode
    ? !form.canRunAiFill
    : !form.requiredFilled || form.imagesUploading;

  return (
    <>
      <FormPageHeader
        title="상품 등록"
        backTo={PATH.PRODUCTS}
        hint={
          form.aiFillDone
            ? '입력하지 않은 항목을 AI가 알아서 채웠어요!'
            : '입력하지 않은 항목은 AI가 알아서 채울게요!'
        }
        actionLabel={isFillMode ? '자동 채우기' : '등록'}
        actionLoading={form.aiLoading}
        actionDisabled={actionDisabled}
        onAction={() => {
          if (isFillMode) {
            void form.runAiFill();
            return;
          }
          setAnalysisOpen(true);
        }}
      />

      <S.Content>
        <ProductForm form={form} />
      </S.Content>

      {/* 등록 → 국가별 분석 파이프라인 로딩 (SYS-01-01) → 전체 분석 보고서 이동 */}
      <AiLoadingOverlay
        open={analysisOpen}
        screenName="상품 등록"
        onComplete={() =>
          navigate(buildPath.totalReport(REGISTERED_PRODUCT_ID), { replace: true })
        }
        onCancel={() => setAnalysisOpen(false)}
      />
    </>
  );
};

export default ProductRegisterPage;
