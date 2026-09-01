import { useNavigate, useParams } from 'react-router-dom';
import aiSparkleIcon from '@/assets/icons/ai-sparkle.svg';
import arrowRightIcon from '@/assets/icons/arrow-right.svg';
import reportNextActionIcon from '@/assets/icons/report-next-action.svg';
import reportSearchIcon from '@/assets/icons/report-search.svg';
import AreaTrendChart from '@/components/charts/AreaTrendChart';
import Button from '@/components/common/Button';
import CtaChevron from '@/components/common/CtaChevron';
import ProductShell from '@/components/layout/ProductShell';
import { useTotalReport } from '@/hooks/useReport';
import { useProduct } from '@/hooks/useProducts';
import { buildPath, PATH } from '@/routes/paths';
import CountryCard from './components/CountryCard';
import SectionCard from './components/SectionCard';
import * as S from './TotalReportPage.styled';

const won = (value: number) => `₩${value.toLocaleString()}`;

/** 판매 현황 금액 표기 (Figma 12:15740 — '₩ 1,284,000원') */
const krw = (value: number) => `₩ ${value.toLocaleString()}원`;

/**
 * RPT-01-01 전체 분석 보고서 (Figma 576:6776) — 라우트 /products/:productId/report
 * 국가별 병렬 분석 결과 종합. 우선 진입 국가를 먼저 제시한다.
 */
