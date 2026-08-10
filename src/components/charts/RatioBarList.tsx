import styled from '@emotion/styled';

export interface RatioItem {
  label: string;
  value: number;
  /** 우측 표기 텍스트 (없으면 value.toLocaleString()) */
  valueText?: string;
}

interface RatioBarListProps {
  items: RatioItem[];
}

/** 가로 비중 바 목록 (국가별 매출 비중 등) — 최댓값 대비 비율로 채운다 */
const RatioBarList = ({ items }: RatioBarListProps) => {
  const max = Math.max(...items.map((i) => i.value), 1);

  return (
    <List>
      {items.map((item) => (
        <Row key={item.label}>
          <RowLabel>{item.label}</RowLabel>
          <Track>
            <Fill style={{ width: `${(item.value / max) * 100}%` }} />
          </Track>
          <RowValue>{item.valueText ?? item.value.toLocaleString()}</RowValue>
        </Row>
      ))}
    </List>
  );
};

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const RowLabel = styled.span`
  width: 64px;
  flex-shrink: 0;
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Track = styled.div`
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.bgGray};
  overflow: hidden;
`;

const Fill = styled.div`
  height: 100%;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.primary};
`;

const RowValue = styled.span`
  width: 88px;
  flex-shrink: 0;
  text-align: right;
  ${({ theme }) => theme.typography.captionStrong};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

export default RatioBarList;
