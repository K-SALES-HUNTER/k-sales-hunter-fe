import mallangBlue from '@/assets/images/mallang-blue.png';
import mallangPairBottom from '@/assets/images/mallang-pair-bottom.png';
import mallangPairTop from '@/assets/images/mallang-pair-top.png';
import mallangPurple from '@/assets/images/mallang-purple.png';
import mallangSet from '@/assets/images/detailimg-result.png';

/* ─────────────────────────── SEL-01-01 판매 정보 입력 ─────────────────────────── */

export interface PriceScenario {
  id: 'low' | 'mid' | 'high';
  label: string;
  price: number;
  badge: string;
  /** 추천안 여부 — 기본 선택 */
  recommended?: boolean;
}

/** 가격 3안 (마진 메이커 R-002-05 — 경쟁가 밴드 내 3개 시나리오, 베트남 기준) */
export const priceScenariosMock: PriceScenario[] = [
  { id: 'low', label: 'Low', price: 22000, badge: '수익 낮음' },
  { id: 'mid', label: '추천 (Mid)', price: 28900, badge: '추천', recommended: true },
  { id: 'high', label: 'High', price: 38000, badge: '수익 높지만 구매 부담' },
];

/**
 * 수익 지표 계산 기준 (베트남) — 국가별 보고서(mocks/report.ts)와 같은 원장을 쓴다.
 * ⚠ 이 값을 고치면 report.ts의 costRows·netProfit·breakevenUnits도 함께 고쳐야 한다.
 * - 관세: 한-베트남 FTA 원산지증명서(C/O Form VK) 첨부 기준 0%
 * - 수입 VAT: CIF(공급 원가 + 국제 배송비) 기준 10% — 판매가에 비례하지 않는다
 * - Shopee 수수료: 판매가 기준 7.2% (십원 단위 반올림)
 */
export const marginBasisMock = {
  dutyRate: 0,
  importVatRate: 0.1,
  shopeeFeeRate: 0.072,
  /** 손익분기 계산용 고정비 (초기 셀러 기준 목) */
  fixedCostKrw: 2_000_000,
  fxNote: '1,000 VND = 54.0원',
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
    cost: 'USD 2.9/unit',
    costKrw: 3900,
    period: '8~14일',
    note: '소량 판매에 적합',
  },
  {
    id: 'sls',
    name: 'Shopee SLS',
    cost: 'USD 3.9/unit',
    costKrw: 5300,
    period: '4~7일',
    note: '대량 판매에 적합',
    aiRecommended: true,
  },
];

export const shippingNoticeMock =
  '※ 본 서비스는 배송을 직접 대행하지 않습니다. 상품과 판매 국가를 기준으로 권장 배송 방식을 안내하며, 실제 발송 처리는 셀러가 직접 진행해야 합니다. 선택한 배송 정보는 상세 페이지와 순이익 계산에 반영됩니다.';

export const shippingInfoNoteMock =
  '초기 테스트 판매에 적합하며, Shopee 주문 시스템과 연동하기 쉬워 배송 관리 부담이 낮습니다.';

/** 상품 포장 정보 기본값 (처음 입력한 값이 채워짐) */
export const packagingMock = { weight: 250, width: 24, depth: 20, height: 16 } as const;

/** Shopee 카테고리 후보 (상품 등록에서 고른 카테고리가 초기값) */
export const shopeeCategoryOptionsMock = [
  { value: 'toys-plush', label: '완구·취미 › 인형·플러시 › 캐릭터 인형' },
  { value: 'toys-collectible', label: '완구·취미 › 수집용 피규어' },
  { value: 'toys-keyring', label: '완구·취미 › 키링·가방 장식' },
  { value: 'baby-toys', label: '유아·아동 › 아동용 완구' },
];

export const shopeeCategoryDefaultMock = 'toys-plush';

export interface CategoryAttr {
  key: string;
  label: string;
  value: string;
  required?: boolean;
}

