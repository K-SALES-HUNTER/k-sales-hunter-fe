import { useState } from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { useProductForm, type ProductFormValues } from '@/hooks/useProductForm';
import { useProduct } from '@/hooks/useProducts';
import { PATH } from '@/routes/paths';
import type { Product } from '@/types/product';
import FormPageHeader from './components/FormPageHeader';
import ProductForm from './components/ProductForm';
import * as S from './components/formPage.styled';

/** '수정한 정보 반영 중' 목 로딩 시간 (LOADING 335:5065) */
const APPLY_DELAY_MS = 1500;

interface FieldChange {
  label: string;
  before: string;
  after: string;
}

const toFormValues = (product: Product): ProductFormValues => ({
  name: product.name,
  category: product.category,
  costPrice: String(product.costPrice),
  weight: String(product.weight),
  description: product.description,
  sellingPoints: product.sellingPoints,
  mainTarget: product.mainTarget,
});

/** 상품 정보 수정 (EDT-01-01, Figma 608:10505 · 608:10535) */
const ProductEditPage = () => {
  const { productId } = useParams();
  const { data: product } = useProduct(Number(productId));

  // 저장된 값이 채워진 상태로 폼을 시작해야 하므로 조회 완료 후 마운트
  if (!product) {
    return (
      <FormPageHeader
        title="상품 수정"
        backTo={PATH.PRODUCTS}
        actionLabel="저장"
        actionDisabled
        onAction={() => {}}
      />
    );
  }
  return <ProductEditView product={product} />;
};

const ProductEditView = ({ product }: { product: Product }) => {
  const navigate = useNavigate();
  const form = useProductForm({
    values: toFormValues(product),
    imageUrls: product.images,
  });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [applying, setApplying] = useState(false);
  const [changes, setChanges] = useState<FieldChange[] | null>(null);

  /** 저장 시점 값과 원본 비교 — 이전 → 이후 변경 내역 (모달 335:5001) */
  const collectChanges = (): FieldChange[] => {
    const initial = toFormValues(product);
    const labels: Array<[keyof ProductFormValues, string, (v: string) => string]> = [
      ['name', '상품명', (v) => v],
      ['category', '카테고리', (v) => v],
      ['costPrice', '공급 원가', (v) => `${Number(v || 0).toLocaleString()}원`],
      ['weight', '무게', (v) => `${Number(v || 0).toLocaleString()}g`],
      ['description', '상품 설명', (v) => v],
      ['sellingPoints', '셀링 포인트', (v) => v],
      ['mainTarget', '메인 타겟', (v) => v],
    ];

    const result: FieldChange[] = labels
      .filter(([field]) => form.values[field].trim() !== initial[field].trim())
      .map(([field, label, format]) => ({
        label,
        before: format(initial[field]),
        after: format(form.values[field]),
      }));

    const currentUrls = form.images.map((image) => image.url);
    const imagesChanged =
      currentUrls.length !== product.images.length ||
      currentUrls.some((url, index) => url !== product.images[index]);
    if (imagesChanged) {
      result.push({
        label: '상품 이미지',
        before: `${product.images.length}장`,
        after: `${currentUrls.length}장`,
      });
    }
    return result;
  };

  const handleConfirmSave = () => {
    setConfirmOpen(false);
    setApplying(true);
    // 오케스트레이터 부분 재호출(R-000-05) 목 — 닫기 불가 로딩 후 변경 내역 판정
    setTimeout(() => {
      setApplying(false);
      setChanges(collectChanges());
    }, APPLY_DELAY_MS);
  };

  /** 빈 항목이 있으면 '자동 채우기', 모두 채워지면 '저장' (Figma navibutton) */
  const isFillMode = form.hasEmptyField;
  const actionDisabled = isFillMode
    ? !form.canRunAiFill
    : !form.requiredFilled || form.imagesUploading;

  return (
    <>
      <FormPageHeader
        title="상품 수정"
        backTo={PATH.PRODUCTS}
        hint={
          form.aiFillDone
            ? '입력하지 않은 항목을 AI가 알아서 채웠어요!'
            : '입력하지 않은 항목은 AI가 알아서 채울게요!'
        }
        actionLabel={isFillMode ? '자동 채우기' : '저장'}
        actionLoading={form.aiLoading}
        actionDisabled={actionDisabled}
        onAction={() => {
          if (isFillMode) {
            void form.runAiFill();
            return;
          }
          setConfirmOpen(true);
        }}
      />

      <S.Content>
        <ProductForm form={form} />
      </S.Content>

      {/* 모달 335:4979 수정 확인 */}
      <Modal
        open={confirmOpen}
        title="정말 수정하시겠어요?"
        description="수정 시, 분석 결과가 일부 변경될 수 있습니다."
        onClose={() => setConfirmOpen(false)}
        footer={
          <>
            <Button variant="primary" onClick={handleConfirmSave}>
              확인
            </Button>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              취소
            </Button>
          </>
        }
      />

      {/* 반영 중 로딩 (LOADING 335:5065) — 사용자가 닫을 수 없음 */}
      {applying && (
        <ApplyOverlay role="alert" aria-busy>
          <ApplyText>수정한 정보 반영 중</ApplyText>
          <ApplySpinner aria-hidden />
        </ApplyOverlay>
      )}

      {/* 모달 335:5001 변경 내역 / 335:5070 변경 없음 → 확인 시 진입 직전 화면 복귀 */}
      {changes !== null &&
        (changes.length > 0 ? (
          <Modal
            open
            title="아래 데이터가 변경되었습니다."
            footer={
              <Button variant="primary" fullWidth onClick={() => navigate(-1)}>
                확인
              </Button>
            }
          >
            <ChangeList>
              {changes.map((change) => (
                <ChangeItem key={change.label}>
                  {change.label} {change.before} → {change.after}
                </ChangeItem>
              ))}
            </ChangeList>
          </Modal>
        ) : (
          <Modal
            open
            title="수정이 완료되었습니다."
            description="변경된 데이터가 존재하지 않습니다."
            footer={
              <Button variant="primary" fullWidth onClick={() => navigate(-1)}>
                확인
              </Button>
            }
          />
        ))}
    </>
  );
};

const ApplyOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 95;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) =>
    `color-mix(in srgb, ${theme.colors.textPrimary} 70%, transparent)`};
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const ApplyText = styled.p`
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme }) => theme.colors.textOnPrimary};
`;

const ApplySpinner = styled.span`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 4px solid transparent;
  border-top-color: ${({ theme }) => theme.colors.textOnPrimary};
  border-right-color: ${({ theme }) => theme.colors.textOnPrimary};
  animation: ${spin} 0.8s linear infinite;
`;

/** 변경 내역 불릿 목록 (Figma 335:5001 — '이전 데이터 → 이후 데이터') */
const ChangeList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.xs};
  padding-left: ${({ theme }) => theme.spacing.lg};
  text-align: left;
`;

const ChangeItem = styled.li`
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textPrimary};
  list-style: disc;
  word-break: break-all;
`;

export default ProductEditPage;
