import { useState } from 'react';
import styled from '@emotion/styled';
import Button from '@/components/common/Button';
import InputSet from '@/components/common/InputSet';
import { SALES_STEP_DELAY_MS } from '@/apis/sales';
import type { PriceHistoryRow, PriceImpactRow } from '@/mocks/sales';
import { Card, CardDesc, CardTitle, NoticeBox, SubTitle, Table, TableScroll } from './ui';

interface PriceManageSectionProps {
  currentPrice: number;
  /** 헤더 우측 뱃지 문구의 근거 (툴팁 성격 안내) */
  fxNote: string;
  /** 가격 판단 근거 한 줄 */
  note?: string;
  impacts: readonly PriceImpactRow[];
  history: readonly PriceHistoryRow[];
  /** 판매 중단 상태 — 가격 변경 비활성 */
  disabled?: boolean;
}

/**
 * 가격 관리 (OPS-01-01 기타) — 현재가·실시간 환율, 가격별 예상 영향, 변경 기록.
 */
const PriceManageSection = ({
  currentPrice,
  fxNote,
  note,
  impacts,
  history,
  disabled = false,
}: PriceManageSectionProps) => {
  const [priceRaw, setPriceRaw] = useState(String(currentPrice));
  const [applying, setApplying] = useState(false);

  const price = Number(priceRaw.replace(/[^0-9]/g, '')) || 0;

  const apply = () => {
    setApplying(true);
    // 목 — 가격 변경 반영 흉내 (Shopee Open API 갱신)
    setTimeout(() => setApplying(false), SALES_STEP_DELAY_MS);
  };

  return (
    <Card id="section-price-manage" aria-labelledby="price-manage-title">
      <div>
        <HeaderRow>
          <CardTitle id="price-manage-title">가격 관리</CardTitle>
          {/* 환율은 1시간 캐싱된 실시간 값 (R-002-04) */}
          <FxBadge title={fxNote}>실시간 환율 적용</FxBadge>
        </HeaderRow>
        <CardDesc>{fxNote}</CardDesc>
      </div>

      {note && <NoticeBox>{note}</NoticeBox>}

      <PriceRow>
        <InputSet
          label="가격 변경"
          unit="원"
          inputMode="numeric"
          disabled={disabled}
          value={price > 0 ? price.toLocaleString() : ''}
          onChange={(e) => setPriceRaw(e.target.value.replace(/[^0-9]/g, ''))}
        />
        <ApplyButtonBox>
          <Button loading={applying} disabled={disabled || price === 0} onClick={apply}>
            적용
          </Button>
        </ApplyButtonBox>
      </PriceRow>

      <div>
        <SubTitle>가격별 예상 영향</SubTitle>
        <TableScroll>
          <Table>
            <thead>
              <tr>
                <th scope="col">가격</th>
                <th scope="col">예상 마진율</th>
                <th scope="col">판매 영향 예측</th>
                <th scope="col">판단</th>
              </tr>
            </thead>
            <tbody>
              {impacts.map((row) => (
                <tr key={row.price}>
                  <td>{row.price}</td>
                  <td>{row.margin}</td>
                  <td>{row.impact}</td>
                  <td>
                    <VerdictChip $verdict={row.verdict}>{row.verdict}</VerdictChip>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableScroll>
      </div>

      <div>
        <SubTitle>가격 변경 기록</SubTitle>
        <TableScroll>
          <Table>
            <thead>
              <tr>
                <th scope="col">날짜</th>
                <th scope="col">변경 전</th>
                <th scope="col">변경 후</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row) => (
                <tr key={row.date}>
                  <td>{row.date}</td>
                  <td>{row.before}</td>
                  <td>{row.after}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableScroll>
      </div>
    </Card>
  );
};

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

/** 실시간 환율 적용 뱃지 (Figma 597:9774) */
const FxBadge = styled.span`
  padding: ${({ theme }) => `2px ${theme.spacing.xs}`};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.bgLight};
  ${({ theme }) => theme.typography.captionStrong};
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: nowrap;
`;

const PriceRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: flex-end;

  > :first-of-type {
    flex: 1;
  }
`;

const ApplyButtonBox = styled.div`
  padding-bottom: 1px;
`;

const VerdictChip = styled.span<{ $verdict: PriceImpactRow['verdict'] }>`
  display: inline-flex;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  ${({ theme }) => theme.typography.captionStrong};
  ${({ theme, $verdict }) => {
    switch ($verdict) {
      case '추천':
        return `background: ${theme.colors.successLight}; color: ${theme.colors.success};`;
      case '신중':
        return `background: ${theme.colors.errorLight}; color: ${theme.colors.error};`;
      default:
        return `background: ${theme.colors.primaryLight}; color: ${theme.colors.primary};`;
    }
  }}
`;

export default PriceManageSection;
