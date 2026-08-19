import { useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate, useParams } from 'react-router-dom';
import aiSparkleIcon from '@/assets/icons/ai-sparkle.svg';
import salesCopyIcon from '@/assets/icons/sales-copy.svg';
import AreaTrendChart from '@/components/charts/AreaTrendChart';
import BarChart from '@/components/charts/BarChart';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import SalesStatusBadge from '@/components/common/SalesStatusBadge';
import ProductShell from '@/components/layout/ProductShell';
import { useProduct } from '@/hooks/useProducts';
import { useSalesOps } from '@/hooks/useSales';
import { shippingMethodsMock, stockRowsMock, type ShippingMethodId } from '@/mocks/sales';
import { buildPath } from '@/routes/paths';
import { salesOpsKey, useSalesOpsStore } from '@/stores/useSalesOpsStore';
import OrderClaimSection from './components/OrderClaimSection';
import PriceManageSection from './components/PriceManageSection';
import SectionTabs from './components/SectionTabs';
import ShippingSection from './components/ShippingSection';
import StockManageSection from './components/StockManageSection';
import {
  Card,
  CardDesc,
  CardTitle,
  NoticeBox,
  StatBox,
  StatGrid,
  StatLabel,
  StatValue,
  SubTitle,
} from './components/ui';

const RECOMMENDED_PROMPTS = ['요즘 판매 추세 어때?', '재고 얼마나 버틸까?', '가격 조정해도 될까?'];

const AI_RECOMMENDED_METHOD: ShippingMethodId =
  shippingMethodsMock.find((m) => m.aiRecommended)?.id ?? 'direct';

/**
 * OPS-01-01 · OPS-01-02 판매 관리 (Figma 256:4513 · 597:9382) —
 * 업로드가 끝난 뒤의 운영 화면. 판매중/중단 상태를 스토어로 관리하며,
 * 중단 상태에선 판매 중 전용 조작(재고량 추가·배송 변경 등)이 비활성된다.
 */
