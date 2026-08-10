import { useId } from 'react';
import styled from '@emotion/styled';
import { useTheme } from '@emotion/react';

export interface TrendPoint {
  label: string;
  value: number;
}

interface AreaTrendChartProps {
  data: TrendPoint[];
  /** 차트 영역 높이(px). 라벨 줄 제외 */
  height?: number;
  /** 포인트 호버 시 값 포맷터 (title 툴팁) */
  formatValue?: (value: number) => string;
}

/** viewBox 좌표계 — preserveAspectRatio="none"으로 컨테이너에 맞춰 늘어난다 */
const VIEW_W = 100;
const VIEW_H = 40;
const PAD_Y = 4;

/**
 * 영역 추이 차트 (대시보드 매출 추이 · 판매량 추이 등).
 * 외부 라이브러리 없이 데이터 기반 SVG로 그린다.
 * 선 굵기는 vector-effect로 고정되어 리사이즈 시에도 일정하다.
 */
const AreaTrendChart = ({ data, height = 56, formatValue }: AreaTrendChartProps) => {
  const theme = useTheme();
  const gradientId = useId();

  if (data.length < 2) {
    return <EmptyNotice>추이를 보려면 데이터가 더 필요합니다.</EmptyNotice>;
  }

  const values = data.map((d) => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = data.map((d, i) => ({
    x: (i / (data.length - 1)) * VIEW_W,
    y: VIEW_H - PAD_Y - ((d.value - min) / range) * (VIEW_H - PAD_Y * 2),
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(' ');
  const areaPath = `${linePath} L${VIEW_W},${VIEW_H} L0,${VIEW_H} Z`;

  return (
    <Wrapper>
      <Surface style={{ height }}>
        <Svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="none" aria-hidden>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={theme.colors.primary} stopOpacity="0.25" />
              <stop offset="100%" stopColor={theme.colors.primary} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* 그리드 (상/하단) */}
          <line x1="0" y1={PAD_Y} x2={VIEW_W} y2={PAD_Y} stroke={theme.colors.border} strokeWidth="1" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
          <line x1="0" y1={VIEW_H - PAD_Y} x2={VIEW_W} y2={VIEW_H - PAD_Y} stroke={theme.colors.border} strokeWidth="1" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
          <path d={areaPath} fill={`url(#${gradientId})`} />
          <path d={linePath} fill="none" stroke={theme.colors.primary} strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" strokeLinecap="round" />
        </Svg>
        {/* 포인트 호버 영역 — 해당 구간 값 title 툴팁 */}
        <HoverRow>
          {data.map((d) => (
            <HoverCell key={d.label} title={`${d.label} · ${formatValue ? formatValue(d.value) : d.value.toLocaleString()}`} />
          ))}
        </HoverRow>
      </Surface>
      <Labels>
        {data.map((d) => (
          <span key={d.label}>{d.label}</span>
        ))}
      </Labels>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  width: 100%;
`;

const Surface = styled.div`
  position: relative;
  width: 100%;
`;

const Svg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
`;

const HoverRow = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
`;

const HoverCell = styled.div`
  flex: 1;
`;

const Labels = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: ${({ theme }) => theme.spacing.xxs};

  span {
    font-size: 10px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const EmptyNotice = styled.p`
  padding: ${({ theme }) => theme.spacing.md};
  text-align: center;
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default AreaTrendChart;
