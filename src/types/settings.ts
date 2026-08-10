/** 계정 정보 (마켓/설정 › 계정 정보 탭) */
export interface AccountInfo {
  email: string;
  marketName: string;
  /** 사업자등록번호 — 하이픈 없는 10자리 (UI에서 3-2-5 분할 표기) */
  businessNumber: string;
}

/** 마켓 정보 (마켓/설정 › 마켓 정보 탭) */
export interface MarketInfo {
  brandDirection: string;
  sellerType: string;
  mainTarget: string;
  brandTone: string;
}

/** Shopee 판매 국가 */
export interface ShopeeCountry {
  code: string;
  name: string;
}

/** 연동된 Shopee 스토어 */
export interface ConnectedStore {
  countryCode: string;
  countryName: string;
  storeName: string;
  /** 연결일 (YYYY-MM-DD) */
  connectedAt: string;
}

/** 회원가입 요청 값 */
export interface JoinPayload {
  email: string;
  marketName: string;
  password: string;
  /** 하이픈 없는 10자리 (명세: 하이픈은 UI 표기용, 저장값 제외) */
  businessNumber: string;
}
