import styled from '@emotion/styled';
import statOrderIcon from '@/assets/icons/stat-order.svg';
import statReportIcon from '@/assets/icons/stat-report.svg';
import trendUpIcon from '@/assets/icons/trend-up.svg';
import AreaTrendChart from '@/components/charts/AreaTrendChart';
import type { DashboardSummary } from '@/types/dashboard';

interface OverviewSectionProps {
  summary: DashboardSummary;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 기준`;
};

/**
 * 매출 개요 + 판매 성과 카드 (Figma 221:2503).
 * 명세 주석: 매출·순이익은 전체 상품 기준 계산값이며 기준일을 함께 표기한다.
 */
const OverviewSection = ({ summary }: OverviewSectionProps) => {
  return (
    <Card>
      <RevenueArea>
        <SectionLabel>매출 개요</SectionLabel>
        <RevenueRow>
          <div>
            {/* Figma 510:4165 · 명세 DSH-01-01 #4 — 큰 숫자는 '순이익'(원), 우측 타일은 '전체 마진율'(%) */}
            <RevenueTitle>순이익</RevenueTitle>
            <RevenueValue>{summary.revenue.toLocaleString()}원</RevenueValue>
            <RevenueCaption>{formatDate(summary.revenueAsOf)}</RevenueCaption>
          </div>
          <ProfitTile>
            <ProfitLabel>전체 마진율</ProfitLabel>
            <ProfitValue>{summary.netProfitRate}%</ProfitValue>
            <ProfitDelta>
              <img src={trendUpIcon} alt="" />
              전월 대비 +{summary.netProfitDelta}%p
            </ProfitDelta>
          </ProfitTile>
        </RevenueRow>
        <AreaTrendChart
          data={summary.monthlyRevenue.map((m) => ({ label: m.month, value: m.value }))}
          formatValue={(v) => `${v.toLocaleString()}원`}
        />
      </RevenueArea>

      <PerformanceArea>
        <SectionLabel>판매 성과</SectionLabel>
        <StatCards>
          <StatCard $wide>
            <StatIcon>
              <img src={statOrderIcon} alt="" />
            </StatIcon>
            <StatValue>{summary.totalSales.toLocaleString()}원</StatValue>
            <StatLabel>총 매출</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>
              <img src={statOrderIcon} alt="" />
            </StatIcon>
            <StatValue>{summary.orderCount}건</StatValue>
            <StatLabel>주문량</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>
              <img src={statReportIcon} alt="" />
            </StatIcon>
            <StatValue>{summary.activeProductCount}개</StatValue>
            <StatLabel $primary>판매 중인 상품</StatLabel>
          </StatCard>
        </StatCards>
      </PerformanceArea>
    </Card>
  );
};

const Card = styled.section`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: stretch;
  padding: ${({ theme }) => `${theme.spacing.md}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};

  ${({ theme }) => theme.media.tablet} {
    flex-direction: column;
  }
`;

const SectionLabel = styled.p`
  padding-bottom: ${({ theme }) => theme.spacing.md};
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const RevenueArea = styled.div`
  flex: 1;
  min-width: 0;
`;

const RevenueRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.md};
`;

const RevenueTitle = styled.p`
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const RevenueValue = styled.p`
  ${({ theme }) => theme.typography.heading01};
  color: ${({ theme }) => theme.colors.textStrong};
`;

const RevenueCaption = styled.p`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ProfitTile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxs};
  padding: 13px 19px;
  border: 0.8px solid ${({ theme }) => theme.colors.primaryLight};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.bgLight};
  flex-shrink: 0;
`;

const ProfitLabel = styled.p`
  ${({ theme }) => theme.typography.tableHeader};
  color: ${({ theme }) => theme.colors.primary};
`;

const ProfitValue = styled.p`
  ${({ theme }) => theme.typography.heading02};
  color: ${({ theme }) => theme.colors.primary};
`;

const ProfitDelta = styled.p`
  display: flex;
  align-items: center;
  gap: 3px;
  ${({ theme }) => theme.typography.captionStrong};
  color: ${({ theme }) => theme.colors.primary};

  img {
    width: 11px;
    height: 11px;
  }
`;

const PerformanceArea = styled.div`
  padding: ${({ theme }) => `${theme.spacing.md} 0`};
`;

const StatCards = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};

  ${({ theme }) => theme.media.mobile} {
    flex-direction: column;
  }
`;

const StatCard = styled.div<{ $wide?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  width: ${({ $wide }) => ($wide ? '228px' : '172px')};
  padding: 14px ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.xl};
  background: ${({ theme }) => theme.colors.bgLight};

  ${({ theme }) => theme.media.mobile} {
    width: 100%;
  }
`;

const StatIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surface};

  img {
    width: 24px;
    height: 24px;
  }
`;

const StatValue = styled.p`
  ${({ theme }) => theme.typography.heading02};
  color: ${({ theme }) => theme.colors.primary};
`;

const StatLabel = styled.p<{ $primary?: boolean }>`
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme, $primary }) =>
    $primary ? theme.colors.primary : theme.colors.textPrimary};
`;

export default OverviewSection;
