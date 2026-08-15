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
  { code: 'SG', name: '싱가포르' },
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

const loadConnectedStores = (): ConnectedStore[] => {
  try {
    const raw = sessionStorage.getItem(CONNECTED_STORES_KEY);
    return raw ? (JSON.parse(raw) as ConnectedStore[]) : [];
  } catch {
    return [];
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
  market: {
    brandDirection: '',
    sellerType: '',
    mainTarget: '',
    brandTone: '',
  },
  // 신규 셀러 — 연동된 스토어가 없는 상태에서 시작한다 (대시보드 환영 모달 → 판매 국가 연동)
  stores: loadConnectedStores(),
};
