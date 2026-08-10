import { useState } from 'react';
import styled from '@emotion/styled';
import Dropdown from '@/components/common/Dropdown';
import {
  orderClaimStatusOptions,
  orderShippingStatusOptions,
  type OrderRow,
} from '@/mocks/sales';
import {
  Card,
  CardDesc,
  CardTitle,
  EmptyText,
  StatBox,
  StatGrid,
  StatLabel,
  StatValue,
  Table,
  TableScroll,
} from './ui';

interface OrderClaimSectionProps {
  summary: { newOrders: number; claims: number; needAction: number };
  rows: OrderRow[];
  /** 판매 중단 상태 — 상태 기록 조작 비활성 */
  disabled?: boolean;
}

const toOptions = (values: readonly string[]) => values.map((v) => ({ value: v, label: v }));

/**
 * 주문·클레임 현황 (OPS-01-01 #8) — K-세일즈헌터는 배송 대행이 아니므로
 * 주문·클레임 확인과 배송 처리 상태 기록만 지원한다.
 */
const OrderClaimSection = ({ summary, rows, disabled = false }: OrderClaimSectionProps) => {
  const [shippingStatus, setShippingStatus] = useState<Record<string, string>>(() =>
    Object.fromEntries(rows.map((row) => [row.id, row.shippingStatus])),
  );
  const [claimStatus, setClaimStatus] = useState<Record<string, string>>(() =>
    Object.fromEntries(rows.map((row) => [row.id, row.claimStatus])),
  );

  return (
    <Card id="section-orders" aria-labelledby="orders-title">
      <div>
        <CardTitle id="orders-title">주문·클레임 현황</CardTitle>
        <CardDesc>
          배송은 셀러가 직접 진행합니다. 주문·클레임 확인과 배송 처리 상태 기록을 지원합니다.
        </CardDesc>
      </div>

      <StatGrid $columns={3}>
        <StatBox>
          <StatLabel>신규 주문</StatLabel>
          <StatValue>{summary.newOrders}건</StatValue>
        </StatBox>
        <StatBox>
          <StatLabel>반품/취소 요청</StatLabel>
          <StatValue>{summary.claims}건</StatValue>
        </StatBox>
        <StatBox>
          <StatLabel>처리 필요 주문</StatLabel>
          <StatValue>총 {summary.needAction}건</StatValue>
        </StatBox>
      </StatGrid>

      {rows.length === 0 ? (
        <EmptyText>아직 들어온 주문이 없습니다. 주문이 생기면 여기에 표시됩니다.</EmptyText>
      ) : (
        <TableScroll>
          <Table>
            <thead>
              <tr>
                <th scope="col">주문일</th>
                <th scope="col">주문번호</th>
                <th scope="col">수량/옵션</th>
                <th scope="col">결제 금액</th>
                <th scope="col">배송 처리 상태</th>
                <th scope="col">클레임</th>
                <th scope="col">처리 상태</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.date}</td>
                  <td>{row.orderNo}</td>
                  <td>{row.option}</td>
                  <td>{row.amount}</td>
                  <DropdownCell>
                    <Dropdown
                      aria-label={`${row.orderNo} 배송 처리 상태`}
                      options={toOptions(orderShippingStatusOptions)}
                      value={shippingStatus[row.id] ?? row.shippingStatus}
                      disabled={disabled}
                      onChange={(e) =>
                        setShippingStatus((prev) => ({ ...prev, [row.id]: e.target.value }))
                      }
                    />
                  </DropdownCell>
                  <td>{row.claim}</td>
                  <DropdownCell>
                    <Dropdown
                      aria-label={`${row.orderNo} 클레임 처리 상태`}
                      options={toOptions(orderClaimStatusOptions)}
                      value={claimStatus[row.id] ?? row.claimStatus}
                      disabled={disabled || row.claim === '—'}
                      onChange={(e) =>
                        setClaimStatus((prev) => ({ ...prev, [row.id]: e.target.value }))
                      }
                    />
                  </DropdownCell>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableScroll>
      )}

      {/* 페이지 인디케이터 (Figma 597:9571) — 목 데이터는 1페이지 */}
      {rows.length > 0 && <PageIndicator aria-label="1 페이지">1</PageIndicator>}
    </Card>
  );
};

const DropdownCell = styled.td`
  min-width: 130px;
`;

const PageIndicator = styled.p`
  text-align: center;
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export default OrderClaimSection;
