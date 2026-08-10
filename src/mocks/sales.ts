import salesDetail1 from '@/assets/images/sales-detail-1.png';
import salesDetail2 from '@/assets/images/sales-detail-2.png';
import salesPdpMain from '@/assets/images/sales-pdp-main.png';
import salesPdpSub from '@/assets/images/sales-pdp-sub.png';

/* ─────────────────────────── SEL-01-01 판매 정보 입력 ─────────────────────────── */

export interface PriceScenario {
  id: 'low' | 'mid' | 'high';
  label: string;
  price: number;
  badge: string;
  /** 추천안 여부 — 기본 선택 */
  recommended?: boolean;
}

/** 가격 3안 (마진 메이커 R-002-05 — 경쟁가 밴드 내 3개 시나리오) */
export const priceScenariosMock: PriceScenario[] = [
  { id: 'low', label: 'Low', price: 22000, badge: '수익 낮음' },
  { id: 'mid', label: '추천 (Mid)', price: 28900, badge: '추천', recommended: true },
  { id: 'high', label: 'High', price: 38000, badge: '수익 높지만 구매 부담' },
];

/** 수익 지표 계산 기준 (목) — 관세·VAT·수수료는 판매가 비율, 배송비는 방식별 고정 */
export const marginBasisMock = {
  dutyRate: 0.08,
  vatRate: 0.07,
  shopeeFeeRate: 0.1,
  /** 손익분기 계산용 고정비 (목) */
  fixedCostKrw: 8_000_000,
  fxNote: '1 SGD = 1,160.5원',
} as const;

/** 수익 지표에 반영된 비용 뱃지 */
export const appliedCostBadgesMock = [
  '관세 반영',
  'VAT 반영',
  '배송비 반영',
  'Shopee 수수료 반영',
  '환율 반영',
] as const;

export type ShippingMethodId = 'direct' | 'sls';

export interface ShippingMethod {
  id: ShippingMethodId;
  name: string;
  cost: string;
  /** 마진 재계산에 쓰는 개당 배송비(원) */
  costKrw: number;
  period: string;
  note: string;
  aiRecommended?: boolean;
}

export const shippingMethodsMock: ShippingMethod[] = [
  {
    id: 'direct',
    name: '직접 배송',
    cost: 'USD 4.5/unit',
    costKrw: 6200,
    period: '7~12일',
    note: '소량 판매에 적합',
  },
  {
    id: 'sls',
    name: 'Shopee SLS',
    cost: 'USD 6.8/unit',
    costKrw: 9400,
    period: '4~7일',
    note: '대량 판매에 적합',
    aiRecommended: true,
  },
];

export const shippingNoticeMock =
  '※ 본 서비스는 배송을 직접 대행하지 않습니다. 상품과 판매 국가를 기준으로 권장 배송 방식을 안내하며, 실제 발송 처리는 셀러가 직접 진행해야 합니다. 선택한 배송 정보는 상세 페이지와 순이익 계산에 반영됩니다.';

export const shippingInfoNoteMock =
  '초기 테스트 판매엔 직접 배송, Shopee 주문 시스템과 연동되는 안정적 운영엔 SLS가 유리합니다.';

/** 상품 포장 정보 기본값 (처음 입력한 값이 채워짐) */
export const packagingMock = { weight: 320, width: 18, depth: 8, height: 8 } as const;

/** Shopee 카테고리 후보 (상품 등록에서 고른 카테고리가 초기값) */
export const shopeeCategoryOptionsMock = [
  { value: 'audio-speaker', label: '오디오 › 스피커 › 블루투스 스피커' },
  { value: 'beauty-skincare', label: '뷰티 › 스킨케어' },
  { value: 'beauty-makeup', label: '뷰티 › 메이크업' },
  { value: 'goods-collectible', label: '캐릭터·굿즈 › 컬렉터블' },
];

export const shopeeCategoryDefaultMock = 'audio-speaker';

export interface CategoryAttr {
  key: string;
  label: string;
  value: string;
  required?: boolean;
}

/** 카테고리 종속 필수·선택 속성 — Shopee 스키마 + AI 추천값 (목) */
export const categoryAttrsMock: CategoryAttr[] = [
  { key: 'brand', label: '브랜드', value: 'Kora', required: true },
  { key: 'model', label: '모델명', value: 'X100', required: true },
  { key: 'material', label: '소재', value: 'ABS · 패브릭' },
  { key: 'connect', label: '연결 방식', value: 'Bluetooth 5.0' },
  { key: 'origin', label: '제조국', value: '대한민국' },
  { key: 'warranty', label: '보증 기간', value: '12개월' },
];