const SalesOpsPage = () => {
  const params = useParams<{ productId: string; countryCode: string }>();
  const productId = Number(params.productId);
  const countryCode = params.countryCode ?? '';
  const navigate = useNavigate();

  const { data: product } = useProduct(productId);
  const { data: ops } = useSalesOps(productId, countryCode);

  const key = salesOpsKey(productId, countryCode);
  const statusOverride = useSalesOpsStore((s) => s.statusByKey[key]);
  const setStatus = useSalesOpsStore((s) => s.setStatus);
  const stockRows = useSalesOpsStore((s) => s.stockByProduct[String(productId)]) ?? stockRowsMock;

  const [stopModalOpen, setStopModalOpen] = useState(false);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethodId>(AI_RECOMMENDED_METHOD);
  // 총 비용 차감 구조의 '계산 기준 보기' 펼침 상태
  const [basisOpen, setBasisOpen] = useState(false);

  if (!product) return <LoadingText>판매 관리 정보를 불러오는 중…</LoadingText>;

  const country = product.countries.find((c) => c.code === countryCode);
  // 기본값은 product 목의 국가별 판매 상태, 변경분은 스토어 오버라이드
  const status = statusOverride ?? country?.salesStatus ?? '판매중';
  const stopped = status === '판매중단';

  const confirmStop = () => {
    setStatus(key, '판매중단');
    setStopModalOpen(false);
  };

  /** 월간 추이 차트 범례용 누적 합계 (상단 지표는 최근 30일이라 값이 다르다) */
  const monthlyTotal = (ops?.performance.monthlyRevenue ?? []).reduce(
    (acc, month) => ({
      revenue: acc.revenue + month.revenue,
      profit: acc.profit + month.profit,
    }),
    { revenue: 0, profit: 0 },
  );

  return (
    <ProductShell
      product={product}
      title={`${country?.name ?? countryCode} 보고서`}
      backTo={buildPath.totalReport(productId)}
      countryCode={countryCode}
      recommendedPrompts={RECOMMENDED_PROMPTS}
      headerAction={
        /* Figma 12:14726 · 12:15876 — 판매 중단/재개 버튼은 헤더 우측 */
        stopped ? (
          <Button variant="primary" onClick={() => setStatus(key, '판매중')}>
            판매 재개
          </Button>
        ) : (
          /* 판매 중단은 되돌릴 수 없는 동작 — 실행 전 모달 확인 필수 (OPS-01-01 #5) */
          <Button variant="secondary" onClick={() => setStopModalOpen(true)}>
            판매 중단
          </Button>
        )
      }
    >
      {/* 판매 중단 상태 배너 (OPS-01-02 #1~2) — 중단 상태에서도 섹션 탭은 그대로 노출 */}
      {stopped && (
        <StopBanner role="alert">
          <StopDot aria-hidden />
          <div>
            <StopTitle>판매가 중단된 상품입니다</StopTitle>
            <StopDesc>
              Shopee에서 상품 URL이 비공개 처리되어 구매자가 접근할 수 없습니다. 다시 판매하시려면
              판매 재개 버튼을 클릭해 주세요.
            </StopDesc>
          </div>
        </StopBanner>
      )}

      <PageTitle>판매 현황</PageTitle>

      <SectionTabs
        tabs={[
          { label: '판매 요약', targetId: 'section-status' },
          { label: '상품 정보', targetId: 'section-info' },
          { label: '주문 관리', targetId: 'section-orders' },
          { label: '배송 정보', targetId: 'section-ops-shipping' },
          { label: '판매 성과', targetId: 'section-performance' },
          { label: '가격 관리', targetId: 'section-price-manage' },
        ]}
      />

      {ops && (
        <>
          {/* 판매 상태 요약 (Figma 12:14726) — 카드 없이 스파클 아이콘 + 헤드라인 + 설명 */}
          <SummaryBlock id="section-status" aria-labelledby="status-title">
            <SummaryHead>
              <SparkleBadge aria-hidden>
                <img src={aiSparkleIcon} alt="" />
              </SparkleBadge>
              <CardTitle id="status-title">판매 상태 요약</CardTitle>
            </SummaryHead>
            <Headline>{ops.summary.headline}</Headline>
            <CardDesc>{ops.summary.description}</CardDesc>
          </SummaryBlock>

          {/* 상세 페이지 링크 (상품 정보) */}
          <Card id="section-info" aria-labelledby="link-title">
            <CardTitle id="link-title">상세 페이지 링크</CardTitle>
            <LinkRow>
              <LinkUrl href={ops.link.url} target="_blank" rel="noreferrer">
                {ops.link.url}
              </LinkUrl>
              <CopyButton
                type="button"
                aria-label="URL 복사"
                onClick={() => void navigator.clipboard.writeText(ops.link.url)}
              >
                <img src={salesCopyIcon} alt="" aria-hidden />
              </CopyButton>
            </LinkRow>
            <MetaGrid>
              <MetaItem>
                <dt>등록일</dt>
                <dd>{ops.link.registeredAt}</dd>
              </MetaItem>
              <MetaItem>
                <dt>최종 수정일</dt>
                <dd>{ops.link.updatedAt}</dd>
              </MetaItem>
              <MetaItem>
                <dt>판매 상태</dt>
                <dd>
                  <SalesStatusBadge status={status} />
                </dd>
              </MetaItem>
              <MetaItem>
                <dt>마지막 업데이트</dt>
                <dd>{ops.link.lastSync}</dd>
              </MetaItem>
            </MetaGrid>
          </Card>

          {/* 주문·클레임 현황 + 재고 관리 — Figma 12:14726 기준 한 카드 */}
          <Card aria-label="주문·클레임 현황 및 재고 관리">
            <OrderClaimSection
              summary={ops.orders.summary}
              rows={[...ops.orders.rows]}
              disabled={stopped}
            />
            <StockManageSection
              rows={stockRows}
              disabled={stopped}
              onAddStock={() => navigate(buildPath.stockAdd(productId))}
              onEditOptions={() => navigate(buildPath.salesInfo(productId, countryCode))}
            />
          </Card>

          {/* 배송 방식·포장 정보 — 변경 시 지표 재계산(목), 중단 상태 비활성 */}
          <ShippingSection
            id="section-ops-shipping"
            methods={shippingMethodsMock}
            value={shippingMethod}
            onChange={setShippingMethod}
            disabled={stopped}
          />

          {/* 판매 성과 — 지표 5종 + 판매량·월간 매출/수익 추이 + 총 비용 차감 구조 */}
          <Card id="section-performance" aria-labelledby="performance-title">
            <CardHeader>
              <CardTitle id="performance-title">판매 성과</CardTitle>
              <HeaderNote>최근 30일</HeaderNote>
            </CardHeader>
            <NoticeBox>{ops.performance.note}</NoticeBox>
            <StatGrid $columns={5}>
              <StatBox>
                <StatLabel>판매량</StatLabel>
                <StatValue>{ops.performance.qty}</StatValue>
              </StatBox>
              <StatBox>
                <StatLabel>총 매출</StatLabel>
                <StatValue>{ops.performance.revenue}</StatValue>
              </StatBox>
              <StatBox>
                <StatLabel>손익분기까지</StatLabel>
                <StatValue>{ops.performance.bepRemaining}</StatValue>
              </StatBox>
              <StatBox $tone="positive">
                <StatLabel>예상 순이익</StatLabel>
                <StatValue $tone="positive">{ops.performance.profit}</StatValue>
              </StatBox>
              <StatBox $tone="positive">
                <StatLabel>마진율</StatLabel>
                <StatValue $tone="positive">{ops.performance.margin}</StatValue>
              </StatBox>
            </StatGrid>

            {/* Figma 12:14726 — 좌: 판매량 라인차트, 우: 월간 매출/수익 추이 막대차트 */}
            <ChartRow>
              <ChartCol>
                <QtyLegend>
                  <LegendSwatch aria-hidden />
                  판매량
                </QtyLegend>
                <AreaTrendChart
                  data={[...ops.salesTrend]}
                  height={140}
                  formatValue={(v) => `${v}개`}
                />
              </ChartCol>
              <ChartCol>
                <ChartLabel>월간 매출/수익 추이</ChartLabel>
                <BarChart
                  data={ops.performance.monthlyRevenue.map((m) => ({
                    label: m.label,
                    value: m.revenue,
                  }))}
                  height={140}
                  formatValue={(v) => `₩${v.toLocaleString()}`}
                />
                {/* 범례는 차트에 그려진 기간의 합계 — 상단 지표(최근 30일)와 기간이 다르다 */}
                <LegendRow>
                  <LegendItem>매출 ₩{monthlyTotal.revenue.toLocaleString()}</LegendItem>
                  <LegendItem $tone="positive">
                    순이익 ₩{monthlyTotal.profit.toLocaleString()}
                  </LegendItem>
                </LegendRow>
              </ChartCol>
            </ChartRow>

            {/* 총 비용 차감 구조 — 순이익 산출 과정 단계별 공개 */}
            <div>
              <SubTitle>총 비용 차감 구조 (판매가 → 순이익)</SubTitle>
              <CostTable>
                <tbody>
                  {/* Figma 12:14726 — 첫 행(총 매출)과 마지막 행(예상 순이익)을 강조 */}
                  {ops.performance.costBreakdown.map((row, index) => (
                    <CostRow
                      key={row.label}
                      $emphasis={index === 0 || ('emphasis' in row && Boolean(row.emphasis))}
                    >
                      <td>{row.label}</td>
                      <td>{row.amountText}</td>
                    </CostRow>
                  ))}
                </tbody>
              </CostTable>
              {/* Figma 12:14726 — 셰브런 + 텍스트형 토글 */}
              <BasisToggle
                type="button"
                aria-expanded={basisOpen}
                onClick={() => setBasisOpen((prev) => !prev)}
              >
                <BasisChevron aria-hidden $open={basisOpen}>
                  ⌄
                </BasisChevron>
                계산 기준 보기
              </BasisToggle>
              {basisOpen && <NoticeBox>{ops.performance.calcBasis}</NoticeBox>}
            </div>
          </Card>

          {/* 가격 관리 */}
          <PriceManageSection
            currentPrice={ops.priceManage.currentPrice}
            fxNote={ops.priceManage.fxNote}
            note={ops.priceManage.note}
            impacts={ops.priceManage.impacts}
            history={ops.priceManage.history}
            disabled={stopped}
          />
        </>
      )}

      {/* 판매 중단 확인 모달 (F-36) */}
      <Modal
        open={stopModalOpen}
        title="판매를 중단할까요?"
        description="Shopee에서 상품 URL이 비공개 처리됩니다. 삭제가 아니므로 판매 재개 시 리뷰·판매 이력은 유지됩니다."
        onClose={() => setStopModalOpen(false)}
        footer={
          <>
            <Button variant="secondary" fullWidth onClick={() => setStopModalOpen(false)}>
              취소
            </Button>
            <Button variant="warning" fullWidth onClick={confirmStop}>
              판매 중단
            </Button>
          </>
        }
      />
    </ProductShell>
  );
};

