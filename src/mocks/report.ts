import type { CountryCode } from '@/types/product';
import type { CountryReport, TotalReport } from '@/types/report';

/**
 * RPT-01-01 전체 분석 보고서 목 (Figma 576:6776)
 * - 국가 순위·추천가는 오케스트레이터 결과 종합(R-000-04) 산출값 가정
 * - sales는 주문 집계(R-006-08) — 판매 중 국가가 없으면 페이지에서 섹션 미렌더
 */
export const totalReportMock: TotalReport = {
  conclusionTitle: '베트남 우선 진입을 추천합니다.',
  conclusionBody:
    '이 상품은 동남아 Shopee 시장에서 테스트 판매를 시작하기에 적합한 제품입니다. 가격 부담이 낮고 일상용 수요가 넓어 초기 판매 검증에 유리합니다.',
  metrics: [
    { label: '수요', grade: '높음', score: 87 },
    { label: '경쟁 강도', grade: '낮음', score: 34, invert: true },
    { label: 'K-트렌드 적합도', grade: '높음', score: 82 },
    { label: '수익성', grade: '보통', score: 71 },
  ],
  countries: [
    { code: 'VN', rank: 1, fitGrade: '매우 적합', priceLocalText: '₫535,000', priceKrw: 28900 },
    { code: 'SG', rank: 2, fitGrade: '일부 적합', priceLocalText: 'S$28.40', priceKrw: 29800 },
    { code: 'TH', rank: 3, fitGrade: '유의', priceLocalText: '฿705', priceKrw: 27500 },
  ],
  investigation: {
    summary:
      '입력된 상품 정보를 바탕으로 베트남, 싱가포르, 태국 3개 국가의 Shopee 시장을 비교 분석했습니다.',
    countries: ['베트남', '싱가포르', '태국'],
    criteria: ['수요', '경쟁 강도', 'K-트렌드 적합도', '수익성'],
    platforms: ['Shopee'],
  },
  nextAction:
    '우선 베트남 시장을 기준으로 상세페이지를 생성한 뒤, 초기 반응을 확인하는 것을 추천합니다. 이후 싱가포르와 태국은 상품명, 가격, 상세페이지 메시지를 일부 조정하며 순차적으로 확장하는 방식이 적합합니다.',
  sales: {
    asOf: '2026-07-31',
    totalRevenue: 1284000,
    monthRevenue: 420000,
    monthDeltaPct: 12.5,
    orderCount: 42,
    monthlyTrend: [
      { label: '2월', value: 98000 },
      { label: '3월', value: 142000 },
      { label: '4월', value: 186000 },
      { label: '5월', value: 205000 },
      { label: '6월', value: 253000 },
      { label: '7월', value: 420000 },
    ],
    countryRevenues: [
      { code: 'TH', name: '태국', revenue: 642000 },
      { code: 'SG', name: '싱가포르', revenue: 402000 },
      { code: 'VN', name: '베트남', revenue: 240000 },
    ],
  },
};

/**
 * RPT-02-01 국가별 분석 보고서 목 (Figma 246:5130) — 국가 코드별로 값이 다르다.
 * 관세·VAT율은 국가별 Fee Schedule 가정 (VN 6%/10%, SG 0%/GST 9%, TH 10%/7%)
 */
