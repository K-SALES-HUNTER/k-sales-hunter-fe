import styled from '@emotion/styled';
import Button from '@/components/common/Button';
import InputSet from '@/components/common/InputSet';
import type { StockRow } from '@/mocks/sales';
import { Card, CardDesc, CardTitle, EmptyText } from './ui';

interface StockManageSectionProps {
  rows: StockRow[];
  /** 판매 중단 상태 — 재고량 추가 등 판매 중 전용 조작 비활성 */
  disabled?: boolean;
  onAddStock: () => void;
  onEditOptions: () => void;
}

/**
 * 재고 관리 (OPS-01-01 #10~13) — 옵션 조합별 남은 재고 읽기 전용 표시.
 * 수정은 '재고량 추가'(증분)로만 가능하다.
 */
const StockManageSection = ({
  rows,
  disabled = false,
  onAddStock,
  onEditOptions,
}: StockManageSectionProps) => {
  return (
    <Card id="section-stock" aria-labelledby="stock-title">
      <div>
        <CardTitle id="stock-title">재고 관리</CardTitle>
        <CardDesc>
          주문이 들어올 때마다 재고가 자동 차감됩니다. 재고 수정은 재고량 추가로만 가능합니다.
        </CardDesc>
      </div>

      {/* 옵션 조합이 없으면 단일 재고로 안내 (OPS-01-01 #10) */}
      {rows.length === 0 && (
        <EmptyText>등록된 옵션 조합이 없습니다. 단일 재고로 관리됩니다.</EmptyText>
      )}

      {rows.length > 0 && (
        <HeaderRow>
          <span>1단 속성</span>
          <span>2단 속성</span>
          <span>수량</span>
        </HeaderRow>
      )}
      {rows.map((row) => (
        <StockRowBox key={`${row.option1}-${row.option2}`}>
          <InputSet aria-label="1단 속성" value={row.option1} readOnly disabled />
          <InputSet aria-label="2단 속성" value={row.option2} readOnly disabled />
          <QtyCell>
            <InputSet aria-label="수량" unit="개" value={String(row.qty)} readOnly disabled />
            {row.qty === 0 && <SoldOutBadge>품절</SoldOutBadge>}
          </QtyCell>
        </StockRowBox>
      ))}

      <Button fullWidth disabled={disabled} onClick={onAddStock}>
        재고량 추가
      </Button>
      <Button variant="secondary" fullWidth disabled={disabled} onClick={onEditOptions}>
        판매 옵션 수정
      </Button>
    </Card>
  );
};

const HeaderRow = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};

  span {
    ${({ theme }) => theme.typography.tableHeader};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const StockRowBox = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const QtyCell = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const SoldOutBadge = styled.span`
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.errorLight};
  ${({ theme }) => theme.typography.captionStrong};
  color: ${({ theme }) => theme.colors.error};
`;

export default StockManageSection;
