import styled from '@emotion/styled';
import type { CountryReport } from '@/types/report';

interface CompetitionSectionProps {
  competition: CountryReport['competition'];
}

/** RPT-02-01 경쟁 환경 섹션 — 요약·지표 4종·가격대 분포·경쟁 유형 비교표 */
const CompetitionSection = ({ competition }: CompetitionSectionProps) => {
  // 마커는 띠 폭 기준 0~1 위치 (양 끝에서 잘리지 않게 클램프)
  const markerPercent = Math.min(Math.max(competition.priceMarker.ratio, 0.06), 0.94) * 100;
  const tierLabels = competition.priceTiers.map((tier) => tier.label).join(' · ');

  return (
    <>
      <SummaryBox>{competition.summary}</SummaryBox>

      <StatGrid>
        {competition.stats.map((stat) => (
          <StatTile key={stat.label} $bad={stat.tone === 'bad'}>
            <StatLabel>{stat.label}</StatLabel>
            <StatValue $bad={stat.tone === 'bad'}>{stat.value}</StatValue>
          </StatTile>
        ))}
      </StatGrid>

      <div>
        <SubTitle>가격대 분포</SubTitle>
        {/* 구간 띠(저가형→프리미엄) + 권장가 마커를 같은 축 위에 표시 (Figma 319:2719) */}
        <BandArea>
          <Marker style={{ left: `${markerPercent}%` }}>
            <MarkerChip>{competition.priceMarker.label}</MarkerChip>
            <MarkerStem aria-hidden />
          </Marker>
          <Band role="img" aria-label={`가격대 분포 — ${tierLabels}`}>
            {competition.priceTiers.map((tier, index) => (
              <BandSegment
                key={tier.label}
                $step={index}
                style={{ flexGrow: tier.weight }}
                title={tier.label}
              />
            ))}
          </Band>
          <BandLabels>
            {competition.priceTiers.map((tier) => (
              <span key={tier.label}>{tier.label}</span>
            ))}
          </BandLabels>
        </BandArea>
      </div>

      <div>
        <SubTitle>경쟁 유형 비교</SubTitle>
        <TableWrapper>
          <Table>
            <thead>
              <tr>
                <th>경쟁 유형</th>
                <th>가격대</th>
                <th>강점</th>
                <th>약점</th>
                <th>대응 전략</th>
              </tr>
            </thead>
            <tbody>
              {competition.table.map((row) => (
                <tr key={row.type}>
                  <TypeCell>{row.type}</TypeCell>
                  <td>{row.priceRange}</td>
                  <td>{row.strength}</td>
                  <td>{row.weakness}</td>
                  <td>{row.strategy}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrapper>
      </div>
    </>
  );
};

const SummaryBox = styled.p`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.bgLight};
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};

  ${({ theme }) => theme.media.tablet} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const StatTile = styled.div<{ $bad: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme, $bad }) => ($bad ? theme.colors.errorLight : theme.colors.bgLight)};
`;

const StatLabel = styled.span`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const StatValue = styled.strong<{ $bad: boolean }>`
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme, $bad }) => ($bad ? theme.colors.error : theme.colors.textPrimary)};
`;

const SubTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

/* ── 가격대 분포 띠 (Figma 319:2719) ───────────────────────────── */

const BandArea = styled.div`
  position: relative;
  /* 권장가 마커가 띠 위로 올라오므로 상단 여백 확보 */
  padding-top: 44px;
`;

const Band = styled.div`
  display: flex;
  height: 10px;
  overflow: hidden;
  border-radius: 99px;
`;

/**
 * 구간 색은 저가형→프리미엄으로 진해진다.
 * Figma의 중간 톤(#b2bdd6·#8693af·#3d4f77)에 대응하는 토큰이 없어
 * bgGray → borderStrong → primary 3단 램프로 대체한다.
 */
const BandSegment = styled.div<{ $step: number }>`
  flex-basis: 0;
  min-width: 1px;
  background: ${({ theme, $step }) => {
    if ($step === 0) return theme.colors.bgGray;
    if ($step === 1) return theme.colors.borderStrong;
    return theme.colors.primary;
  }};
`;

const BandLabels = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 80%;
  padding-top: 6px;

  span {
    ${({ theme }) => theme.typography.captionStrong};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Marker = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.none};
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translateX(-50%);
`;

const MarkerChip = styled.span`
  padding: 2px 7px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.primary};
  ${({ theme }) => theme.typography.tableHeader};
  color: ${({ theme }) => theme.colors.textOnPrimary};
  white-space: nowrap;
`;

const MarkerStem = styled.span`
  width: 2px;
  height: 20px;
  background: ${({ theme }) => theme.colors.primary};
`;

const TableWrapper = styled.div`
  overflow-x: auto;
  border-radius: ${({ theme }) => theme.radius.md};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
    text-align: left;
    background: ${({ theme }) => theme.colors.bgLight};
    ${({ theme }) => theme.typography.tableHeader};
    color: ${({ theme }) => theme.colors.textSecondary};
    white-space: nowrap;
  }

  td {
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.sm}`};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    ${({ theme }) => theme.typography.tableCell};
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const TypeCell = styled.td`
  font-weight: 700;
  white-space: nowrap;
`;

export default CompetitionSection;
