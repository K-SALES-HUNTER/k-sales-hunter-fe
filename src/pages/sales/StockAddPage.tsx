import { useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate, useParams } from 'react-router-dom';
import arrowRightIcon from '@/assets/icons/arrow-right.svg';
import Button from '@/components/common/Button';
import InputSet from '@/components/common/InputSet';
import { stockRowsMock } from '@/mocks/sales';
import { useSalesOpsStore } from '@/stores/useSalesOpsStore';

/**
 * OPS-02-01 재고량 추가 (Figma 607:10281) —
 * 현재 재고에 더할 수량만 입력하는 단독 화면 (사이드바 없음, 중앙 정렬).
 * 절대값 덮어쓰기가 아닌 증분 방식이라 저장 사이 주문이 들어와도 재고가 어긋나지 않는다.
 */
const StockAddPage = () => {
  const params = useParams<{ productId: string }>();
  const productId = Number(params.productId);
  const navigate = useNavigate();

  const stockRows =
    useSalesOpsStore((s) => s.stockByProduct[String(productId)]) ?? stockRowsMock;
  const addStock = useSalesOpsStore((s) => s.addStock);

  // 추가 수량 — 음수 불가 (숫자 외 입력 제거)
  const [additions, setAdditions] = useState<string[]>(() => stockRows.map(() => ''));

  const setAddition = (index: number, raw: string) =>
    setAdditions((prev) =>
      prev.map((v, i) => (i === index ? raw.replace(/[^0-9]/g, '') : v)),
    );

  // 반영하기 — 추가 수량 1개 이상 입력 시 활성
  const hasAddition = additions.some((v) => (Number(v) || 0) > 0);

  const apply = () => {
    addStock(
      productId,
      additions.map((v) => Number(v) || 0),
    );
    navigate(-1); // 직전 판매 관리 화면으로 복귀
  };

  return (
    <Screen>
      <BackHeader>
        <BackButton type="button" aria-label="뒤로가기" onClick={() => navigate(-1)}>
          <BackIcon src={arrowRightIcon} alt="" />
        </BackButton>
        <HeaderTitle>재고량 추가</HeaderTitle>
      </BackHeader>

      <Center>
        <Guide>추가할 재고량을 입력해주세요.</Guide>

        <RowGroup>
          <ColumnHeader>
            <span>1단 속성</span>
            <span>2단 속성</span>
            <span>현재 재고량</span>
            <span>추가 수량</span>
          </ColumnHeader>

          {stockRows.map((row, index) => (
            <Row key={`${row.option1}-${row.option2}`}>
              {/* 앞 3열은 항상 읽기 전용 — 수정은 추가 수량으로만 (OPS-02-01 #3) */}
              <InputSet aria-label="1단 속성" value={row.option1} readOnly disabled />
              <InputSet aria-label="2단 속성" value={row.option2} readOnly disabled />
              <InputSet
                aria-label="현재 재고량"
                unit="개"
                value={String(row.qty)}
                readOnly
                disabled
              />
              <InputSet
                aria-label={`${row.option1} ${row.option2} 추가 수량`}
                unit="개"
                inputMode="numeric"
                placeholder="0"
                value={additions[index] ?? ''}
                onChange={(e) => setAddition(index, e.target.value)}
              />
            </Row>
          ))}
        </RowGroup>

        {/* 전 행 0이면 반영 불가 — 이유를 문구로 안내 (OPS-02-01 #4) */}
        {!hasAddition && <Hint>추가할 수량을 입력해 주세요.</Hint>}

        <Button fullWidth disabled={!hasAddition} onClick={apply}>
          반영하기
        </Button>
      </Center>
    </Screen>
  );
};

const Screen = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background};
`;

const BackHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  height: 64px;
  flex-shrink: 0;
  padding: ${({ theme }) => `0 ${theme.spacing.lg}`};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radius.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.bgLight};
  }
`;

const BackIcon = styled.img`
  width: 8px;
  transform: rotate(180deg);
`;

const HeaderTitle = styled.h1`
  ${({ theme }) => theme.typography.heading03};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

/** Figma 607:10284 — 콘텐츠 폭 704px 중앙 정렬, 블록 간격 32 */
const Center = styled.main`
  flex: 1;
  width: 100%;
  max-width: 752px;
  margin: 0 auto;
  padding: ${({ theme }) => `${theme.spacing.xxxl} ${theme.spacing.lg}`};
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Guide = styled.h2`
  ${({ theme }) => theme.typography.heading02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const RowGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ColumnHeader = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};

  span {
    ${({ theme }) => theme.typography.label02};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  align-items: flex-end;
`;

const Hint = styled.p`
  margin-top: -${({ theme }) => theme.spacing.md};
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default StockAddPage;
