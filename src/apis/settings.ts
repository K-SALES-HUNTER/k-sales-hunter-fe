import { SHOPEE_COUNTRIES, settingsState, WRONG_PASSWORD_MOCK } from '@/mocks/settings';
import type { AccountInfo, ConnectedStore, JoinPayload, MarketInfo } from '@/types/settings';

const MOCK_DELAY_MS = 300;
/** 스토어 연동은 OAuth 왕복을 흉내내 1초 지연 */
const CONNECT_DELAY_MS = 1000;

const withDelay = <T>(data: T, delay = MOCK_DELAY_MS): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(data), delay));

/**
 * 설정 API — 백엔드 연동 전 목 데이터 반환.
 * 실제 연동 시 axiosInstance 호출로 교체하고 시그니처는 유지.
 */
export const fetchAccountInfo = (): Promise<AccountInfo> =>
  withDelay({ ...settingsState.account });

export const updateAccountInfo = (info: Omit<AccountInfo, 'email'>): Promise<AccountInfo> => {
  settingsState.account = { ...settingsState.account, ...info };
  return withDelay({ ...settingsState.account });
};

export const fetchMarketInfo = (): Promise<MarketInfo> => withDelay({ ...settingsState.market });

export const updateMarketInfo = (info: MarketInfo): Promise<MarketInfo> => {
  settingsState.market = { ...info };
  return withDelay({ ...settingsState.market });
};

export const fetchConnectedStores = (): Promise<ConnectedStore[]> =>
  withDelay(settingsState.stores.map((store) => ({ ...store })));

/** 국가 연동 — 목: 1초 뒤 해당 국가를 연동 완료 상태로 만든다 */
export const connectStore = (countryCode: string): Promise<ConnectedStore> => {
  const country = SHOPEE_COUNTRIES.find((c) => c.code === countryCode);
  if (!country) return Promise.reject(new Error('지원하지 않는 국가입니다.'));

  const store: ConnectedStore = {
    countryCode: country.code,
    countryName: country.name,
    storeName: settingsState.account.marketName,
    connectedAt: new Date().toISOString().slice(0, 10),
  };
  return withDelay(store, CONNECT_DELAY_MS).then((connected) => {
    if (!settingsState.stores.some((s) => s.countryCode === connected.countryCode)) {
      settingsState.stores = [...settingsState.stores, connected];
    }
    return connected;
  });
};

export const disconnectStore = (countryCode: string): Promise<void> => {
  settingsState.stores = settingsState.stores.filter((s) => s.countryCode !== countryCode);
  return withDelay(undefined);
};

/** 현재 비밀번호 확인 — 목: "wrong" 입력 시에만 실패 */
export const verifyCurrentPassword = (password: string): Promise<boolean> =>
  withDelay(password !== WRONG_PASSWORD_MOCK);

export const changePassword = (newPassword: string): Promise<void> => {
  // 목: 서버 저장 없이 성공 처리 (실연동 시 API 호출로 교체)
  void newPassword;
  return withDelay(undefined);
};

/** 회원가입 — 목: 계정 정보 초기값에 반영만 하고 성공 처리 */
export const requestJoin = (payload: JoinPayload): Promise<void> => {
  settingsState.account = {
    email: payload.email,
    marketName: payload.marketName,
    businessNumber: payload.businessNumber,
  };
  return withDelay(undefined);
};
