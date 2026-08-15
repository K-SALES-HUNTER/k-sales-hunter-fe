import type { CountryCode } from '@/types/product';
import type { CountryReport, TotalReport } from '@/types/report';

/**
 * RPT-01-01 전체 분석 보고서 목 (Figma 576:6776)
 * - 국가 순위·추천가는 오케스트레이터 결과 종합(R-000-04) 산출값 가정
 * - sales는 주문 집계(R-006-08) — 판매 중 국가가 없으면 페이지에서 섹션 미렌더
 *
 * 금액은 모두 같은 원장에서 나온다:
 *   공급 원가 ₩11,500 · 국제 배송비(SLS) 국가별 실비 · Shopee 수수료 판매가의 7.2%
 *   관세 0%(FTA 원산지증명 적용) · 수입 VAT는 국가별 과세표준 기준
 *
 * ⚠ 이 파일의 숫자를 고치면 아래도 함께 고쳐야 화면 간 숫자가 어긋나지 않는다.
 *   - mocks/products.ts       costPrice
 *   - mocks/sales.ts          priceScenariosMock · marginBasisMock · shippingMethodsMock · salesOpsMock
 *   - mocks/dashboard.ts      dashboardSummaryAfterSalesMock
 *   - stores/useAiChatStore.ts ANSWERS 안의 인용 수치
 *   검증 절차는 DEMO.md의 '숫자 정합성 점검'을 따른다.
 */
export const totalReportMock: TotalReport = {
  conclusionTitle: '베트남 우선 진입을 추천합니다.',
  conclusionBody:
    'K-캐릭터 굿즈는 3개국 모두에서 수요가 확인되지만, 진입까지 걸리는 시간이 크게 다릅니다. 베트남은 별도 강제 인증 없이 바로 판매를 시작할 수 있고 한-베트남 FTA로 관세도 0%가 적용됩니다. 태국은 수요가 가장 높지만 완구 강제 인증(TISI)에 8~12주가 걸려 첫 판매 국가로는 적합하지 않습니다.',
  metrics: [
    { label: '수요', grade: '높음', score: 84 },
    { label: '경쟁 강도', grade: '보통', score: 52, invert: true },
    { label: 'K-트렌드 적합도', grade: '높음', score: 91 },
    { label: '수익성', grade: '높음', score: 76 },
  ],
  countries: [
    { code: 'VN', rank: 1, fitGrade: '매우 적합', priceLocalText: '₫535,000', priceKrw: 28900 },
    { code: 'SG', rank: 2, fitGrade: '일부 적합', priceLocalText: 'S$28.90', priceKrw: 33500 },
    { code: 'TH', rank: 3, fitGrade: '유의', priceLocalText: '฿705', priceKrw: 27500 },
  ],
  investigation: {
    summary:
      '입력하신 상품 정보와 이미지를 바탕으로 베트남·싱가포르·태국 3개 국가의 Shopee 시장을 같은 기준으로 비교 분석했습니다. 통관 가능 여부를 먼저 확인한 뒤 시장성과 수익성을 계산했습니다.',
    countries: ['베트남', '싱가포르', '태국'],
    criteria: ['수요', '경쟁 강도', 'K-트렌드 적합도', '수익성'],
    platforms: ['Shopee'],
  },
  nextAction:
    '베트남부터 판매 정보를 확정하고 상세 페이지를 생성해 반응을 확인하는 것을 추천합니다. 싱가포르는 같은 상품을 선물용 패키지로 재구성해 객단가를 올리는 방식이 적합하고, 태국은 TISI 인증 절차를 먼저 시작한 뒤 확장하는 순서가 안전합니다.',
  /**
   * 판매 이력 — 베트남 업로드 후 누적 89개 판매 기준 (기준일 2026-08-22)
   * 매출 89 × ₩28,900 = ₩2,572,100
   */
  sales: {
    asOf: '2026-08-22',
    totalRevenue: 2572100,
    monthRevenue: 1358300,
    monthDeltaPct: 42.4,
    orderCount: 76,
    monthlyTrend: [
      { label: '6/15', value: 115600 },
      { label: '6/22', value: 144500 },
      { label: '6/29', value: 173400 },
      { label: '7/06', value: 231200 },
      { label: '7/13', value: 260100 },
      { label: '7/20', value: 289000 },
      { label: '7/27', value: 346800 },
      { label: '8/03', value: 375700 },
      { label: '8/10', value: 404600 },
      { label: '8/17', value: 231200 },
    ],
    countryRevenues: [{ code: 'VN', name: '베트남', revenue: 2572100 }],
  },
};