/** 1단·2단 속성 추천값 (Shopee 제안 변형 타입, 목) */
export const optionLevel1Mock = { name: '색상', values: ['Black', 'White'] };
export const optionLevel2Mock = { name: '구성', values: ['본체만', '파우치 포함'] };

/* ─────────────────────────── 재고 (SEL·OPS 공용) ─────────────────────────── */

export interface StockRow {
  option1: string;
  option2: string;
  qty: number;
}

/** 옵션 조합별 재고 기본값 — 변경분은 useSalesOpsStore에서 관리 */
export const stockRowsMock: StockRow[] = [
  { option1: 'Black', option2: '본체만', qty: 42 },
  { option1: 'Black', option2: '파우치 포함', qty: 18 },
  { option1: 'White', option2: '본체만', qty: 7 },
  { option1: 'White', option2: '파우치 포함', qty: 0 },
];

/* ─────────────────────────── DTL-01-01 상세 페이지 ─────────────────────────── */

export interface PdpSeller {
  name: string;
  meta: string;
  rating: string;
  response: string;
  followers: string;
}

export interface PdpContent {
  breadcrumb: string[];
  name: string;
  price: string;
  usps: string[];
  shipping: { region: string; fee: string; eta: string };
  options: { label: string; values: string[] }[];
  stockNote: string;
  specs: [string, string][];
  description: string;
}

/** AI 생성 상세페이지 콘텐츠 — ko는 검수용, local(현지 언어)은 영어 텍스트 목 */
export const detailContentMock: { ko: PdpContent; local: PdpContent } = {
  ko: {
    breadcrumb: ['홈', '오디오', '스피커', '블루투스 스피커'],
    name: 'Kora X100 무선 블루투스 스피커',
    price: 'S$ 24.90',
    usps: ['무선 Bluetooth 5.0', '가볍고 휴대하기 편한 디자인', '10시간 연속 재생', 'Made in Korea'],
    shipping: { region: '싱가포르 전역 배송', fee: 'S$ 2.50 · Shopee SLS', eta: '3 ~ 5일 이내' },
    options: [
      { label: '색상', values: ['Black', 'White', 'Beige'] },
      { label: '구성', values: ['본체만', '파우치 포함'] },
    ],
    stockNote: '재고 42개 남음',
    specs: [
      ['카테고리', '오디오 › 스피커 › 블루투스 스피커'],
      ['브랜드', 'Kora'],
      ['모델', 'X100'],
      ['보증 유형', '제조사 보증'],
      ['보증 기간', '12개월'],
      ['연결 방식', 'Bluetooth 5.0'],
      ['전원', '충전식 배터리'],
      ['재생 시간', '10시간'],
      ['재고', '42개'],
      ['발송지', '대한민국 서울'],
      ['무게', '320 g'],
      ['규격', '18 × 8 × 8 cm'],
    ],
    description:
      'Kora X100은 일상에서 사용하기 좋은 포터블 무선 블루투스 스피커입니다. 가볍고 컴팩트한 디자인으로 어디든 편리하게 들고 다닐 수 있으며, 선명하고 풍부한 사운드를 제공합니다.',
  },
  local: {
    breadcrumb: ['Home', 'Audio', 'Speakers', 'Bluetooth Speakers'],
    name: 'Kora X100 Wireless Bluetooth Speaker',
    price: 'S$ 24.90',
    usps: ['Wireless Bluetooth 5.0', 'Portable & Lightweight', '10-hour Battery', 'Made in Korea'],
    shipping: { region: 'Ships across Singapore', fee: 'S$ 2.50 · Shopee SLS', eta: 'Within 3 ~ 5 days' },
    options: [
      { label: 'Color', values: ['Black', 'White', 'Beige'] },
      { label: 'Bundle', values: ['Speaker only', 'With pouch'] },
    ],
    stockNote: '42 left in stock',
    specs: [
      ['Category', 'Audio › Speakers › Bluetooth'],
      ['Brand', 'Kora'],
      ['Model', 'X100'],
      ['Warranty Type', 'Manufacturer warranty'],
      ['Warranty Period', '12 months'],
      ['Connectivity', 'Bluetooth 5.0'],
      ['Power', 'Rechargeable battery'],
      ['Playtime', '10 hours'],
      ['Stock', '42'],
      ['Ships From', 'Seoul, South Korea'],
      ['Weight', '320 g'],
      ['Dimensions', '18 × 8 × 8 cm'],
    ],
    description:
      'The Kora X100 is a portable wireless Bluetooth speaker built for everyday use. Its light, compact design travels anywhere, delivering clear and rich sound wherever you go.',
  },
};