const TotalReportPage = () => {
  const params = useParams();
  const productId = Number(params.productId);
  const navigate = useNavigate();

  const { data: product } = useProduct(productId);
  const { data: report, isError, isPending, refetch } = useTotalReport(productId);

  if (!product) return <S.PageLoading>보고서를 불러오는 중…</S.PageLoading>;

  // 병렬 분석이므로 화면이 한 번에 완성되지 않는다 — 섹션 단위 스켈레톤/오류 (RPT-01-01 전역)
  if (!report) {
    return (
      <ProductShell
        product={product}
        title="글로벌 분석 보고서"
        backTo={PATH.PRODUCTS}
        recommendedPrompts={['분석 얼마나 남았어?', '어떤 기준으로 비교해?']}
      >
        {isError ? (
          <SectionCard title="AI 종합 결론" icon={aiSparkleIcon}>
            <S.ErrorBox role="alert">분석을 완료하지 못했습니다.</S.ErrorBox>
            <Button variant="secondary" onClick={() => void refetch()}>
              다시 시도
            </Button>
          </SectionCard>
        ) : (
          <>
            <SectionCard title="AI 종합 결론" icon={aiSparkleIcon} bare>
              <S.SkeletonLine $width="60%" $height={34} />
              <S.SkeletonLine $width="100%" />
              <S.SkeletonLine $width="85%" />
            </SectionCard>
            <SectionCard title="국가별 분석 결과">
              <S.CountryGrid>
                {[0, 1, 2].map((index) => (
                  <S.SkeletonCard key={index} aria-busy={isPending} />
                ))}
              </S.CountryGrid>
            </SectionCard>
          </>
        )}
      </ProductShell>
    );
  }

  const sortedCountries = [...report.countries].sort((a, b) => a.rank - b.rank);
  const topCountry = sortedCountries[0];
  // 판매 현황은 판매 중 국가가 1개 이상일 때만 렌더 (RPT-01-01 #14·#17)
  const sellingCountries = product.countries.filter((c) => c.salesStatus === '판매중');
  const sales = sellingCountries.length > 0 ? report.sales : null;
  // 판매 이력 없는 국가는 집계 제외 (0원 표시 안 함)
  const sellingRevenues =
    sales?.countryRevenues.filter((r) => sellingCountries.some((c) => c.code === r.code)) ?? [];

  return (
    <ProductShell
      product={product}
      title="글로벌 분석 보고서"
      backTo={PATH.PRODUCTS}
      /* 첫 질문은 통관이 막힌 국가 — 제도 근거로 불가를 답하는 시나리오 (시연 9단계) */
      recommendedPrompts={[
        '인도네시아도 팔 수 있어?',
        '필리핀도 분석해줘',
        '가장 마진 높은 국가?',
        '현지 경쟁사 가격대 알려줘',
      ]}
    >
      {/* ① AI 종합 결론 — 한 줄 결론 + 근거 문단 + 4축 지표 (Figma: 카드 테두리 없는 블록) */}
      <SectionCard title="AI 종합 결론" icon={aiSparkleIcon} bare>
        <S.ConclusionBody>
          <S.ConclusionMain>
            <S.ConclusionTitle>{report.conclusionTitle}</S.ConclusionTitle>
            <S.ConclusionParagraph>{report.conclusionBody}</S.ConclusionParagraph>
            {topCountry && (
              /* 그라데이션 풀폭 CTA (Figma 12:15740) */
              <S.ConclusionCta
                type="button"
                onClick={() => navigate(buildPath.countryReport(productId, topCountry.code))}
              >
                보고서 확인
                <CtaChevron />
              </S.ConclusionCta>
            )}
          </S.ConclusionMain>

          <S.MetricList>
            {report.metrics.map((metric) => (
              <S.MetricRow key={metric.label}>
                <S.MetricLabel>{metric.label}</S.MetricLabel>
                <S.MetricValue>
                  {/* Figma 12:15740 — 등급은 볼드 텍스트. 원점수 병기는 명세 근거로 유지 */}
                  <S.MetricGrade>{metric.grade}</S.MetricGrade>
                  <S.MetricScore>{metric.score}점</S.MetricScore>
                </S.MetricValue>
              </S.MetricRow>
            ))}
          </S.MetricList>
        </S.ConclusionBody>
      </SectionCard>

      {/* ⑤ 판매 현황 — 판매 중 국가 1개 이상일 때만 (AI 산출값 아님, 주문 집계) */}
      {sales && (
        <SectionCard
          title="판매 현황"
          headerRight={<S.SalesCountBadge>판매 중 {sellingCountries.length}개국</S.SalesCountBadge>}
        >
          <S.SalesAsOf>{sales.asOf} 기준</S.SalesAsOf>

          <S.SalesStatGrid>
            <S.SalesStatTile>
              <S.SalesStatLabel>총 매출</S.SalesStatLabel>
              <S.SalesStatValue>{krw(sales.totalRevenue)}</S.SalesStatValue>
            </S.SalesStatTile>
            <S.SalesStatTile>
              <S.SalesStatLabel>이번 달 매출</S.SalesStatLabel>
              <S.SalesStatValue>{krw(sales.monthRevenue)}</S.SalesStatValue>
              <S.SalesStatDelta $up={sales.monthDeltaPct >= 0}>
                전월 대비 {sales.monthDeltaPct >= 0 ? '+' : ''}
                {sales.monthDeltaPct}%p
              </S.SalesStatDelta>
            </S.SalesStatTile>
            <S.SalesStatTile>
              <S.SalesStatLabel>총 주문</S.SalesStatLabel>
              <S.SalesStatValue>{sales.orderCount}건</S.SalesStatValue>
            </S.SalesStatTile>
          </S.SalesStatGrid>

          <div>
            <S.SubTitle>매출 추이 (최근 6개월)</S.SubTitle>
            <AreaTrendChart data={sales.monthlyTrend} height={72} formatValue={won} />
          </div>

          {/*
            판매 중인 국가별 매출 — 순위 뱃지 + 국가·매출 + 국가별 판매 관리 이동 (Figma 576:7199).
            집계할 국가가 없으면 제목만 남아 빈 블록이 되므로 통째로 감춘다.
          */}
          {sellingRevenues.length > 0 && (
            <div>
              <S.SubTitle>판매 중인 국가별 매출</S.SubTitle>
              <S.CountryRevenueList>
                {sellingRevenues.map((revenue, index) => (
                  <S.CountryRevenueRow key={revenue.code}>
                    <S.RankBadge>{index + 1}위</S.RankBadge>
                    <S.CountryRevenueMain>
                      <span>{revenue.name}</span>
                      <S.RevenueValue>{krw(revenue.revenue)}</S.RevenueValue>
                    </S.CountryRevenueMain>
                    <S.RowButton
                      type="button"
                      onClick={() => navigate(buildPath.salesOps(productId, revenue.code))}
                    >
                      판매 관리
                      <S.RowButtonIcon src={arrowRightIcon} alt="" />
                    </S.RowButton>
                  </S.CountryRevenueRow>
                ))}
              </S.CountryRevenueList>
            </div>
          )}
        </SectionCard>
      )}

      {/* ② 국가별 분석 결과 — 최선값 국가 1위 정렬, CTA는 진행 단계 배리언트 */}
      <div>
        <S.SectionTitle>국가별 분석 결과</S.SectionTitle>
      </div>
      <S.CountryGrid>
        {sortedCountries.map((result) => {
          const progress = product.countries.find((c) => c.code === result.code);
          if (!progress) return null;
          return (
            <CountryCard
              key={result.code}
              productId={productId}
              progress={progress}
              result={result}
            />
          );
        })}
      </S.CountryGrid>

      {/* ③ 후보국 조사 과정 — 판단 근거 투명화 (조사 국가·분석 기준·기준 플랫폼) */}
      <SectionCard title="후보국 조사 과정" icon={reportSearchIcon}>
        <S.Paragraph>{report.investigation.summary}</S.Paragraph>
        <S.ChipGroups>
          <S.ChipGroup>
            <S.ChipGroupLabel>조사 국가</S.ChipGroupLabel>
            <S.ChipRow>
              {report.investigation.countries.map((name) => (
                <S.Chip key={name}>{name}</S.Chip>
              ))}
            </S.ChipRow>
          </S.ChipGroup>
          <S.ChipGroup>
            <S.ChipGroupLabel>분석 기준</S.ChipGroupLabel>
            <S.ChipRow>
              {report.investigation.criteria.map((name) => (
                <S.Chip key={name}>{name}</S.Chip>
              ))}
            </S.ChipRow>
          </S.ChipGroup>
          <S.ChipGroup>
            <S.ChipGroupLabel>기준 플랫폼</S.ChipGroupLabel>
            <S.ChipRow>
              {report.investigation.platforms.map((name) => (
                <S.Chip key={name}>{name}</S.Chip>
              ))}
            </S.ChipRow>
          </S.ChipGroup>
        </S.ChipGroups>
      </SectionCard>

      {/* ④ 다음 추천 액션 — 요청 없이 먼저 제안하는 유일한 영역 (R-005-06) */}
      <SectionCard title="다음 추천 액션" icon={reportNextActionIcon}>
        <S.Paragraph>{report.nextAction}</S.Paragraph>
      </SectionCard>
    </ProductShell>
  );
};

export default TotalReportPage;
