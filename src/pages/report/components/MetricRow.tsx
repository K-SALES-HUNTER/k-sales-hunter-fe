import styled from '@emotion/styled';
import reportCheckIcon from '@/assets/icons/report-check.svg';
import type { AxisMetric } from '@/types/report';
import ScoreBadge from './ScoreBadge';

interface MetricRowProps {
  metric: AxisMetric;
}

/**
 * MetricBar (Figma 265:2264) — 항목별 분석 지표 한 행.
 * 등급 뱃지 + 원점수 병기 + 한 줄 해설. 경쟁 강도는 invert로 색 의미 반대.
 */
const MetricRow = ({ metric }: MetricRowProps) => {
  return (
    <Row>
      <Label>{metric.label}</Label>
      <BadgeSlot>
        <ScoreBadge grade={metric.grade} invert={metric.invert} />
        <Score>{metric.score}점</Score>
      </BadgeSlot>
      {metric.comment && (
        <Comment>
          <CheckIcon src={reportCheckIcon} alt="" />
          {metric.comment}
        </Comment>
      )}
    </Row>
  );
};

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  min-height: 24px;
`;

/* MetricBar (Figma 265:2264) — 라벨 135px, 뱃지+점수 고정 슬롯 */
const Label = styled.span`
  width: 135px;
  flex-shrink: 0;
  ${({ theme }) => theme.typography.tableCell};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const BadgeSlot = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  /* '보통 64점'처럼 긴 조합에서도 한 줄에 들어가야 한다 (줄바꿈되면 행 높이가 튄다) */
  width: 90px;
  flex-shrink: 0;
`;

const Score = styled.span`
  white-space: nowrap;
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Comment = styled.span`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CheckIcon = styled.img`
  width: 18px;
  flex-shrink: 0;
`;

export default MetricRow;