export const pdpSellerMock: PdpSeller = {
  name: 'BlueWave_Shop',
  meta: '온라인 · 5분 이내 응답',
  rating: '4.9 / 5.0',
  response: '98%',
  followers: '12.4K',
};

export interface ProductImageItem {
  id: string;
  label: string;
  src: string;
}

/** 상품 이미지 초기 목록 — 첫 번째가 대표 이미지 */
export const productImagesMock: ProductImageItem[] = [
  { id: 'base-1', label: '기본 1', src: salesPdpMain },
  { id: 'base-2', label: '기본 2', src: salesPdpSub },
];

/** AI 생성 시 추가되는 목 이미지 소스 (기존 이미지를 레퍼런스로 새 컷 흉내) */
export const aiGeneratedImageSrcMock = salesPdpSub;

export interface DetailImageItem {
  id: string;
  label: string;
  src: string;
}

export const detailImagesMock: DetailImageItem[] = [
  { id: 'detail-1', label: '상세 이미지 1', src: salesDetail1 },
  { id: 'detail-2', label: '상세 이미지 2', src: salesDetail2 },
];

/* ─────────────────────────── OPS-01-01 판매 관리 ─────────────────────────── */

export type OrderShippingStatus = '결제 확인' | '상품 준비 중' | '발송 완료' | '배송 중' | '배송 완료';
export type OrderClaimStatus = '없음' | '접수' | '처리 중' | '완료';

export interface OrderRow {
  id: string;
  date: string;
  orderNo: string;
  option: string;
  amount: string;
  shippingStatus: OrderShippingStatus;
  claim: string;
  claimStatus: OrderClaimStatus;
}

export const orderShippingStatusOptions: OrderShippingStatus[] = [
  '결제 확인',
  '상품 준비 중',
  '발송 완료',
  '배송 중',
  '배송 완료',
];

export const orderClaimStatusOptions: OrderClaimStatus[] = ['없음', '접수', '처리 중', '완료'];

export interface PriceImpactRow {
  price: string;
  margin: string;
  impact: string;
  verdict: '테스트 가능' | '추천' | '신중';
}

export interface PriceHistoryRow {
  date: string;
  before: string;
  after: string;
}

