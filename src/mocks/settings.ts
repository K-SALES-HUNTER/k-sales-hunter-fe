import type { AccountInfo, ConnectedStore, MarketInfo, ShopeeCountry } from '@/types/settings';

/** 판매 국가 12개 — 판매 국가 연동 화면 2열×6행 순서 (열1 → 열2) */
export const SHOPEE_COUNTRIES: ShopeeCountry[] = [
  { code: 'MX', name: '멕시코' },
  { code: 'TW', name: '대만' },
  { code: 'ID', name: '인도네시아' },
  { code: 'VN', name: '베트남' },
  { code: 'BR', name: '브라질' },
  { code: 'MY', name: '말레이시아' },
  { code: 'KH', name: '캄보디아' },
  { code: 'PH', name: '필리핀' },
  { code: 'TH', name: '태국' },
  { code: 'AR', name: '아르헨티나' },
  // Figma 표기 그대로 '싱가폴' — 다른 화면(보고서·국가 카드)은 '싱가포르'를 쓴다
  { code: 'SG', name: '싱가폴' },
  { code: 'LA', name: '라오스' },
];

/** 브랜드 방향 dropdown 옵션 (MKT-01-01 #9) */
export const BRAND_DIRECTION_OPTIONS = [
  'K-트렌드',
  '가성비',
  '프리미엄',
  '감성',
  '친환경',
  '실속·라이프스타일',
].map((label) => ({ value: label, label }));

/** 셀러 유형 dropdown 옵션 (MKT-01-01 #10) */
export const SELLER_TYPE_OPTIONS = [
  '예비·초보 셀러',
  '1인 셀러',
  '소규모 팀 셀러',
  '브랜드 보유 셀러',
  '제조·공급사',
  '유통·리셀러',
  '운영대행·에이전시',
].map((label) => ({ value: label, label }));

/** 현재 비밀번호 확인 목 — 이 값을 입력하면 "비밀번호가 틀렸습니다" 에러 */
export const WRONG_PASSWORD_MOCK = 'wrong';

/**
 * [DEMO-ONLY] 연동 스토어는 세션에 보존한다 — 모듈 변수만 쓰면 새로고침 한 번에 연동이 풀려,
 * 연동 이후 화면(상세 페이지 업로드 등)이 갑자기 미연동 상태로 되돌아간다.
 * 촬영 중 실수로 새로고침해도 흐름이 깨지지 않게 하기 위한 장치다.
 * 백엔드 연동 시: sessionStorage 관련 코드를 전부 삭제하고 서버 조회로 대체한다.
 */
const CONNECTED_STORES_KEY = 'ksh-connected-stores';

/**
 * 시연 시작 시점의 연동 상태 — 이미 3개국에서 활동 중인 기존 셀러를 전제로 한다.
 * 그래서 시연에서 마켓 설정·Shopee 연동 단계를 거치지 않는다.
 */
export const INITIAL_CONNECTED_STORES: ConnectedStore[] = [
  {
    countryCode: 'SG',
    countryName: '싱가포르',
    storeName: 'MALLANG STUDIO',
    connectedAt: '2026-03-04',
  },
  {
    countryCode: 'TH',
    countryName: '태국',
    storeName: 'MALLANG STUDIO',
    connectedAt: '2026-03-04',
  },
  {
    countryCode: 'VN',
    countryName: '베트남',
    storeName: 'MALLANG STUDIO',
    connectedAt: '2026-05-21',
  },
];

/** 시연 시작 시점의 마켓 정보 — 이미 작성해 둔 상태 */
export const INITIAL_MARKET_INFO: MarketInfo = {
  brandDirection: 'K-트렌드',
  sellerType: '1인 셀러',
  mainTarget: 'K-캐릭터 굿즈와 K-뷰티를 수집하는 동남아 10~20대',
  brandTone: '밝고 귀여운, 소장 욕구를 자극하는 톤',
};

const cloneStores = () => INITIAL_CONNECTED_STORES.map((store) => ({ ...store }));

const loadConnectedStores = (): ConnectedStore[] => {
  try {
    const raw = sessionStorage.getItem(CONNECTED_STORES_KEY);
    return raw ? (JSON.parse(raw) as ConnectedStore[]) : cloneStores();
  } catch {
    return cloneStores();
  }
};

export const persistConnectedStores = (stores: ConnectedStore[]) => {
  try {
    sessionStorage.setItem(CONNECTED_STORES_KEY, JSON.stringify(stores));
  } catch {
    // 저장 실패는 무시 — 메모리 상태만으로도 동작한다
  }
};

/**
 * 설정 목 상태 — 백엔드 연동 전까지 모듈 레벨에서 유지한다.
 * 저장/연동/해제는 apis/settings.ts를 통해 이 상태를 갱신한다.
 */
export const settingsState: {
  account: AccountInfo;
  market: MarketInfo;
  stores: ConnectedStore[];
} = {
  account: {
    email: 'seller@ksaleshunter.com',
    marketName: 'MALLANG STUDIO',
    businessNumber: '1234567890',
  },
  market: { ...INITIAL_MARKET_INFO },
  // 기존 셀러 — 3개국 스토어가 이미 연동돼 있어 환영 모달이 뜨지 않는다
  stores: loadConnectedStores(),
};