const PageTitle = styled.h2`
  padding: ${({ theme }) => `0 ${theme.spacing.xs}`};
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

/** 판매 중단 안내 배너 (Figma 597:10041) — 상태 점 + 제목 + 설명 2줄 */
const StopBanner = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.md} 20px`};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.errorLight};
  background: ${({ theme }) => theme.colors.errorLight};
`;

const StopDot = styled.span`
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.error};
`;

const StopTitle = styled.p`
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.error};
`;

const StopDesc = styled.p`
  margin-top: 3px;
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

/* 판매 상태 요약 (Figma 12:14726) — 카드 테두리 없는 블록 */
const SummaryBlock = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `0 ${theme.spacing.xs}`};
`;

const SummaryHead = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const SparkleBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.bgLight};

  img {
    width: 18px;
    height: 18px;
  }
`;

const Headline = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xxs};
  ${({ theme }) => theme.typography.heading03};
  color: ${({ theme }) => theme.colors.textStrong};
`;

const ChartLabel = styled.span`
  display: block;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  ${({ theme }) => theme.typography.captionStrong};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const HeaderNote = styled.span`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
`;

/* Figma 12:14726 — 판매량 라인차트와 월간 매출/수익 막대차트 2열 */
const ChartRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 1279px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCol = styled.div`
  min-width: 0;
`;

