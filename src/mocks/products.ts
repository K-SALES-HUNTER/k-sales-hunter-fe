import productEcoTote from '@/assets/images/product-eco-tote.png';
import productLedStrip from '@/assets/images/product-led-strip.png';
import productLipTint from '@/assets/images/product-lip-tint.png';
import productTravelMug from '@/assets/images/product-travel-mug.png';
import type { CountryProgress, Product } from '@/types/product';

const fullProgress: CountryProgress[] = [
  {
    code: 'TH',
    name: '태국',
    stage: 'detail',
    salesStatus: '판매중',
    hasDetailPage: true,
    hasSalesInfo: true,
  },
  {
    code: 'SG',
    name: '싱가포르',
    stage: 'sales-info',
    salesStatus: '판매전',
    hasDetailPage: false,
    hasSalesInfo: true,
  },
  {
    code: 'VN',
    name: '베트남',
    stage: 'report',
    salesStatus: '판매전',
    hasDetailPage: false,
    hasSalesInfo: false,
  },
];

const reportOnlyProgress: CountryProgress[] = fullProgress.map((c) => ({
  ...c,
  stage: 'report',
  salesStatus: '판매전',
  hasDetailPage: false,
  hasSalesInfo: false,
}));

export const productsMock: Product[] = [
  {
    id: 1,
    name: '제주 화산송이 클렌저 150ml',
    image: productTravelMug,
    images: [productTravelMug],
    category: '뷰티',
    costPrice: 4500,
    weight: 220,
    description: '제주 화산송이 성분으로 모공 속 노폐물을 관리하는 클렌저.',
    sellingPoints: '제주 화산송이 원료 · 저자극 약산성 · 비건 인증',
    mainTarget: '20~30대 스킨케어에 관심 많은 여성',
    revenue: null,
    registeredAt: '2026-06-20',
    countries: reportOnlyProgress,
  },
  {
    id: 2,
    name: '한류 스타 포토카드 패키지',
    image: productEcoTote,
    images: [productEcoTote],
    category: '캐릭터·굿즈',
    costPrice: 3000,
    weight: 80,
    description: 'K-POP 팬을 위한 한정판 포토카드 패키지.',
    sellingPoints: '한정판 구성 · 고급 인쇄 · 팬덤 수집 아이템',
    mainTarget: '동남아 K-POP 팬덤',
    revenue: 15000,
    registeredAt: '2026-06-20',
    countries: fullProgress,
  },
  {
    id: 3,
    name: '서울 컬렉션 헤어미스트',
    image: productLipTint,
    images: [productLipTint],
    category: '뷰티',
    costPrice: 5200,
    weight: 180,
    description: '서울 감성의 은은한 향을 담은 헤어미스트.',
    sellingPoints: 'K-뷰티 트렌드 향 · 휴대용 사이즈 · 산뜻한 지속력',
    mainTarget: 'K-뷰티에 관심 있는 10~20대',
    revenue: 6000,
    registeredAt: '2026-06-20',
    countries: fullProgress,
  },
  {
    id: 4,
    name: '비건 립틴트 4종 세트',
    image: productLedStrip,
    images: [productLedStrip],
    category: '뷰티',
    costPrice: 8900,
    weight: 120,
    description: '비건 인증 원료로 만든 데일리 립틴트 4종 세트.',
    sellingPoints: '비건 인증 · 4가지 데일리 컬러 · 선물 패키지',
    mainTarget: '비건 화장품을 찾는 20대',
    revenue: null,
    registeredAt: '2026-06-20',
    countries: reportOnlyProgress,
  },
];