/** 카테고리 종속 필수·선택 속성 — Shopee 스키마 + AI 추천값 (목) */
export const categoryAttrsMock: CategoryAttr[] = [
  { key: 'brand', label: '브랜드', value: '말랑 프렌즈 (Mallang Friends)', required: true },
  { key: 'character', label: '캐릭터', value: '모카 · 코코 · 포미 · 베리', required: true },
  { key: 'material', label: '소재', value: '폴리에스터 100% 극세사' },
  { key: 'size', label: '사이즈', value: '20cm / 30cm' },
  { key: 'origin', label: '제조국', value: '대한민국' },
  { key: 'age', label: '권장 연령', value: '만 14세 이상 소장용' },
];

/** 1단·2단 속성 추천값 (Shopee 제안 변형 타입, 목) */
export const optionLevel1Mock = {
  name: '캐릭터',
  values: ['모카 (블루)', '코코 (블랙)', '포미 (화이트)', '베리 (퍼플)'],
};
export const optionLevel2Mock = { name: '사이즈', values: ['20cm', '30cm'] };

/* ─────────────────────────── 재고 (SEL·OPS 공용) ─────────────────────────── */

export interface StockRow {
  option1: string;
  option2: string;
  qty: number;
}

/** 옵션 조합별 재고 기본값 (총 156개) — 변경분은 useSalesOpsStore에서 관리 */
export const stockRowsMock: StockRow[] = [
  { option1: '모카 (블루)', option2: '20cm', qty: 42 },
  { option1: '모카 (블루)', option2: '30cm', qty: 18 },
  { option1: '코코 (블랙)', option2: '20cm', qty: 35 },
  { option1: '코코 (블랙)', option2: '30cm', qty: 12 },
  { option1: '포미 (화이트)', option2: '20cm', qty: 24 },
  { option1: '포미 (화이트)', option2: '30cm', qty: 9 },
  { option1: '베리 (퍼플)', option2: '20cm', qty: 16 },
  { option1: '베리 (퍼플)', option2: '30cm', qty: 0 },
];

/* ─────────────────────────── DTL-01-01 상세 페이지 ─────────────────────────── */