/* '— 판매량' 범례 (Figma 12:14726 좌측 차트) */
const QtyLegend = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  ${({ theme }) => theme.typography.captionStrong};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const LegendSwatch = styled.span`
  width: 16px;
  height: 2px;
  border-radius: 1px;
  background: ${({ theme }) => theme.colors.primary};
`;

const LegendRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const LegendItem = styled.span<{ $tone?: 'positive' }>`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme, $tone }) =>
    $tone === 'positive' ? theme.colors.success : theme.colors.textSecondary};
`;

const CostTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  td {
    padding: ${({ theme }) => `10px ${theme.spacing.sm}`};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    ${({ theme }) => theme.typography.tableCell};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  td:last-of-type {
    text-align: right;
  }
`;

const CostRow = styled.tr<{ $emphasis: boolean }>`
  ${({ theme, $emphasis }) =>
    $emphasis
      ? `background: ${theme.colors.bgLight};
         td { font-weight: 700; color: ${theme.colors.textStrong}; }`
      : ''}
`;

/* Figma 12:14726 — 테두리 없는 셰브런 + 텍스트 토글 */
const BasisToggle = styled.button`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.xxs} 0`};
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textPrimary};

  &:hover {
    color: ${({ theme }) => theme.colors.textStrong};
  }
`;

const BasisChevron = styled.span<{ $open: boolean }>`
  display: inline-flex;
  line-height: 1;
  transform: ${({ $open }) => ($open ? 'rotate(180deg)' : 'none')};
  transition: transform 120ms ease-out;
`;

const LinkRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const LinkUrl = styled.a`
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: underline;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.sm};

  img {
    width: 16px;
    height: 16px;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.bgLight};
  }
`;

const MetaGrid = styled.dl`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
  margin: 0;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;

  dt {
    ${({ theme }) => theme.typography.caption01};
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  dd {
    margin: 0;
    ${({ theme }) => theme.typography.body02};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const LoadingText = styled.p`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default SalesOpsPage;
