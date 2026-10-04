/**
 * 목 / 실연동 스위치.
 *
 * 기본값은 목이다. 시연 빌드(런타임 외부 API 0회)는 아무것도 바꾸지 않아도 그대로 돈다.
 * 실연동은 .env 에 아래 두 줄을 넣는다 (Spring 이 생기기 전에는 AI 레포의 dev_bff 에 붙는다).
 *
 *   VITE_USE_MOCK=false
 *   VITE_API_BASE_URL=/api/v1      ← vite 개발 프록시가 http://localhost:8000 으로 넘긴다
 *
 * 연동한 화면: 상품 등록·이미지 업로드·자동 채우기, 분석 로딩, 판매 정보, 상세 페이지, 이미지 생성.
 * 나머지 화면(보고서·대시보드·설정·판매 관리·AI 패널)은 각 담당이 같은 스위치로 붙인다.
 */
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK !== 'false';