export interface PdpSeller {
  name: string;
  meta: string;
  /** 현지 언어 보기용 상태 문구 */
  metaLocal: string;
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

/**
 * AI 생성 상세페이지 콘텐츠 (현지화 콘텐츠 에이전트 R-003).
 * ko는 셀러 검수용, local은 실제 Shopee에 업로드되는 베트남어 원문이다.
 * 숫자·단위 표기도 현지 관례를 따른다 (베트남은 천 단위 구분에 마침표 사용).
 */
export const detailContentMock: { ko: PdpContent; local: PdpContent } = {
  ko: {
    breadcrumb: ['홈', '완구·취미', '인형·플러시', '캐릭터 인형'],
    name: '말랑 프렌즈 캐릭터 인형 20cm · 4종 택1',
    price: '₫535,000',
    usps: [
      '한국 정품 라이선스 캐릭터 굿즈',
      '폴리에스터 극세사 원단 · 손세탁 가능',
      '캐릭터 4종 · 20cm / 30cm 사이즈 선택',
      '대한민국에서 직접 발송 · 4~7일 도착',
    ],
    shipping: { region: '베트남 전 지역 배송', fee: '무료배송 · Shopee SLS', eta: '4 ~ 7일 이내' },
    options: [
      { label: '캐릭터', values: ['모카 (블루)', '코코 (블랙)', '포미 (화이트)', '베리 (퍼플)'] },
      { label: '사이즈', values: ['20cm', '30cm'] },
    ],
    stockNote: '재고 156개 남음',
    specs: [
      ['카테고리', '완구 › 인형·플러시 › 캐릭터 인형'],
      ['브랜드', '말랑 프렌즈 (Mallang Friends)'],
      ['캐릭터', '모카 · 코코 · 포미 · 베리'],
      ['소재', '폴리에스터 100% 극세사'],
      ['사이즈', '20cm / 30cm'],
      ['무게', '250 g (20cm 기준)'],
      ['원산지', '대한민국'],
      ['발송지', '대한민국 서울'],
      ['권장 연령', '만 14세 이상 소장용'],
      ['세탁 방법', '30°C 이하 손세탁'],
      ['재고', '156개'],
      ['구성', '선물 상자 + 방습 파우치'],
    ],
    description:
      '말랑 프렌즈는 한국에서 만든 정품 라이선스 캐릭터 인형입니다. 폴리에스터 극세사 원단으로 촉감이 부드럽고 봉제선이 튼튼해 손세탁이 가능합니다. 모카·코코·포미·베리 네 캐릭터를 20cm와 30cm 두 사이즈로 준비했으며, 수집용·책상 장식용·선물용 모두에 어울립니다. 주문은 대한민국 서울에서 직접 발송합니다.',
  },
  local: {
    breadcrumb: ['Trang chủ', 'Đồ chơi & Sở thích', 'Thú nhồi bông', 'Gấu bông nhân vật'],
    name: 'Gấu Bông Nhân Vật Mallang Friends 20cm - 4 Mẫu Lựa Chọn',
    price: '₫535.000',
    usps: [
      'Hàng chính hãng có bản quyền từ Hàn Quốc',
      'Vải nhung polyester siêu mềm · Giặt tay được',
      '4 nhân vật · Chọn size 20cm / 30cm',
      'Gửi trực tiếp từ Hàn Quốc · Nhận sau 4~7 ngày',
    ],
    shipping: {
      region: 'Giao hàng toàn quốc Việt Nam',
      fee: 'Miễn phí vận chuyển · Shopee SLS',
      eta: 'Trong 4 ~ 7 ngày',
    },
    options: [
      {
        label: 'Nhân vật',
        values: ['Mocha (Xanh)', 'Coco (Đen)', 'Pomi (Trắng)', 'Berry (Tím)'],
      },
      { label: 'Kích thước', values: ['20cm', '30cm'] },
    ],
    stockNote: 'Còn 156 sản phẩm',
    specs: [
      ['Danh mục', 'Đồ chơi › Thú nhồi bông › Gấu bông nhân vật'],
      ['Thương hiệu', 'Mallang Friends'],
      ['Nhân vật', 'Mocha · Coco · Pomi · Berry'],
      ['Chất liệu', 'Vải nhung polyester 100%'],
      ['Kích thước', '20cm / 30cm'],
      ['Trọng lượng', '250 g (size 20cm)'],
      ['Xuất xứ', 'Hàn Quốc'],
      ['Gửi từ', 'Seoul, Hàn Quốc'],
      ['Độ tuổi', 'Từ 14 tuổi trở lên (hàng sưu tầm)'],
      ['Bảo quản', 'Giặt tay ở nhiệt độ dưới 30°C'],
      ['Tồn kho', '156 sản phẩm'],
      ['Đóng gói', 'Hộp quà + túi chống ẩm'],
    ],
    description:
      'Mallang Friends là bộ sưu tập gấu bông nhân vật chính hãng đến từ Hàn Quốc. Sản phẩm được may từ vải nhung polyester siêu mềm, đường chỉ chắc chắn và có thể giặt tay. Bốn nhân vật Mocha, Coco, Pomi và Berry đều có hai kích thước 20cm và 30cm, rất phù hợp để sưu tầm, trang trí bàn làm việc hoặc làm quà tặng. Hàng được gửi trực tiếp từ Seoul, Hàn Quốc.',
  },
};

export const pdpSellerMock: PdpSeller = {
  name: 'MALLANG STUDIO',
  meta: '온라인 · 5분 이내 응답',
  metaLocal: 'Đang hoạt động · Phản hồi trong 5 phút',
  rating: '4.9 / 5.0',
  response: '98%',
  followers: '3.2K',
};

export interface ProductImageItem {
  id: string;
  label: string;
  src: string;
}

/** 상품 이미지 초기 목록 — 첫 번째가 대표 이미지 */
export const productImagesMock: ProductImageItem[] = [
  { id: 'base-1', label: '기본 1', src: mallangSet },
  { id: 'base-2', label: '기본 2', src: mallangBlue },
];

/** AI 생성 시 추가되는 목 이미지 소스 (기존 이미지를 레퍼런스로 새 컷 생성) */
export const aiGeneratedImageSrcMock = mallangPurple;

export interface DetailImageItem {
  id: string;
  label: string;
  src: string;
}

export const detailImagesMock: DetailImageItem[] = [
  { id: 'detail-1', label: '상세 이미지 1', src: mallangPairTop },
  { id: 'detail-2', label: '상세 이미지 2', src: mallangPairBottom },
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

/**
 * 판매 관리 목 — 베트남 판매 개시(2026-06-15) 후 기준일 2026-08-22.
 * 누적 89개 · 매출 ₩2,572,100 / 최근 30일 47개 · 매출 ₩1,358,300 · 순이익 ₩391,980
 * (개당 순이익 ₩8,340 = 28,900 − 원가 11,500 − 배송 5,300 − 수입VAT 1,680 − 수수료 2,080)
 *
 * 통화 표기 규칙 (Figma 12:14726 — QA-11):
 * - 구매자 금액(주문 결제 금액·총 매출·판매가·가격 3안·변경 기록)은 현지 통화 ₫
 * - 셀러 손익(예상 순이익·비용 차감 구조·계산 기준)은 원화 ₩
 * - 환율 1,000 VND = 54.0원 → ₩28,900 = ₫535,000 (판매가 기준 환산, 천 단위 반올림)
 */
export const salesOpsMock = {
  summary: {
    headline: '현재 판매 상태는 안정적입니다.',
    description:
      '최근 30일 동안 주문이 꾸준히 늘고 있고, 재고 소진 속도도 무리 없는 수준입니다. 다만 베리(퍼플) 30cm가 품절 상태라 해당 옵션 유입이 끊기고 있으니 재고 보충을 권장합니다.',
    /** 최근 30일 판매 흐름 (수량, 합계 47개) */
    trend: [
      { label: '7/25', value: 3 },
      { label: '7/29', value: 4 },
      { label: '8/02', value: 3 },
      { label: '8/05', value: 5 },
      { label: '8/08', value: 4 },
      { label: '8/11', value: 6 },
      { label: '8/14', value: 5 },
      { label: '8/17', value: 7 },
      { label: '8/20', value: 6 },
      { label: '8/22', value: 4 },
    ],
  },
  link: {
    url: 'https://shopee.vn/mallang-friends-plush-doll-20cm',
    registeredAt: '2026-06-15',
    updatedAt: '2026-08-19',
    lastSync: '08-22 14:30',
  },
  orders: {
    summary: { newOrders: 3, claims: 1, needAction: 4 },
    rows: [
      {
        id: 'VN-2087',
        date: '2026-08-22',
        orderNo: 'VN-2087',
        option: '코코 (블랙) · 20cm · 1개',
        amount: '₫535,000',
        shippingStatus: '상품 준비 중',
        claim: '없음',
        claimStatus: '없음',
      },
      {
        id: 'VN-2086',
        date: '2026-08-21',
        orderNo: 'VN-2086',
        option: '모카 (블루) · 30cm · 1개',
        amount: '₫695,000',
        shippingStatus: '발송 완료',
        claim: '없음',
        claimStatus: '없음',
      },
      {
        id: 'VN-2085',
        date: '2026-08-20',
        orderNo: 'VN-2085',
        option: '베리 (퍼플) · 20cm · 2개',
        amount: '₫1,070,000',
        shippingStatus: '배송 중',
        claim: '반품 요청',
        claimStatus: '접수',
      },
      {
        id: 'VN-2084',
        date: '2026-08-19',
        orderNo: 'VN-2084',
        option: '포미 (화이트) · 20cm · 1개',
        amount: '₫535,000',
        shippingStatus: '배송 완료',
        claim: '없음',
        claimStatus: '없음',
      },
      {
        id: 'VN-2083',
        date: '2026-08-18',
        orderNo: 'VN-2083',
        option: '코코 (블랙) · 30cm · 1개',
        amount: '₫695,000',
        shippingStatus: '배송 완료',
        claim: '교환 요청',
        claimStatus: '처리 중',
      },
    ] as OrderRow[],
  },
  /** 판매량 추이 (금액 아님, 수량 기준 — 재고 소진 속도 가늠 용도) */
  salesTrend: [
    { label: '6월 3주', value: 4 },
    { label: '6월 4주', value: 5 },
    { label: '6월 5주', value: 6 },
    { label: '7월 1주', value: 8 },
    { label: '7월 2주', value: 9 },
    { label: '7월 3주', value: 10 },
    { label: '7월 4주', value: 12 },
    { label: '8월 1주', value: 13 },
    { label: '8월 2주', value: 14 },
    { label: '8월 3주', value: 8 },
  ],
  /** 판매 성과 (최근 30일) */
  performance: {
    qty: '47개',
    /** 총 매출은 구매자 결제 기준 현지 통화 — 47개 × ₫535,000 (₩ 기준 원장은 ₩1,358,300) */
    revenue: '₫25,145,000',
    bepRemaining: '151개 남음',
    profit: '₩391,980',
    margin: '28.9%',
    /** 성과 진단 한 줄 (코파일럿 R-005-06) */
    note: '누적 89개를 판매해 손익분기 240개의 37%를 채웠습니다. 현재 판매 속도가 유지되면 약 3개월 뒤 손익분기를 넘어섭니다.',
    /**
     * 월간 매출·수익 추이 — 매출은 현지 통화 ₫(월 판매량 × ₫535,000), 순이익은 원화 ₩(월 판매량 × ₩8,340).
     * 6월 15개 · 7월 39개 · 8월 35개 (누적 89개, ₩ 기준 매출 433,500 / 1,127,100 / 1,011,500)
     */
    monthlyRevenue: [
      { label: '6월', revenue: 8_025_000, profit: 125_100 },
      { label: '7월', revenue: 20_865_000, profit: 325_260 },
      { label: '8월', revenue: 18_725_000, profit: 291_900 },
    ],
    /** 총 비용 차감 구조 (최근 30일 47개 총계) — 베트남 Fee Schedule 기준 */
    costBreakdown: [
      { label: '총 매출', amountText: '+₩1,358,300' },
      { label: '공급 원가 총계', amountText: '-₩540,500' },
      { label: 'Shopee 수수료 총계', amountText: '-₩97,760' },
      { label: '국제 배송비 총계', amountText: '-₩249,100' },
      { label: '관세 (0% · 한-베 FTA)', amountText: '-₩0' },
      { label: '수입 VAT 총계', amountText: '-₩78,960' },
      { label: '예상 순이익', amountText: '₩391,980', emphasis: true },
    ],
    /** '계산 기준 보기' 펼침 내용 */
    calcBasis:
      '최근 30일 판매 47개 기준입니다. Shopee 수수료 7.2%(Shopee Vietnam Fee Schedule v2026.03) · 관세 0%(한-베트남 FTA 원산지증명서 첨부) · 수입 VAT 10%(CIF 기준, 개당 ₩1,680) · 국제 배송비는 선택한 Shopee SLS의 개당 실비 ₩5,300, 환율은 1시간 캐싱된 실시간 값을 적용했습니다.',
  },
  priceManage: {
    /**
     * 현지 판매가 (Shopee 노출가, VND) — ₩28,900 ≒ ₫535,000 (1,000 VND = 54.0원).
     * 가격 3안 환산: ₩26,900→₫498,000 / ₩28,900→₫535,000 / ₩31,900→₫591,000 (천 단위 반올림)
     */
    currentPrice: 535000,
    fxNote: '실시간 환율 1,000 VND = 54.0원 적용',
    /** 가격 조정 판단 근거 한 줄 */
    note: '현재 가격은 현지 프리미엄 구간의 하단입니다. 정품 포지션을 지키면서 마진율을 방어하려면 ₫535,000(₩28,900) 유지가 가장 안전합니다.',
    /* 마진율은 ₩ 기준 원장 그대로 — 24.1% / 28.9% / 34.9% (QA-9 정답 원장) */
    impacts: [
      { price: '₫498,000', margin: '24.1%', impact: '판매량 +8% 예상', verdict: '테스트 가능' },
      { price: '₫535,000', margin: '28.9%', impact: '현재 판매 가격', verdict: '추천' },
      { price: '₫591,000', margin: '34.9%', impact: '판매량 -12% 예상', verdict: '신중' },
    ] as PriceImpactRow[],
    /* ₩24,900→₫461,000 · ₩26,900→₫498,000 · ₩28,900→₫535,000 */
    history: [
      { date: '2026-08-03', before: '₫498,000', after: '₫535,000' },
      { date: '2026-07-12', before: '₫461,000', after: '₫498,000' },
      { date: '2026-06-15', before: '—', after: '₫461,000' },
    ] as PriceHistoryRow[],
  },
} as const;

export type SalesOpsData = typeof salesOpsMock;
