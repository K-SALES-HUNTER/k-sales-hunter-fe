import mallangBlack from '@/assets/images/mallang-black.png';
import mallangSet from '@/assets/images/detailimg-result.png';
import productEcoTote from '@/assets/images/product-eco-tote.png';
import productLipTint from '@/assets/images/product-lip-tint.png';
import type { CountryProgress, Product } from '@/types/product';

/**
 * [DEMO-ONLY] 시연 주인공 상품 — 등록 → 분석 → 판매 정보 → 상세 페이지 → 업로드 → 운영까지
 * 이 상품 하나로 전 구간을 진행한다. 진행 단계는 useDemoProgressStore가 런타임에 올린다.
 * 백엔드 연동 시: 등록 API 응답의 productId를 쓰므로 이 상수는 삭제한다.
 */
export const DEMO_PRODUCT_ID = 1;

/** [DEMO-ONLY] 시연 대상 국가 — 보고서 1위이자 판매를 실제로 진행하는 국가 */
export const DEMO_COUNTRY_CODE = 'VN';

/**
 * [DEMO-ONLY] 등록 전에는 상품 목록·대시보드에 노출되지 않는 상품.
 * 시연에서 상품 등록을 마치면 useDemoProgressStore가 등록 처리해 목록에 나타난다.
 * 백엔드 연동 시: 서버가 등록된 상품만 내려주므로 이 배열과 필터를 함께 삭제한다.
 * (필터 위치 — hooks/useProducts.ts, hooks/useDashboard.ts)
 */
export const PENDING_PRODUCT_IDS = [DEMO_PRODUCT_ID];

/**
 * 분석만 끝난 상태(판매 전) — 3개국 모두 보고서만 존재한다.
 * 시연 주인공 상품의 초기 상태이며, 판매 정보·상세 페이지·판매 상태는 런타임에 올라간다.
 */
const reportOnlyProgress: CountryProgress[] = [
  {
    code: 'VN',
    name: '베트남',
    stage: 'report',
    salesStatus: '판매전',
    hasDetailPage: false,
    hasSalesInfo: false,
  },
  {
    code: 'SG',
    name: '싱가포르',
    stage: 'report',
    salesStatus: '판매전',
    hasDetailPage: false,
    hasSalesInfo: false,
  },
  {
    code: 'TH',
    name: '태국',
    stage: 'report',
    salesStatus: '판매전',
    hasDetailPage: false,
    hasSalesInfo: false,
  },
];

export const productsMock: Product[] = [
  {
    id: DEMO_PRODUCT_ID,
    name: '말랑 프렌즈 캐릭터 인형',
    image: mallangSet,
    images: [mallangSet],
    category: '캐릭터·굿즈',
    costPrice: 11500,
    weight: 250,
    description:
      '한국 캐릭터 브랜드 말랑 프렌즈의 정품 플러시 인형입니다. 극세사 원단으로 만들어 촉감이 부드럽고, 네 가지 캐릭터를 20cm·30cm 두 사이즈로 고를 수 있습니다.',
    sellingPoints: '한국 정품 캐릭터 굿즈 · 극세사 플러시 원단 · 4가지 캐릭터 · 소장·선물용 패키지',
    mainTarget: 'K-캐릭터 굿즈를 수집하는 동남아 10~20대',
    revenue: 2572100,
    registeredAt: '2026-06-15',
    countries: reportOnlyProgress,
  },
  {
    id: 2,
    name: '비건 립틴트 4종 세트',
    image: productLipTint,
    images: [productLipTint],
    category: '뷰티',
    costPrice: 8900,
    weight: 120,
    description: '비건 인증 원료로 만든 데일리 립틴트 4종 세트.',
    sellingPoints: '비건 인증 · 4가지 데일리 컬러 · 선물 패키지',
    mainTarget: '비건 화장품을 찾는 20대',
    revenue: null,
    registeredAt: '2026-05-28',
    countries: reportOnlyProgress,
  },
  {
    id: 3,
    name: '코튼 에코백 (내추럴)',
    image: productEcoTote,
    images: [productEcoTote],
    category: '패션',
    costPrice: 4200,
    weight: 180,
    description: '두툼한 12수 코튼 원단으로 만든 데일리 에코백.',
    sellingPoints: '12수 코튼 원단 · 데일리 사이즈 · 세탁 후에도 형태 유지',
    mainTarget: '가볍게 들 가방을 찾는 20~30대',
    revenue: null,
    registeredAt: '2026-05-12',
    countries: reportOnlyProgress,
  },
  {
    id: 4,
    name: '말랑 프렌즈 미니 키링',
    image: mallangBlack,
    images: [mallangBlack],
    category: '캐릭터·굿즈',
    costPrice: 3600,
    weight: 60,
    description: '말랑 프렌즈 캐릭터를 8cm 크기로 줄인 가방용 키링.',
    sellingPoints: '8cm 미니 사이즈 · 가방·파우치 장식 · 캐릭터 4종',
    mainTarget: '캐릭터 굿즈를 모으는 10대',
    revenue: null,
    registeredAt: '2026-05-12',
    countries: reportOnlyProgress,
  },
];
