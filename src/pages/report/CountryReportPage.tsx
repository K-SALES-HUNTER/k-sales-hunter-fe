import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import aiSparkleIcon from '@/assets/icons/ai-sparkle.svg';
import Button from '@/components/common/Button';
import ProductShell from '@/components/layout/ProductShell';
import { useCountryReport } from '@/hooks/useReport';
import { useProduct } from '@/hooks/useProducts';
import { buildPath } from '@/routes/paths';
import { useDemoProgressStore } from '@/stores/useDemoProgressStore';
import CompetitionSection from './components/CompetitionSection';
import MetricRow from './components/MetricRow';
import PricingSection from './components/PricingSection';
import SectionCard from './components/SectionCard';
import ShippingSection from './components/ShippingSection';
import * as S from './CountryReportPage.styled';

/**
 * 섹션 탭 — 클릭 시 스크롤 이동 앵커 (라우팅 없음).
 * id는 `section-` 접두사를 써야 전역 스타일의 scroll-margin-top이 적용된다.
 */
const SECTIONS = [
  { id: 'section-conclusion', label: '종합 결론' },
  { id: 'section-analysis', label: '항목별 분석' },
  { id: 'section-competition', label: '경쟁 환경' },
  { id: 'section-shipping', label: '배송·통관' },
  { id: 'section-pricing', label: '가격·마진' },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

/**
 * RPT-02-01 국가별 분석 보고서 (Figma 246:5130) — 라우트 /products/:productId/report/:countryCode
 * 한 국가를 깊게 파는 화면: 종합 결론·항목별 분석·경쟁 환경·배송·가격/마진.
 */
const CountryReportPage = () => {
  const params = useParams();
  const productId = Number(params.productId);
  const countryCode = params.countryCode;
  const navigate = useNavigate();

  const { data: product } = useProduct(productId);
  const { data: report, isError, refetch } = useCountryReport(productId, countryCode);

  const [activeSection, setActiveSection] = useState<SectionId>('section-conclusion');

  // TODO: 상세 페이지 생성 시 AI 로딩 오버레이(파이프라인 진행 화면)로 교체 예정 —
  // 현재는 버튼 로딩 1.5초 후 이동으로 간단 구현
  const [generating, setGenerating] = useState(false);
  const markDetailPageCreated = useDemoProgressStore((s) => s.markDetailPageCreated);
  useEffect(() => {
    if (!generating || !countryCode) return;
    const timer = setTimeout(() => {
      // [DEMO-ONLY] 생성이 끝나야 상단 '상세 페이지' 탭이 열린다.
      // 백엔드 연동 시: 상세페이지 생성 API 응답으로 상태가 갱신되므로 이 호출은 삭제한다.
      markDetailPageCreated(productId, countryCode);
      navigate(buildPath.detailPage(productId, countryCode));
    }, 1500);
    return () => clearTimeout(timer);
  }, [generating, productId, countryCode, navigate, markDetailPageCreated]);

  if (!product) return <S.PageLoading>보고서를 불러오는 중…</S.PageLoading>;

  const country = product.countries.find((c) => c.code === countryCode);
  if (!country) return <S.PageLoading>해당 국가의 분석 결과가 없습니다.</S.PageLoading>;

  // 섹션 단위 로딩·오류 (RPT-02-01 전역 — 재실행 섹션만 스켈레톤)
  if (!report) {
    return (
      <ProductShell
        product={product}
        title={`${country.name} 보고서`}
        backTo={buildPath.totalReport(productId)}
        countryCode={country.code}
        recommendedPrompts={['분석 얼마나 남았어?', '이 국가 관세 알려줘']}
      >
        {isError ? (
          <SectionCard title="AI 종합 결론" icon={aiSparkleIcon}>
            <S.ErrorBox role="alert">분석을 완료하지 못했습니다.</S.ErrorBox>
            <Button variant="secondary" onClick={() => void refetch()}>
              다시 시도
            </Button>
          </SectionCard>
        ) : (
          SECTIONS.map((section) => (
            <SectionCard key={section.id} title={section.label}>
              <S.SkeletonLine $width="70%" $height={26} />
              <S.SkeletonLine $width="100%" />
              <S.SkeletonLine $width="88%" />
            </SectionCard>
          ))
        )}
      </ProductShell>
    );
  }

  // scroll-margin-top은 전역 스타일이 `[id^='section-']`에 적용한다 (하드코딩 금지)
  const scrollToSection = (id: SectionId) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <ProductShell
      product={product}
      title={`${report.name} 보고서`}
      backTo={buildPath.totalReport(productId)}
      countryCode={country.code}
      recommendedPrompts={['이 국가 관세 알려줘', '가격 낮추면 마진 어떻게 돼?', '경쟁사 대비 강점은?']}
    >
      <S.PageTop>
        <S.PageTitle>{report.name} 분석 결과</S.PageTitle>
        {/* 헤더 CTA — 다음 단계로 이동 (Figma 12:13779 '판매 정보 입력' → 12:14476 '상세 페이지 생성').
            판매 정보 입력 전에는 판매 정보 입력으로, 입력 후에는 상세 페이지 생성/확인으로 이어진다 */}
        <Button
          variant="primary"
          loading={generating}
          onClick={() => {
            if (!country.hasSalesInfo) {
              navigate(buildPath.salesInfo(productId, country.code));
              return;
            }
            if (country.hasDetailPage) {
              navigate(buildPath.detailPage(productId, country.code));
              return;
            }
            setGenerating(true);
          }}
        >
          {!country.hasSalesInfo
            ? '판매 정보 입력'
            : country.hasDetailPage
              ? '상세 페이지 확인'
              : '상세 페이지 생성'}
        </Button>
      </S.PageTop>

      <S.SectionTabs role="tablist">
        {SECTIONS.map((section) => (
          <S.SectionTab
            key={section.id}
            type="button"
            role="tab"
            aria-selected={activeSection === section.id}
            $active={activeSection === section.id}
            onClick={() => scrollToSection(section.id)}
          >
            {section.label}
          </S.SectionTab>
        ))}
      </S.SectionTabs>

      {/* ① AI 종합 결론 — 추천 포지셔닝 + 권장 판매가 + 예상 순이익 */}
      <div id="section-conclusion">
        <SectionCard title="AI 종합 결론" icon={aiSparkleIcon}>
          <S.ConclusionBody>
            <S.ConclusionMain>
              <S.ConclusionTitle>{report.conclusion.title}</S.ConclusionTitle>
              <S.ConclusionParagraph>{report.conclusion.body}</S.ConclusionParagraph>
              {/* 그라데이션 풀폭 CTA (Figma 12:13779) */}
              <S.ConclusionCta
                type="button"
                onClick={() => navigate(buildPath.salesInfo(productId, country.code))}
              >
                판매 정보 입력
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                  focusable="false"
                >
                  <path
                    d="M9.5 6L15.5 12L9.5 18"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </S.ConclusionCta>
            </S.ConclusionMain>
            <S.InfoList>
              <S.InfoRow>
                <S.InfoLabel>추천 포지셔닝</S.InfoLabel>
                <S.InfoValue>{report.conclusion.positioning}</S.InfoValue>
              </S.InfoRow>
              <S.InfoRow>
                <S.InfoLabel>권장 판매가</S.InfoLabel>
                <S.InfoValue>{report.conclusion.priceText}</S.InfoValue>
              </S.InfoRow>
              <S.InfoRow>
                <S.InfoLabel>예상 순이익</S.InfoLabel>
                <S.InfoValue>{report.conclusion.profitText}</S.InfoValue>
              </S.InfoRow>
            </S.InfoList>
          </S.ConclusionBody>
        </SectionCard>
      </div>

      {/* ② 항목별 분석 — 요약 + 지표 4행 (등급+원점수+한 줄 해설, 경쟁 강도 색 반대) */}
      <div id="section-analysis">
        <SectionCard title="항목별 분석">
          <S.SummaryBox>{report.analysis.summary}</S.SummaryBox>
          <S.MetricList>
            {report.analysis.metrics.map((metric) => (
              <MetricRow key={metric.label} metric={metric} />
            ))}
          </S.MetricList>
        </SectionCard>
      </div>

      {/* ③ 경쟁 환경 — 요약·지표 4종·가격대 분포·경쟁 유형 비교표 */}
      <div id="section-competition">
        <SectionCard title="경쟁 환경">
          <CompetitionSection competition={report.competition} />
        </SectionCard>
      </div>

      {/* ④ 배송 — 배송 방식 선택 + 상품 포장 정보 + 통관 주의사항 */}
      <div id="section-shipping">
        <SectionCard>
          <ShippingSection
            shipping={report.shipping}
            initialPackaging={{
              weight: String(product.weight),
              width: String(report.packaging.width),
              depth: String(report.packaging.depth),
              height: String(report.packaging.height),
            }}
          />
        </SectionCard>
      </div>

      {/* ⑤ 가격·마진 — 가격 3안 + 지표 4종 + 반영 뱃지 + 비용 차감 구조 */}
      <div id="section-pricing">
        <SectionCard title="가격·마진">
          <PricingSection pricing={report.pricing} />
        </SectionCard>
      </div>
    </ProductShell>
  );
};

export default CountryReportPage;
