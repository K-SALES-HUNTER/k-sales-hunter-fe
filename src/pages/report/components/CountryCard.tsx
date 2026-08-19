import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import arrowRightIcon from '@/assets/icons/arrow-right.svg';
import { buildPath } from '@/routes/paths';
import type { CountryProgress, CountryStage } from '@/types/product';
import type { TotalReportCountry } from '@/types/report';
import CountryFitBadge from './CountryFitBadge';

const COUNTRY_EN_NAME: Record<string, string> = {
  VN: 'Vietnam',
  SG: 'Singapore',
  TH: 'Thailand',
};

/** 배리언트 = 진행 단계 (되돌아가지 않음). stage별 CTA 라벨·이동 목적지 */
const STAGE_CTA: Record<CountryStage, { label: string; to: (productId: number, code: string) => string }> = {
  report: { label: '보고서 확인', to: buildPath.countryReport },
  'sales-info': { label: '판매 정보 입력', to: buildPath.salesInfo },
  detail: { label: '상세 페이지 확인', to: buildPath.detailPage },
};

/** Figma 12:15485 — 상태 표기는 띄어쓰기 포함 ('판매 전' / '판매 중') */
const SALES_STATUS_LABEL: Record<string, string> = {
  판매전: '판매 전',
  판매중: '판매 중',
};

/** Figma 12:15740 — 뱃지 표기는 '유의 필요' */
const FIT_GRADE_LABEL: Record<string, string> = {
  유의: '유의 필요',
};

interface CountryCardProps {
  productId: number;
  /** 진행 단계·판매 상태 (product.countries) */
  progress: CountryProgress;
  /** 순위·적합도·추천가 (분석 결과) */
  result: TotalReportCountry;
}

/** CountryCard (Figma 308:2753) — 전체 보고서의 국가별 분석 결과 카드 */
const CountryCard = ({ productId, progress, result }: CountryCardProps) => {
  const navigate = useNavigate();
  const cta = STAGE_CTA[progress.stage];

  return (
    <Card>
      <NameRow>
        <div>
          <Name>{progress.name}</Name>
          <EnName>{COUNTRY_EN_NAME[progress.code] ?? progress.code}</EnName>
        </div>
        <CountryFitBadge
          grade={result.fitGrade}
          label={`${result.rank}위 · ${FIT_GRADE_LABEL[result.fitGrade] ?? result.fitGrade}`}
        />
      </NameRow>

      <InfoRows>
        <InfoRow>
          {/* 상세 페이지까지 만든 국가는 확정된 '판매 가격' (Figma 12:15485) */}
          <InfoLabel>{progress.stage === 'detail' ? '판매 가격' : '추천 판매 가격'}</InfoLabel>
          {/* Figma 12:15485 — 원화 환산 단일 표기 ('약 4,000원') */}
          <InfoValue>약 {result.priceKrw.toLocaleString()}원</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>상태</InfoLabel>
          <InfoValue>{SALES_STATUS_LABEL[progress.salesStatus] ?? progress.salesStatus}</InfoValue>
        </InfoRow>
      </InfoRows>

      <CtaButton type="button" onClick={() => navigate(cta.to(productId, progress.code))}>
        {cta.label}
        <CtaIcon src={arrowRightIcon} alt="" />
      </CtaButton>
    </Card>
  );
};

const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.spacing.md};
`;

const NameRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Name = styled.p`
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const EnName = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xxs};
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const InfoRows = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
  padding: ${({ theme }) => `0 ${theme.spacing.xxs}`};
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
`;

const InfoLabel = styled.span`
  ${({ theme }) => theme.typography.tableCell};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const InfoValue = styled.span`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.xxs};
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const CtaButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primaryLight};
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textPrimary};
  transition: filter 120ms ease-out;

  &:hover {
    filter: brightness(0.96);
  }
`;

const CtaIcon = styled.img`
  width: 8px;
`;

export default CountryCard;
