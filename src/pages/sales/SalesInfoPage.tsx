import { useState } from 'react';
import styled from '@emotion/styled';
import { useParams } from 'react-router-dom';
import ProductShell from '@/components/layout/ProductShell';
import { useProduct } from '@/hooks/useProducts';
import { useSalesInfo } from '@/hooks/useSales';
import { shippingMethodsMock, type ShippingMethodId } from '@/mocks/sales';
import { buildPath } from '@/routes/paths';
import { useDemoProgressStore } from '@/stores/useDemoProgressStore';
import OptionStockSection from './components/OptionStockSection';
import PriceSection from './components/PriceSection';
import SectionTabs from './components/SectionTabs';
import ShippingSection from './components/ShippingSection';

const RECOMMENDED_PROMPTS = [
  '추천 가격 근거 알려줘',
  '옵션 구성 추천해줘',
  '재고는 얼마나 준비할까?',
];

const AI_RECOMMENDED_METHOD: ShippingMethodId =
  shippingMethodsMock.find((m) => m.aiRecommended)?.id ?? 'direct';

/**
 * SEL-01-01 판매 정보 입력 (Figma 256:4102) —
 * 분석 결과를 실제 판매 조건(판매가·옵션·재고·배송)으로 확정하는 화면.
 * 여기서 확정한 값이 상세페이지 생성과 Shopee 업로드의 입력이 된다.
 */
const SalesInfoPage = () => {
  const params = useParams<{ productId: string; countryCode: string }>();
  const productId = Number(params.productId);
  const countryCode = params.countryCode ?? '';

  const { data: product } = useProduct(productId);
  const { data: salesInfo } = useSalesInfo(productId, countryCode);

  // 배송 방식 — AI 추천 기본 선택. 변경 시 판매가 섹션 수익 지표 재계산
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId>(AI_RECOMMENDED_METHOD);

  /**
   * [DEMO-ONLY] 재고 또는 포장 정보를 저장하면 판매 정보가 확정된 것으로 보고, 상세 페이지 생성을 연다.
   * 백엔드 연동 시: 저장 API 성공 응답으로 상품 상태가 갱신되므로 이 콜백과 onSaved prop을 삭제한다.
   */
  const markSalesInfoSaved = useDemoProgressStore((s) => s.markSalesInfoSaved);
  const handleSaved = () => markSalesInfoSaved(productId, countryCode);

  if (!product) return <LoadingText>판매 정보를 불러오는 중…</LoadingText>;

  const methods = salesInfo?.shippingMethods ?? shippingMethodsMock;
  const shippingCostKrw = methods.find((m) => m.id === shippingMethod)?.costKrw ?? 0;

  return (
    <ProductShell
      product={product}
      title="판매 정보"
      backTo={buildPath.countryReport(productId, countryCode)}
      countryCode={countryCode}
      recommendedPrompts={RECOMMENDED_PROMPTS}
    >
      <PageTitle>판매 정보 입력</PageTitle>
      <SectionTabs
        tabs={[
          { label: '판매가', targetId: 'section-price' },
          { label: '옵션·재고', targetId: 'section-options' },
          { label: '배송', targetId: 'section-shipping' },
        ]}
      />

      {salesInfo && (
        <PriceSection
          costPrice={product.costPrice}
          shippingCostKrw={shippingCostKrw}
          scenarios={salesInfo.priceScenarios}
        />
      )}

      <OptionStockSection onSaved={handleSaved} />

      <ShippingSection
        methods={methods}
        value={shippingMethod}
        onChange={setShippingMethod}
        onSaved={handleSaved}
      />
    </ProductShell>
  );
};

/** 페이지 섹션 타이틀 (Figma 298:6352) — Title/02 18px */
const PageTitle = styled.h2`
  padding: ${({ theme }) => `0 ${theme.spacing.xs}`};
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const LoadingText = styled.p`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default SalesInfoPage;