/**
 * RPT-02-01 국가별 분석 보고서 목 (Figma 246:5130) — 국가 코드별로 값이 다르다.
 * 통관 규정은 캐릭터 인형(완구·플러시)에 실제로 적용되는 제도를 기준으로 작성했다.
 */
export const countryReportsMock: Record<CountryCode, CountryReport> = {
  VN: {
    code: 'VN',
    name: '베트남',
    currency: '₫',
    conclusion: {
      title: '소장형 프리미엄 포지션으로 판매',
      body: '베트남 Shopee에는 노브랜드 저가 인형이 많지만 한국 라이선스 캐릭터 굿즈는 드뭅니다. 가격을 낮춰 저가 상품과 경쟁하기보다, 정품·소장 가치를 앞세운 프리미엄 포지션으로 시작하는 것이 유리합니다. 만 14세 이상 소장용으로 표기하면 완구 강제 인증 대상에서 제외되어 바로 판매를 시작할 수 있습니다.',
      positioning: '소장형 프리미엄',
      priceText: '₩28,900 (₫535,000)',
      profitText: '₩8,340 / 개당',
    },
    analysis: {
      summary:
        '베트남은 K-콘텐츠 소비층이 두텁고 캐릭터 굿즈 검색량이 빠르게 늘고 있는 시장입니다. 경쟁 상품 수는 많지만 대부분 노브랜드 저가 인형이라 라이선스 굿즈와는 구매 이유가 다릅니다. 관세 0%가 적용돼 수익성도 3개국 중 가장 안정적입니다.',
      metrics: [
        { label: '수요', grade: '높음', score: 88, comment: '캐릭터 인형 검색량이 최근 1년간 꾸준히 증가함' },
        { label: '경쟁 강도', grade: '보통', score: 52, invert: true, comment: '경쟁 상품은 많지만 라이선스 굿즈 비중은 낮음' },
        { label: 'K-트렌드 적합도', grade: '높음', score: 93, comment: 'K-POP·K-드라마 팬층과 구매층이 그대로 겹침' },
        { label: '수익성', grade: '높음', score: 79, comment: 'FTA 관세 0% 적용으로 마진 확보가 가장 유리함' },
      ],
    },
    competition: {
      summary:
        '가격대가 낮은 노브랜드 인형이 시장의 절반 이상을 차지합니다. 같은 가격대로 내려가면 차별점이 사라지므로, 정품 인증과 캐릭터 세계관을 보여주는 상세 페이지로 프리미엄 구간을 잡는 편이 유리합니다.',
      stats: [
        { label: '유사 상품 수', value: '많음', tone: 'bad' },
        { label: '경쟁 강도', value: '보통' },
        { label: '주요 경쟁 유형', value: '노브랜드 저가 인형' },
        { label: '진입 난이도', value: '낮음' },
      ],
      priceTiers: [
        { label: '₩8,000 (저가형)', weight: 290 },
        { label: '₩20,000 (중간형)', weight: 190 },
        { label: '₩35,000+ (프리미엄)', weight: 87 },
      ],
      priceMarker: { label: '₩28,900 권장가', ratio: 0.74 },
      table: [
        { type: '저가형', priceRange: '₩5,000~12,000', strength: '가격이 매우 낮음', weakness: '원단·마감 편차가 큼', strategy: '정품·원단 품질 강조' },
        { type: '중간형', priceRange: '₩12,000~30,000', strength: '사이즈 선택 가능', weakness: '캐릭터 정체성 없음', strategy: '캐릭터 세계관 스토리텔링' },
        { type: '고가형', priceRange: '₩30,000 이상', strength: '라이선스 정품', weakness: '가격 부담 큼', strategy: '수집·선물 수요 공략' },
      ],
    },
    shipping: {
      options: [
        {
          id: 'direct',
          name: '직접 배송',
          costText: 'USD 2.9/unit',
          periodText: '8~14일',
          fitBadge: '소량 판매에 적합',
          recommended: false,
          description:
            '항공소포로 직접 발송합니다. 개당 비용은 낮지만 배송 기간이 길고 추적이 제한적이라, 초기 소량 판매에 적합합니다.',
        },
        {
          id: 'sls',
          name: 'Shopee SLS',
          costText: 'USD 3.9/unit',
          periodText: '4~7일',
          fitBadge: '대량 판매에 적합',
          recommended: true,
          description:
            'Shopee 물류망을 이용해 주문·송장·배송 추적이 자동 연동됩니다. 인형처럼 부피 대비 가벼운 상품은 부피 무게가 적용되므로, 압축 포장 시 비용을 더 낮출 수 있습니다.',
        },
      ],
      warnings: [
        '만 16세 미만 아동용 완구로 표기해 판매하면 수입 전 국가기술표준 적합성 인증(CR 마크)을 받아야 합니다. 만 14세 이상 소장용으로 표기하면 대상에서 제외됩니다. (근거: 베트남 과학기술부 QCVN 3:2019/BKHCN 아동용 완구 안전 기술규정)',
        '수입 상품에는 상품명·원산지·수입자·소재를 표기한 베트남어 보조 라벨(nhãn phụ) 부착이 의무이며, 미부착 시 통관이 보류될 수 있습니다. (근거: 상품 라벨 표시 시행령 Nghị định 43/2017/NĐ-CP)',
        '한-베트남 FTA 원산지증명서(C/O Form VK)를 첨부하면 관세 0%가 적용되고, 미첨부 시 MFN 세율로 과세됩니다. 아래 마진 계산은 원산지증명서 첨부를 전제로 합니다. (근거: 한-베트남 FTA 협정문 원산지 규정)',
      ],
    },
    packaging: { width: 24, depth: 20, height: 16 },
    pricing: {
      scenarios: [
        {
          id: 'low',
          label: 'Low',
          price: 22000,
          priceLocalText: '₫407,000',
          netProfit: 1940,
          marginRate: 8.8,
          breakevenUnits: 1031,
          badge: '수익 낮음',
          summary:
            '₩22,000에 판매하면 중간형 구간에 들어가 노출은 늘지만, 상품 1개당 남는 순이익이 약 ₩1,940에 그칩니다. 반품이 한 건만 발생해도 그 주 이익이 사라지는 수준입니다.',
          costRows: [
            { label: '판매가', amountText: '+₩22,000', emphasis: true },
            { label: '공급 원가', amountText: '-₩11,500' },
            { label: 'Shopee 수수료 (7.2%)', amountText: '-₩1,580' },
            { label: '국제 배송비 (SLS)', amountText: '-₩5,300' },
            { label: '관세 (0% · 한-베 FTA)', amountText: '-₩0' },
            { label: '수입 VAT (10% · CIF 기준)', amountText: '-₩1,680' },
            { label: '예상 순이익', amountText: '₩1,940', emphasis: true },
          ],
        },
        {
          id: 'mid',
          label: '추천 (Mid)',
          price: 28900,
          priceLocalText: '₫535,000',
          netProfit: 8340,
          marginRate: 28.9,
          breakevenUnits: 240,
          badge: '추천',
          recommended: true,
          summary:
            '₩28,900에 판매하면 국제 배송비·Shopee 수수료·수입 VAT를 모두 제외하고 상품 1개당 약 ₩8,340이 남습니다. 프리미엄 구간 하단이라 정품 가치를 지키면서도 구매 저항이 크지 않은 지점입니다.',
          costRows: [
            { label: '판매가', amountText: '+₩28,900', emphasis: true },
            { label: '공급 원가', amountText: '-₩11,500' },
            { label: 'Shopee 수수료 (7.2%)', amountText: '-₩2,080' },
            { label: '국제 배송비 (SLS)', amountText: '-₩5,300' },
            { label: '관세 (0% · 한-베 FTA)', amountText: '-₩0' },
            { label: '수입 VAT (10% · CIF 기준)', amountText: '-₩1,680' },
            { label: '예상 순이익', amountText: '₩8,340', emphasis: true },
          ],
        },
        {
          id: 'high',
          label: 'High',
          price: 38000,
          priceLocalText: '₫703,000',
          netProfit: 16780,
          marginRate: 44.2,
          breakevenUnits: 120,
          badge: '수익 높지만 구매 부담',
          summary:
            '₩38,000은 현지 프리미엄 구간의 상단입니다. 순이익은 가장 크지만 이 가격대 상품 수 자체가 적어, 초기 리뷰가 쌓이기 전에는 전환율이 크게 떨어질 수 있습니다.',
          costRows: [
            { label: '판매가', amountText: '+₩38,000', emphasis: true },
            { label: '공급 원가', amountText: '-₩11,500' },
            { label: 'Shopee 수수료 (7.2%)', amountText: '-₩2,740' },
            { label: '국제 배송비 (SLS)', amountText: '-₩5,300' },
            { label: '관세 (0% · 한-베 FTA)', amountText: '-₩0' },
            { label: '수입 VAT (10% · CIF 기준)', amountText: '-₩1,680' },
            { label: '예상 순이익', amountText: '₩16,780', emphasis: true },
          ],
        },
      ],
      appliedBadges: ['관세 반영', '수입 VAT 반영', '배송비 반영', 'Shopee 수수료 반영', '환율 반영'],
    },
  },
  SG: {
    code: 'SG',
    name: '싱가포르',
    currency: 'S$',
    conclusion: {
      title: '선물형 포지션으로 판매',
      body: '싱가포르는 구매력이 높고 무관세 시장이라 객단가를 올리기 좋습니다. 다만 시장 규모가 작고 글로벌 캐릭터 브랜드와 정면으로 경쟁하게 되므로, 인형 단품보다 선물 포장·메시지 카드를 묶은 구성으로 차별화하는 편이 유리합니다.',
      positioning: '선물형',
      priceText: '₩33,500 (S$28.90)',
      profitText: '₩10,970 / 개당',
    },
    analysis: {
      summary:
        '싱가포르는 1인당 구매력이 3개국 중 가장 높아 프리미엄·선물 수요를 노리기 좋습니다. 다만 산리오·디즈니 등 글로벌 라이선스 굿즈가 이미 자리를 잡고 있어, 캐릭터 인지도만으로는 경쟁이 어렵습니다.',
      metrics: [
        { label: '수요', grade: '보통', score: 64, comment: '시장 규모는 작지만 객단가가 높아 건당 수익이 큼' },
        { label: '경쟁 강도', grade: '높음', score: 78, invert: true, comment: '글로벌 캐릭터 라이선스 굿즈와 직접 경쟁함' },
        { label: 'K-트렌드 적합도', grade: '높음', score: 85, comment: 'K-콘텐츠 소비층이 두터워 마케팅 활용이 가능함' },
        { label: '수익성', grade: '높음', score: 81, comment: '무관세 구조로 개당 순이익이 가장 큼' },
      ],
    },
    competition: {
      summary:
        '유사 상품 수 자체는 많지 않지만 브랜드 경쟁이 치열합니다. 가격보다 패키지 완성도와 선물 수요를 공략하는 것이 유리합니다.',
      stats: [
        { label: '유사 상품 수', value: '보통' },
        { label: '경쟁 강도', value: '높음', tone: 'bad' },
        { label: '주요 경쟁 유형', value: '글로벌 라이선스 굿즈' },
        { label: '진입 난이도', value: '다소 높음' },
      ],
      priceTiers: [
        { label: '₩15,000 (저가형)', weight: 120 },
        { label: '₩30,000 (중간형)', weight: 260 },
        { label: '₩50,000+ (프리미엄)', weight: 150 },
      ],
      priceMarker: { label: '₩33,500 권장가', ratio: 0.55 },
      table: [
        { type: '저가형', priceRange: '₩12,000~20,000', strength: '가격이 낮음', weakness: '브랜드 신뢰 낮음', strategy: '정품 인증·리뷰 강조' },
        { type: '중간형', priceRange: '₩20,000~45,000', strength: '브랜드 인지도', weakness: '구성이 단조로움', strategy: '선물 패키지로 차별화' },
        { type: '고가형', priceRange: '₩45,000 이상', strength: '수집가치 높음', weakness: '가격 부담 큼', strategy: '한정판·시리즈 구성' },
      ],
    },
    shipping: {
      options: [
        {
          id: 'direct',
          name: '직접 배송',
          costText: 'USD 3.1/unit',
          periodText: '5~9일',
          fitBadge: '소량 판매에 적합',
          recommended: false,
          description: '발송 채널을 직접 선택할 수 있어 소량 판매 시 비용 관리가 쉽습니다.',
        },
        {
          id: 'sls',
          name: 'Shopee SLS',
          costText: 'USD 4.1/unit',
          periodText: '3~5일',
          fitBadge: '대량 판매에 적합',
          recommended: true,
          description:
            '통관 절차가 간소한 싱가포르 특성상 SLS 연동 시 배송 관리 부담이 3개국 중 가장 낮습니다.',
        },
      ],
      warnings: [
        'S$400 이하 저가 수입품(Low-Value Goods)도 GST 9% 부과 대상이며, 셀러가 판매가에 포함해 징수·신고해야 합니다. (근거: 싱가포르 국세청 IRAS Low-Value Goods GST 제도)',
        '완구는 소비자 상품 안전 요건(CGSR) 적용 대상으로, 안전 표준 적합성을 입증할 자료를 보관해야 합니다. (근거: Consumer Protection (Consumer Goods Safety Requirements) Regulations)',
        'Shopee SG는 상품 페이지에 원산지 표기를 요구하며, 미표기 시 상품이 비활성화될 수 있습니다. (근거: Shopee Singapore 셀러 상품 등록 정책)',
      ],
    },
    packaging: { width: 24, depth: 20, height: 16 },
    pricing: {
      scenarios: [
        {
          id: 'low',
          label: 'Low',
          price: 27000,
          priceLocalText: 'S$23.30',
          netProfit: 5530,
          marginRate: 20.5,
          breakevenUnits: 362,
          badge: '수익 낮음',
          summary:
            '₩27,000은 현지 중간형 구간 하단입니다. 진입은 쉽지만 선물 수요를 잡기에는 가격이 낮아 브랜드 인상이 약해집니다.',
          costRows: [
            { label: '판매가', amountText: '+₩27,000', emphasis: true },
            { label: '공급 원가', amountText: '-₩11,500' },
            { label: 'Shopee 수수료 (7.2%)', amountText: '-₩1,940' },
            { label: '국제 배송비 (SLS)', amountText: '-₩5,600' },
            { label: '관세 (0%)', amountText: '-₩0' },
            { label: 'GST (9% · 판매가 기준)', amountText: '-₩2,430' },
            { label: '예상 순이익', amountText: '₩5,530', emphasis: true },
          ],
        },
        {
          id: 'mid',
          label: '추천 (Mid)',
          price: 33500,
          priceLocalText: 'S$28.90',
          netProfit: 10970,
          marginRate: 32.7,
          breakevenUnits: 183,
          badge: '추천',
          recommended: true,
          summary:
            '₩33,500에 판매하면 GST·국제 배송비·Shopee 수수료를 모두 제외하고 상품 1개당 약 ₩10,970이 남습니다. 무관세 구조 덕분에 3개국 중 개당 순이익이 가장 큽니다.',
          costRows: [
            { label: '판매가', amountText: '+₩33,500', emphasis: true },
            { label: '공급 원가', amountText: '-₩11,500' },
            { label: 'Shopee 수수료 (7.2%)', amountText: '-₩2,410' },
            { label: '국제 배송비 (SLS)', amountText: '-₩5,600' },
            { label: '관세 (0%)', amountText: '-₩0' },
            { label: 'GST (9% · 판매가 기준)', amountText: '-₩3,020' },
            { label: '예상 순이익', amountText: '₩10,970', emphasis: true },
          ],
        },
        {
          id: 'high',
          label: 'High',
          price: 42000,
          priceLocalText: 'S$36.20',
          netProfit: 18100,
          marginRate: 43.1,
          breakevenUnits: 111,
          badge: '수익 높지만 구매 부담',
          summary:
            '₩42,000은 프리미엄 구간입니다. 선물 포장을 포함한 구성이라면 방어 가능하지만, 단품으로는 글로벌 브랜드와 같은 가격대에서 경쟁하게 됩니다.',
          costRows: [
            { label: '판매가', amountText: '+₩42,000', emphasis: true },
            { label: '공급 원가', amountText: '-₩11,500' },
            { label: 'Shopee 수수료 (7.2%)', amountText: '-₩3,020' },
            { label: '국제 배송비 (SLS)', amountText: '-₩5,600' },
            { label: '관세 (0%)', amountText: '-₩0' },
            { label: 'GST (9% · 판매가 기준)', amountText: '-₩3,780' },
            { label: '예상 순이익', amountText: '₩18,100', emphasis: true },
          ],
        },
      ],
      appliedBadges: ['관세 반영', 'GST 반영', '배송비 반영', 'Shopee 수수료 반영', '환율 반영'],
    },
  },
  TH: {
    code: 'TH',
    name: '태국',
    currency: '฿',
    conclusion: {
      title: '인증 취득 후 진입 권장',
      body: '태국은 3개국 중 K-캐릭터 굿즈 수요가 가장 높지만, 완구가 태국산업표준원(TISI) 강제 인증 품목이라 인증 없이는 통관 자체가 불가능합니다. 인증에 통상 8~12주가 걸리므로 지금 바로 판매를 시작할 수는 없고, 베트남에서 반응을 확인하는 동안 인증 절차를 병행하는 순서를 권장합니다.',
      positioning: '입문형',
      priceText: '₩27,500 (฿705)',
      profitText: '₩7,760 / 개당',
    },
    analysis: {
      summary:
        '태국은 K-POP 팬덤이 두터워 캐릭터 굿즈 수요가 3개국 중 가장 높습니다. 다만 저가 경쟁이 심하고, 완구 강제 인증이라는 시간 장벽이 있어 첫 진입 국가로는 적합하지 않습니다.',
      metrics: [
        { label: '수요', grade: '높음', score: 90, comment: 'K-POP 팬덤 기반 굿즈 수요가 3개국 중 가장 큼' },
        { label: '경쟁 강도', grade: '높음', score: 74, invert: true, comment: '저가 인형 물량이 많아 가격 방어가 필요함' },
        { label: 'K-트렌드 적합도', grade: '높음', score: 95, comment: 'K-콘텐츠 선호도가 3개국 중 가장 높음' },
        { label: '수익성', grade: '보통', score: 61, comment: '마진은 확보되나 인증 취득 비용·기간이 초기 부담임' },
      ],
    },
    competition: {
      summary:
        '유사 상품 수가 많고 저가형이 주류입니다. 가격 경쟁 대신 정품 라이선스와 K-트렌드 인지도를 활용한 신뢰 확보가 유리합니다.',
      stats: [
        { label: '유사 상품 수', value: '많음', tone: 'bad' },
        { label: '경쟁 강도', value: '높음', tone: 'bad' },
        { label: '주요 경쟁 유형', value: '저가형 중심' },
        { label: '진입 난이도', value: '높음', tone: 'bad' },
      ],
      priceTiers: [
        { label: '₩6,000 (저가형)', weight: 310 },
        { label: '₩18,000 (중간형)', weight: 180 },
        { label: '₩32,000+ (프리미엄)', weight: 78 },
      ],
      priceMarker: { label: '₩27,500 권장가', ratio: 0.78 },
      table: [
        { type: '저가형', priceRange: '₩4,000~10,000', strength: '가격이 매우 낮음', weakness: '품질 편차 큼', strategy: '정품·품질 보증 강조' },
        { type: '중간형', priceRange: '₩10,000~28,000', strength: '구성이 다양함', weakness: '브랜드 정체성 약함', strategy: 'K-트렌드 스토리텔링' },
        { type: '고가형', priceRange: '₩28,000 이상', strength: '팬덤 충성도', weakness: '가격 부담 큼', strategy: '한정판·희소성 소구' },
      ],
    },
    shipping: {
      options: [
        {
          id: 'direct',
          name: '직접 배송',
          costText: 'USD 2.7/unit',
          periodText: '6~10일',
          fitBadge: '소량 판매에 적합',
          recommended: false,
          description: '발송 채널을 직접 선택할 수 있어 소량 판매 시 비용 관리가 쉽습니다.',
        },
        {
          id: 'sls',
          name: 'Shopee SLS',
          costText: 'USD 3.8/unit',
          periodText: '4~6일',
          fitBadge: '대량 판매에 적합',
          recommended: true,
          description:
            '판매량이 많은 태국 시장 특성상 SLS 연동 시 주문·배송 처리 부담이 크게 줄어듭니다.',
        },
      ],
      warnings: [
        '완구는 태국산업표준원(TISI) 강제 인증 품목으로, 인증 없이는 통관과 판매가 불가능합니다. 취득에 통상 8~12주가 소요되므로 진입 일정에 반영해야 합니다. (근거: 태국산업표준원 강제 표준 TIS 685-2540 완구 안전 기준)',
        '한-아세안 FTA 원산지증명서(C/O Form AK)를 첨부하면 관세 0%가 적용됩니다. 아래 마진 계산은 원산지증명서 첨부를 전제로 합니다. (근거: 한-아세안 FTA 협정문 원산지 규정)',
        '상품 라벨과 상세설명에 태국어 표기가 필요하며, 소비자 분쟁 발생 시 태국어 표기를 기준으로 판정합니다. (근거: 태국 소비자보호위원회 상품 라벨 표시 규정)',
      ],
    },
    packaging: { width: 24, depth: 20, height: 16 },
    pricing: {
      scenarios: [
        {
          id: 'low',
          label: 'Low',
          price: 21500,
          priceLocalText: '฿550',
          netProfit: 2190,
          marginRate: 10.2,
          breakevenUnits: 914,
          badge: '수익 낮음',
          summary:
            '₩21,500은 현지 중간형 구간입니다. 노출에는 유리하지만 개당 ₩2,190만 남아 인증 취득 비용을 회수하는 데 오래 걸립니다.',
          costRows: [
            { label: '판매가', amountText: '+₩21,500', emphasis: true },
            { label: '공급 원가', amountText: '-₩11,500' },
            { label: 'Shopee 수수료 (7.2%)', amountText: '-₩1,550' },
            { label: '국제 배송비 (SLS)', amountText: '-₩5,100' },
            { label: '관세 (0% · 한-아세안 FTA)', amountText: '-₩0' },
            { label: '수입 VAT (7% · CIF 기준)', amountText: '-₩1,160' },
            { label: '예상 순이익', amountText: '₩2,190', emphasis: true },
          ],
        },
        {
          id: 'mid',
          label: '추천 (Mid)',
          price: 27500,
          priceLocalText: '฿705',
          netProfit: 7760,
          marginRate: 28.2,
          breakevenUnits: 258,
          badge: '추천',
          recommended: true,
          summary:
            '₩27,500에 판매하면 국제 배송비·Shopee 수수료·수입 VAT를 모두 제외하고 상품 1개당 약 ₩7,760이 남습니다. 저가 경쟁을 피하면서 팬덤 수요를 잡을 수 있는 구간입니다.',
          costRows: [
            { label: '판매가', amountText: '+₩27,500', emphasis: true },
            { label: '공급 원가', amountText: '-₩11,500' },
            { label: 'Shopee 수수료 (7.2%)', amountText: '-₩1,980' },
            { label: '국제 배송비 (SLS)', amountText: '-₩5,100' },
            { label: '관세 (0% · 한-아세안 FTA)', amountText: '-₩0' },
            { label: '수입 VAT (7% · CIF 기준)', amountText: '-₩1,160' },
            { label: '예상 순이익', amountText: '₩7,760', emphasis: true },
          ],
        },
        {
          id: 'high',
          label: 'High',
          price: 35000,
          priceLocalText: '฿900',
          netProfit: 14720,
          marginRate: 42.1,
          breakevenUnits: 136,
          badge: '수익 높지만 구매 부담',
          summary:
            '₩35,000은 현지 프리미엄 구간입니다. 순이익은 크지만 저가 중심 시장이라 구매 전환율이 크게 낮아질 수 있습니다.',
          costRows: [
            { label: '판매가', amountText: '+₩35,000', emphasis: true },
            { label: '공급 원가', amountText: '-₩11,500' },
            { label: 'Shopee 수수료 (7.2%)', amountText: '-₩2,520' },
            { label: '국제 배송비 (SLS)', amountText: '-₩5,100' },
            { label: '관세 (0% · 한-아세안 FTA)', amountText: '-₩0' },
            { label: '수입 VAT (7% · CIF 기준)', amountText: '-₩1,160' },
            { label: '예상 순이익', amountText: '₩14,720', emphasis: true },
          ],
        },
      ],
      appliedBadges: ['관세 반영', '수입 VAT 반영', '배송비 반영', 'Shopee 수수료 반영', '환율 반영'],
    },
  },
};
