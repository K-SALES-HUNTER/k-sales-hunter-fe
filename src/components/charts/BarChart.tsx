import styled from '@emotion/styled';

export interface BarPoint {
  label: string;
  value: number;
  /** 강조 색(추천 구간 등). 기본은 primaryLight */
  highlighted?: boolean;
  /** 마커 표시 (가격대 분포의 권장가 위치 등) */
  marker?: string;
}

interface BarChartProps {
  data: BarPoint[];
  height?: number;
  formatValue?: (value: number) => string;
}

/** 세로 막대 차트 (가격대 분포 · 판매량 추이 등) — div 기반, 테마 토큰 사용 */
const BarChart = ({ data, height = 120, formatValue }: BarChartProps) => {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <Wrapper>
      <Bars style={{ height }}>
        {data.map((d) => (
          <BarCol key={d.label}>
            {d.marker && <Marker>{d.marker}</Marker>}
            <Bar
              $highlighted={Boolean(d.highlighted)}
              style={{ height: `${(d.value / max) * 100}%` }}
              title={`${d.label} · ${formatValue ? formatValue(d.value) : d.value.toLocaleString()}`}
            />
          </BarCol>
        ))}
      </Bars>
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

const Bars = styled.div`
  display: flex;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.xs};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const BarCol = styled.div`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
`;

const Bar = styled.div<{ $highlighted: boolean }>`
  width: 100%;
  min-height: 2px;
  border-radius: 4px 4px 0 0;
  background: ${({ theme, $highlighted }) =>
    $highlighted ? theme.colors.primary : theme.colors.primaryLight};
  transition: background 120ms ease-out;
`;

const Marker = styled.span`
  position: absolute;
  top: -18px;
  ${({ theme }) => theme.typography.captionStrong};
  color: ${({ theme }) => theme.colors.third};
  white-space: nowrap;
`;

const Labels = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  padding-top: ${({ theme }) => theme.spacing.xxs};

  span {
    flex: 1;
    text-align: center;
    font-size: 10px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export default BarChart;