export const salesOpsMock = {
  summary: {
    headline: '현재 판매 상태는 안정적입니다.',
    description:
      '최근 30일 동안 주문이 꾸준히 유입되고 있고, 재고 소진 속도도 무리 없는 수준입니다. 현재 가격과 배송 조건을 유지해도 좋습니다.',
    /** 최근 30일 판매 흐름 (수량) */
    trend: [
      { label: '7/13', value: 2 },
      { label: '7/16', value: 4 },
      { label: '7/19', value: 3 },
      { label: '7/22', value: 5 },
      { label: '7/25', value: 4 },
      { label: '7/28', value: 6 },
      { label: '7/31', value: 5 },
      { label: '8/3', value: 7 },
      { label: '8/6', value: 6 },
      { label: '8/9', value: 8 },
    ],
  },
  link: {
    url: 'https://shopee.sg/kora-x100-wireless-bluetooth-speaker',
    registeredAt: '2026-06-15',
    updatedAt: '2026-08-02',
    lastSync: '08-22 14:30',
  },
  orders: {
    summary: { newOrders: 3, claims: 1, needAction: 4 },
    rows: [
      {
        id: 'SG-1025',
        date: '2026-08-21',
        orderNo: 'SG-1025',
        option: 'Black · 본체만 · 1개',
        amount: 'S$ 24.90',
        shippingStatus: '상품 준비 중',
        claim: '—',
        claimStatus: '없음',
      },
      {
        id: 'SG-1024',
        date: '2026-08-20',
        orderNo: 'SG-1024',
        option: 'Black · 파우치 포함 · 2개',
        amount: 'S$ 49.80',
        shippingStatus: '발송 완료',
        claim: '—',
        claimStatus: '없음',
      },
      {
        id: 'SG-1023',
        date: '2026-08-18',
        orderNo: 'SG-1023',
        option: 'White · 본체만 · 1개',
        amount: 'S$ 24.90',
        shippingStatus: '배송 중',
        claim: '반품 요청',
        claimStatus: '접수',
      },
      {
        id: 'SG-1022',
        date: '2026-08-16',
        orderNo: 'SG-1022',
        option: 'Black · 본체만 · 1개',
        amount: 'S$ 24.90',
        shippingStatus: '배송 완료',
        claim: '—',
        claimStatus: '없음',
      },
      {
        id: 'SG-1021',
        date: '2026-08-15',
        orderNo: 'SG-1021',
        option: 'White · 파우치 포함 · 1개',
        amount: 'S$ 27.90',
        shippingStatus: '배송 완료',
        claim: '교환 요청',
        claimStatus: '처리 중',
      },
    ] as OrderRow[],
  },
  /** 판매량 추이 (금액 아님, 수량 기준 — 재고 소진 속도 가늠 용도) */
  salesTrend: [
    { label: '7월 1주', value: 9 },
    { label: '7월 2주', value: 12 },
    { label: '7월 3주', value: 10 },
    { label: '7월 4주', value: 15 },
    { label: '8월 1주', value: 13 },
    { label: '8월 2주', value: 18 },
    { label: '8월 3주', value: 16 },
  ],
  /** 판매 성과 (최근 30일) */
  performance: {
    qty: '128개',
    revenue: '₩2,052,000',
    bepRemaining: '77개 남음',
    profit: '₩698,200',
    margin: '34.2%',
    /** 성과 진단 한 줄 (코파일럿 R-005-06) */
    note: '최근 30일 판매량이 손익분기 구간에 근접했습니다. 현재 가격·배송 조건을 유지해도 마진 방어가 가능합니다.',
    /** 월간 매출·수익 추이 (금액 기준, 매출 대비 순이익 병렬 표기) */
    monthlyRevenue: [
      { label: '1월', revenue: 980_000, profit: 264_000 },
      { label: '2월', revenue: 1_142_000, profit: 312_000 },
      { label: '3월', revenue: 1_286_000, profit: 402_000 },
      { label: '4월', revenue: 1_205_000, profit: 368_000 },
      { label: '5월', revenue: 1_530_000, profit: 486_000 },
      { label: '6월', revenue: 2_052_000, profit: 698_200 },
    ],
    /** 총 비용 차감 구조 (판매가 → 순이익) — 국가별 Fee Schedule 기준 */
    costBreakdown: [
      { label: '총 매출', amountText: '+₩28,900' },
      { label: '공급 원가 총계', amountText: '-₩12,800' },
      { label: 'Shopee 수수료 총계', amountText: '-₩2,100' },
      { label: '국제 배송비 총계', amountText: '-₩3,400' },
      { label: '관세 (6%) 총계', amountText: '-₩1,200' },
      { label: 'VAT (10%) 총계', amountText: '-₩2,200' },
      { label: '예상 순이익', amountText: '₩7,200', emphasis: true },
    ],
    /** '계산 기준 보기' 펼침 내용 */
    calcBasis:
      '수수료 7.2%(Shopee 싱가포르 Fee Schedule v2026.03) · 관세 6%(ASEAN Tariff Finder) · VAT 10% · 국제 배송비는 선택한 배송 방식의 개당 실비, 환율은 1시간 캐싱된 실시간 값을 적용했습니다.',
  },
  priceManage: {
    currentPrice: 28900,
    fxNote: '실시간 환율 1 SGD = 1,160.5원 적용',
    /** 가격 조정 판단 근거 한 줄 */
    note: '현재 가격은 경쟁가 밴드 중앙에 있습니다. 마진율을 지키려면 ₩28,900 유지가 가장 안전합니다.',
    impacts: [
      { price: '₩26,900', margin: '20.3%', impact: '판매량 +8% 예상', verdict: '테스트 가능' },
      { price: '₩28,900', margin: '24.9%', impact: '현재 판매 가격', verdict: '추천' },
      { price: '₩31,900', margin: '28.5%', impact: '판매량 -12% 예상', verdict: '신중' },
    ] as PriceImpactRow[],
    history: [
      { date: '2026-08-03', before: '₩26,900', after: '₩28,900' },
      { date: '2026-07-12', before: '₩24,900', after: '₩26,900' },
      { date: '2026-06-18', before: '—', after: '₩24,900' },
    ] as PriceHistoryRow[],
  },
} as const;

export type SalesOpsData = typeof salesOpsMock;