export const countryReportsMock: Record<CountryCode, CountryReport> = {
  VN: {
    code: 'VN',
    name: '베트남',
    currency: '₫',
    conclusion: {
      title: '프리미엄형 포지션으로 판매',
      body: '베트남은 K-상품에 대한 관심이 높고, 가격 부담이 낮아 첫 구매를 유도하기 좋습니다. 프리미엄형 포지션으로 테스트 판매를 시작하는 것이 적합합니다.',
      positioning: '프리미엄형',
      priceText: '₩28,900 (₫535,000)',
      profitText: '₩7,200 / 개당',
    },
    analysis: {
      summary:
        '베트남은 K-상품 수요가 높고 호감도가 높은 시장입니다. 수요, 경쟁 강도, K-트렌드 적합도, 수익성 모두 안정 구간으로, 담대한 시장 진입이 가능합니다.',
      metrics: [
        { label: '수요', grade: '높음', score: 87, comment: '수요가 높아 상품이 팔릴 가능성이 높음' },
        { label: '경쟁 강도', grade: '보통', score: 58, invert: true, comment: '경쟁 강도가 보통 수준으로 진입 부담이 크지 않음' },
        { label: 'K-트렌드 적합도', grade: '높음', score: 84, comment: 'K-트렌드 상품으로서 인지도 활용이 가능함' },
        { label: '수익성', grade: '보통', score: 71, comment: '중간 수준 이상의 마진 확보가 가능함' },
      ],
    },
    competition: {
      summary:
        '타 제품 대비 유사 상품 수는 많은 편입니다. 가격 경쟁보다는 사용 장면을 강조하여 프리미엄 이미지를 형성하는 것이 유리합니다.',
      stats: [
        { label: '유사 상품 수', value: '많음', tone: 'bad' },
        { label: '경쟁 강도', value: '보통' },
        { label: '주요 경쟁 유형', value: '저가형·소형 중심' },
        { label: '진입 난이도', value: '중간' },
      ],
      priceTiers: [
        { label: '₩5,000 (저가형)', weight: 162 },
        { label: '₩10,000 (중간형)', weight: 243 },
        { label: '₩30,000+ (프리미엄)', weight: 162 },
      ],
      priceMarker: { label: '₩28,900 권장가', ratio: 0.67 },
      table: [
        { type: '저가형', priceRange: '₩5,000~10,000', strength: '가격이 낮음', weakness: '품질 신뢰 낮음', strategy: '품질·신뢰 강조' },
        { type: '중간형', priceRange: '₩10,000~30,000', strength: '휴대성 좋음', weakness: '차별화 약함', strategy: '사용 장면 중심 페이지' },
        { type: '고가형', priceRange: '₩30,000 이상', strength: '신뢰도 높음', weakness: '가격 부담 큼', strategy: '가성비+디자인 강조' },
      ],
    },
    shipping: {
      options: [
        {
          id: 'direct',
          name: '직접 배송',
          costText: 'USD 4.5/unit',
          periodText: '7~12일',
          fitBadge: '소량 판매에 적합',
          recommended: false,
          description: '발송 채널을 직접 선택할 수 있어 소량 판매 시 비용 관리가 쉽습니다.',
        },
        {
          id: 'sls',
          name: 'Shopee SLS',
          costText: 'USD 6.8/unit',
          periodText: '4~7일',
          fitBadge: '대량 판매에 적합',
          recommended: true,
          description: '초기 테스트 판매에 적합하며, Shopee 주문 시스템과 연동하기 쉬워 배송 관리 부담이 낮습니다.',
        },
      ],
      warnings: [
        '관세법에 따라 $250 초과 상품은 세관신고서 포함이 필수이며, 현지 관세 및 부가세가 발생할 수 있습니다. (근거: 베트남 관세법 제16조)',
        '상세설명에 베트남어가 반드시 포함되어야 하며, 현지 규정 미준수 시 반품 처리될 수 있습니다. (근거: 베트남 전자상거래법 시행령 52/2013)',
        'Shopee 이용약관에 따른 상품 신고 책임과 현지 거래세(VAT) 신고 의무가 있습니다. (근거: Shopee VN 셀러 정책 4.2)',
      ],
    },
    packaging: { width: 12, depth: 12, height: 8 },
    pricing: {
      scenarios: [
        {
          id: 'low',
          label: 'Low',
          price: 22000,
          priceLocalText: '₫407,000',
          netProfit: 2700,
          marginRate: 12.3,
          breakevenUnits: 1820,
          badge: '수익 낮음',
          summary:
            '₩22,000에 판매할 경우, 진입 장벽은 낮지만 상품 1개당 약 ₩2,700의 순이익만 남아 물량 확보가 필요합니다.',
          costRows: [
            { label: '판매가', amountText: '+₩22,000', emphasis: true },
            { label: '공급 원가', amountText: '-₩12,800' },
            { label: 'Shopee 수수료', amountText: '-₩1,400' },
            { label: '국제 배송비', amountText: '-₩3,400' },
            { label: '관세 (6%)', amountText: '-₩700' },
            { label: 'VAT (10%)', amountText: '-₩1,000' },
            { label: '예상 순이익', amountText: '₩2,700', emphasis: true },
          ],
        },
        {
          id: 'mid',
          label: '추천 (Mid)',
          price: 28900,
          priceLocalText: '₫535,000',
          netProfit: 7200,
          marginRate: 24.9,
          breakevenUnits: 1150,
          badge: '추천',
          recommended: true,
          summary:
            '₩28,900에 판매할 경우, 관세·현지 부가세·국제 배송비·Shopee 수수료를 모두 제외하고 상품 1개당 약 ₩7,200의 순이익이 예상됩니다.',
          costRows: [
            { label: '판매가', amountText: '+₩28,900', emphasis: true },
            { label: '공급 원가', amountText: '-₩12,800' },
            { label: 'Shopee 수수료', amountText: '-₩2,100' },
            { label: '국제 배송비', amountText: '-₩3,400' },
            { label: '관세 (6%)', amountText: '-₩1,200' },
            { label: 'VAT (10%)', amountText: '-₩2,200' },
            { label: '예상 순이익', amountText: '₩7,200', emphasis: true },
          ],
        },
        {
          id: 'high',
          label: 'High',
          price: 38000,
          priceLocalText: '₫703,000',
          netProfit: 14400,
          marginRate: 38.0,
          breakevenUnits: 760,
          badge: '수익 높지만 구매 부담',
          summary:
            '₩38,000에 판매할 경우 순이익은 크지만 현지 경쟁가 밴드 상단을 넘어 구매 저항이 발생할 수 있습니다.',
          costRows: [
            { label: '판매가', amountText: '+₩38,000', emphasis: true },
            { label: '공급 원가', amountText: '-₩12,800' },
            { label: 'Shopee 수수료', amountText: '-₩2,800' },
            { label: '국제 배송비', amountText: '-₩3,400' },
            { label: '관세 (6%)', amountText: '-₩1,600' },
            { label: 'VAT (10%)', amountText: '-₩3,000' },
            { label: '예상 순이익', amountText: '₩14,400', emphasis: true },
          ],
        },
      ],
      appliedBadges: ['관세 반영', 'VAT 반영', '배송비 반영', 'Shopee 수수료 반영', '환율 반영'],
    },
  },
  SG: {
    code: 'SG',
    name: '싱가포르',
    currency: 'S$',
    conclusion: {
      title: '선물형 포지션으로 판매',
      body: '싱가포르는 구매력이 높고 무관세 시장이라 객단가를 높이기 유리합니다. 브랜드 경쟁이 치열하므로 선물형 포지션으로 차별화하는 것이 적합합니다.',
      positioning: '선물형',
      priceText: '₩29,800 (S$28.40)',
      profitText: '₩7,900 / 개당',
    },
    analysis: {
      summary:
        '싱가포르는 구매력이 높아 프리미엄·선물 수요를 노리기 좋은 시장입니다. 다만 글로벌 브랜드 경쟁이 치열해 차별화 포인트가 분명해야 합니다.',
      metrics: [
        { label: '수요', grade: '보통', score: 66, comment: '시장 규모는 작지만 구매력이 높아 객단가에 유리함' },
        { label: '경쟁 강도', grade: '높음', score: 78, invert: true, comment: '글로벌 브랜드 경쟁이 치열해 차별화가 필요함' },
        { label: 'K-트렌드 적합도', grade: '높음', score: 81, comment: 'K-콘텐츠 소비층이 두터워 마케팅 활용이 가능함' },
        { label: '수익성', grade: '높음', score: 83, comment: '무관세 구조로 마진 확보에 유리함' },
      ],
    },
    competition: {
      summary:
        '유사 상품 수는 보통이지만 브랜드 경쟁이 치열합니다. 가격보다 패키지 완성도와 선물 수요를 공략하는 것이 유리합니다.',
      stats: [
        { label: '유사 상품 수', value: '보통' },
        { label: '경쟁 강도', value: '높음', tone: 'bad' },
        { label: '주요 경쟁 유형', value: '중간형·브랜드 중심' },
        { label: '진입 난이도', value: '다소 높음' },
      ],
      priceTiers: [
        { label: '₩10,000 (저가형)', weight: 132 },
        { label: '₩20,000 (중간형)', weight: 268 },
        { label: '₩40,000+ (프리미엄)', weight: 168 },
      ],
      priceMarker: { label: '₩29,800 권장가', ratio: 0.58 },
      table: [
        { type: '저가형', priceRange: '₩8,000~15,000', strength: '가격이 낮음', weakness: '브랜드 신뢰 낮음', strategy: '품질 인증·리뷰 강조' },
        { type: '중간형', priceRange: '₩15,000~35,000', strength: '브랜드 인지도', weakness: '개성 부족', strategy: 'K-감성 패키지 차별화' },
        { type: '고가형', priceRange: '₩35,000 이상', strength: '프리미엄 이미지', weakness: '가격 부담 큼', strategy: '선물 수요 공략' },
      ],
    },
    shipping: {
      options: [
        {
          id: 'direct',
          name: '직접 배송',
          costText: 'USD 5.2/unit',
          periodText: '5~9일',
          fitBadge: '소량 판매에 적합',
          recommended: false,
          description: '발송 채널을 직접 선택할 수 있어 소량 판매 시 비용 관리가 쉽습니다.',
        },
        {
          id: 'sls',
          name: 'Shopee SLS',
          costText: 'USD 7.4/unit',
          periodText: '3~5일',
          fitBadge: '대량 판매에 적합',
          recommended: true,
          description: '통관 절차가 간소한 싱가포르 특성상 SLS 연동 시 배송 관리 부담이 가장 낮습니다.',
        },
      ],
      warnings: [
        'S$400 이하 수입품도 2023년부터 GST(9%) 부과 대상입니다. 판매가에 GST를 반영해야 합니다. (근거: 싱가포르 GST Act 2023 개정)',
        '전자기기·무선기기는 IMDA 적합성 등록이 필요할 수 있습니다. (근거: IMDA Equipment Registration Framework)',
        'Shopee SG 정책상 원산지 표기가 필수이며, 미표기 시 상품이 비활성화될 수 있습니다. (근거: Shopee SG 셀러 정책 3.1)',
      ],
    },
    packaging: { width: 12, depth: 10, height: 8 },
    pricing: {
      scenarios: [
        {
          id: 'low',
          label: 'Low',
          price: 24000,
          priceLocalText: 'S$22.90',
          netProfit: 3100,
          marginRate: 12.9,
          breakevenUnits: 1540,
          badge: '수익 낮음',
          summary:
            '₩24,000에 판매할 경우, 경쟁가 밴드 하단으로 진입은 쉽지만 상품 1개당 약 ₩3,100의 순이익만 남습니다.',
          costRows: [
            { label: '판매가', amountText: '+₩24,000', emphasis: true },
            { label: '공급 원가', amountText: '-₩12,800' },
            { label: 'Shopee 수수료', amountText: '-₩1,900' },
            { label: '국제 배송비', amountText: '-₩4,100' },
            { label: '관세 (0%)', amountText: '-₩0' },
            { label: 'GST (9%)', amountText: '-₩2,100' },
            { label: '예상 순이익', amountText: '₩3,100', emphasis: true },
          ],
        },
        {
          id: 'mid',
          label: '추천 (Mid)',
          price: 29800,
          priceLocalText: 'S$28.40',
          netProfit: 7900,
          marginRate: 26.5,
          breakevenUnits: 980,
          badge: '추천',
          recommended: true,
          summary:
            '₩29,800에 판매할 경우, GST·국제 배송비·Shopee 수수료를 모두 제외하고 상품 1개당 약 ₩7,900의 순이익이 예상됩니다.',
          costRows: [
            { label: '판매가', amountText: '+₩29,800', emphasis: true },
            { label: '공급 원가', amountText: '-₩12,800' },
            { label: 'Shopee 수수료', amountText: '-₩2,300' },
            { label: '국제 배송비', amountText: '-₩4,100' },
            { label: '관세 (0%)', amountText: '-₩0' },
            { label: 'GST (9%)', amountText: '-₩2,700' },
            { label: '예상 순이익', amountText: '₩7,900', emphasis: true },
          ],
        },
        {
          id: 'high',
          label: 'High',
          price: 39500,
          priceLocalText: 'S$37.60',
          netProfit: 15200,
          marginRate: 38.5,
          breakevenUnits: 640,
          badge: '수익 높지만 구매 부담',
          summary:
            '₩39,500에 판매할 경우 순이익은 크지만 프리미엄 브랜드와 직접 경쟁하게 되어 전환율이 낮아질 수 있습니다.',
          costRows: [
            { label: '판매가', amountText: '+₩39,500', emphasis: true },
            { label: '공급 원가', amountText: '-₩12,800' },
            { label: 'Shopee 수수료', amountText: '-₩3,000' },
            { label: '국제 배송비', amountText: '-₩4,100' },
            { label: '관세 (0%)', amountText: '-₩0' },
            { label: 'GST (9%)', amountText: '-₩4,400' },
            { label: '예상 순이익', amountText: '₩15,200', emphasis: true },
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
      title: '입문형 포지션으로 판매',
      body: '태국은 K-상품 선호도가 가장 높지만 저가 경쟁이 심한 시장입니다. 부담 없는 입문형 포지션으로 회전율을 높이는 전략이 적합합니다.',
      positioning: '입문형',
      priceText: '₩27,500 (฿705)',
      profitText: '₩6,400 / 개당',
    },
    analysis: {
      summary:
        '태국은 K-트렌드 적합도가 가장 높은 시장이지만, 저가 경쟁과 관세 부담이 있어 가격·마진 설계가 중요합니다.',
      metrics: [
        { label: '수요', grade: '높음', score: 82, comment: '일상 소비 수요가 넓어 회전율이 높음' },
        { label: '경쟁 강도', grade: '높음', score: 74, invert: true, comment: '저가 경쟁이 심해 가격 방어가 필요함' },
        { label: 'K-트렌드 적합도', grade: '높음', score: 88, comment: 'K-상품 선호도가 3개국 중 가장 높음' },
        { label: '수익성', grade: '보통', score: 64, comment: '관세 부담으로 마진 관리가 필요함' },
      ],
    },
    competition: {
      summary:
        '유사 상품 수가 많고 저가형이 주류입니다. 가격 경쟁 대신 K-트렌드 인지도를 활용한 신뢰 확보가 유리합니다.',
      stats: [
        { label: '유사 상품 수', value: '많음', tone: 'bad' },
        { label: '경쟁 강도', value: '높음', tone: 'bad' },
        { label: '주요 경쟁 유형', value: '저가형 중심' },
        { label: '진입 난이도', value: '중간' },
      ],
      priceTiers: [
        { label: '₩5,000 (저가형)', weight: 210 },
        { label: '₩10,000 (중간형)', weight: 232 },
        { label: '₩30,000+ (프리미엄)', weight: 126 },
      ],
      priceMarker: { label: '₩27,500 권장가', ratio: 0.72 },
      table: [
        { type: '저가형', priceRange: '₩3,000~8,000', strength: '가격이 매우 낮음', weakness: '품질 편차 큼', strategy: '정품·품질 보증 강조' },
        { type: '중간형', priceRange: '₩8,000~25,000', strength: '구성이 다양함', weakness: '브랜드 정체성 약함', strategy: 'K-트렌드 스토리텔링' },
        { type: '고가형', priceRange: '₩25,000 이상', strength: '팬덤 충성도', weakness: '가격 부담 큼', strategy: '한정판·희소성 소구' },
      ],
    },
    shipping: {
      options: [
        {
          id: 'direct',
          name: '직접 배송',
          costText: 'USD 4.1/unit',
          periodText: '6~10일',
          fitBadge: '소량 판매에 적합',
          recommended: false,
          description: '발송 채널을 직접 선택할 수 있어 소량 판매 시 비용 관리가 쉽습니다.',
        },
        {
          id: 'sls',
          name: 'Shopee SLS',
          costText: 'USD 6.2/unit',
          periodText: '4~6일',
          fitBadge: '대량 판매에 적합',
          recommended: true,
          description: '판매량이 많은 태국 시장 특성상 SLS 연동 시 주문·배송 처리 부담이 크게 줄어듭니다.',
        },
      ],
      warnings: [
        '฿1,500 초과 수입품은 관세(평균 10%)와 VAT(7%)가 부과됩니다. (근거: 태국 관세청 고시 B.E. 2560)',
        '화장품·식품류는 태국 FDA 사전 등록이 필요하며, 미등록 시 통관이 보류될 수 있습니다. (근거: Thai FDA Notification)',
        '상세설명에 태국어 표기가 권장되며, 소비자 분쟁 시 태국어 표기 기준으로 판정됩니다. (근거: 태국 소비자보호법 제22조)',
      ],
    },
    packaging: { width: 14, depth: 10, height: 6 },
    pricing: {
      scenarios: [
        {
          id: 'low',
          label: 'Low',
          price: 21000,
          priceLocalText: '฿540',
          netProfit: 2100,
          marginRate: 10.0,
          breakevenUnits: 1900,
          badge: '수익 낮음',
          summary:
            '₩21,000에 판매할 경우, 저가 경쟁에는 유리하지만 상품 1개당 약 ₩2,100의 순이익만 남아 마진 방어가 어렵습니다.',
          costRows: [
            { label: '판매가', amountText: '+₩21,000', emphasis: true },
            { label: '공급 원가', amountText: '-₩12,800' },
            { label: 'Shopee 수수료', amountText: '-₩1,500' },
            { label: '국제 배송비', amountText: '-₩3,200' },
            { label: '관세 (10%)', amountText: '-₩800' },
            { label: 'VAT (7%)', amountText: '-₩600' },
            { label: '예상 순이익', amountText: '₩2,100', emphasis: true },
          ],
        },
        {
          id: 'mid',
          label: '추천 (Mid)',
          price: 27500,
          priceLocalText: '฿705',
          netProfit: 6400,
          marginRate: 23.3,
          breakevenUnits: 1240,
          badge: '추천',
          recommended: true,
          summary:
            '₩27,500에 판매할 경우, 관세·VAT·국제 배송비·Shopee 수수료를 모두 제외하고 상품 1개당 약 ₩6,400의 순이익이 예상됩니다.',
          costRows: [
            { label: '판매가', amountText: '+₩27,500', emphasis: true },
            { label: '공급 원가', amountText: '-₩12,800' },
            { label: 'Shopee 수수료', amountText: '-₩2,000' },
            { label: '국제 배송비', amountText: '-₩3,200' },
            { label: '관세 (10%)', amountText: '-₩1,500' },
            { label: 'VAT (7%)', amountText: '-₩1,600' },
            { label: '예상 순이익', amountText: '₩6,400', emphasis: true },
          ],
        },
        {
          id: 'high',
          label: 'High',
          price: 36000,
          priceLocalText: '฿925',
          netProfit: 12600,
          marginRate: 35.0,
          breakevenUnits: 820,
          badge: '수익 높지만 구매 부담',
          summary:
            '₩36,000에 판매할 경우 순이익은 크지만 저가 중심 시장 특성상 구매 전환율이 크게 낮아질 수 있습니다.',
          costRows: [
            { label: '판매가', amountText: '+₩36,000', emphasis: true },
            { label: '공급 원가', amountText: '-₩12,800' },
            { label: 'Shopee 수수료', amountText: '-₩2,600' },
            { label: '국제 배송비', amountText: '-₩3,200' },
            { label: '관세 (10%)', amountText: '-₩2,000' },
            { label: 'VAT (7%)', amountText: '-₩2,800' },
            { label: '예상 순이익', amountText: '₩12,600', emphasis: true },
          ],
        },
      ],
      appliedBadges: ['관세 반영', 'VAT 반영', '배송비 반영', 'Shopee 수수료 반영', '환율 반영'],
    },
  },
};
