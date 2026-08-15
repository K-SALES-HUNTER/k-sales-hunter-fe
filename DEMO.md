# 시연 체크리스트 · 롤백 점검 리스트

공모전 제출 영상 촬영을 위한 프론트엔드 단독 시연 구성을 정리한 문서입니다.
**촬영 담당자**는 1~4장을, **백엔드 연동 담당자**는 5~7장을 보면 됩니다.

- 시연 각본(타임코드·클릭 순서): <https://claude.ai/code/artifact/a9a6f025-721e-460c-a8af-474e3966ec67>
- 최종 제출: 2026-09-08 16:00

---

## 1. 시연 구성 한눈에

| 항목 | 값 |
|---|---|
| 주인공 상품 | 말랑 프렌즈 캐릭터 인형 (`productId = 1`) |
| 판매 국가 | 베트남 (`VN`) — 싱가포르·태국은 비교용 보고서만 |
| 계정 | 단일 계정. 로그인은 아무 이메일·비밀번호나 통과 |
| 시작 상태 | 매출 0원 · 연동 스토어 0개 · 등록 상품 3건(전부 미판매) |
| 종료 상태 | 매출 2,572,100원 · 판매 중 1개 · 등록 상품 4건 |
| 영상 길이 | 약 7분 35초 |
| 런타임 외부 API 호출 | **0회** |

> 주인공 상품은 등록을 마치기 전까지 상품 목록·대시보드에 나오지 않습니다.
> 그래서 "아무것도 없는 상태"에서 시작해 마지막에 채워진 대시보드로 돌아오는 구성이 성립합니다.

---

## 2. 촬영 전 체크리스트

테이크를 다시 갈 때마다 **전부** 반복해야 합니다.

- [ ] **시크릿 창을 새로 연다** (가장 확실한 초기화)
      - 대안: 개발자도구 → Application → Storage → **Clear site data**
- [ ] 창 폭 **1280px 이상** — 미만이면 사이드바가 접히고, 1024px 미만이면 AI 패널이 사라짐
- [ ] 브라우저 확대율 **100%**
- [ ] 북마크바 숨김, 알림·메신저 끄기
- [ ] `/login` 화면까지만 띄워 두고 녹화 시작
- [ ] 개발 서버 또는 배포본이 **최신 빌드**인지 확인 (`npm run build` 통과 여부)

### 초기화되는 저장소 키

| 키 | 저장소 | 내용 |
|---|---|---|
| `ksh-auth` | localStorage | 로그인 상태 |
| `ksh-demo-progress` | sessionStorage | 등록·판매정보·상세페이지·업로드 진행 단계 |
| `ksh-connected-stores` | sessionStorage | 연동한 Shopee 판매 국가 |
| `ksh-ai-chat` | sessionStorage | AI 패널 대화 이력 |
| `ksh-welcome-dismissed` | sessionStorage | 환영 모달 표시 여부 |
| `ksh-sidebar` | sessionStorage | 사이드바 접힘 상태 |

> 진행 단계와 연동 상태를 세션에 남겨 두었기 때문에 **촬영 중 실수로 새로고침해도 흐름이 깨지지 않습니다.**
> 다만 **탭을 닫으면 전부 사라집니다.**

---

## 3. 촬영 중 확인 포인트

각 막에서 "이게 화면에 보여야 정상"인 항목입니다. 하나라도 어긋나면 초기화가 덜 된 것입니다.

- [ ] **막 0 · 로그인** — `/login`
- [ ] **막 1 · 첫 세팅** — 대시보드가 `순이익 0원 / 총 매출 0원 / 판매 중인 상품 0개`, 최근 상품 **3건**, 환영 모달 노출
      - 환영 모달 → `마켓 정보 등록` → 설정 화면 → **마켓플레이스 연동** 탭
      - 모달 문구와 다음 행동을 맞추고 싶으면 `둘러보기`로 닫고 좌측 **마켓 / 설정** 메뉴로 들어가도 됩니다. 도착 화면·클릭 수 동일
      - `연결된 Shopee 스토어가 없습니다` → 스토어 연동하기 → **베트남** 연동 → 1초 → `연동 완료`
- [ ] **막 2 · 상품 등록** — 상품명·공급 원가(`11500`)·무게(`250`) **세 칸만** 입력, 나머지 4칸은 비움
      - 우상단 버튼이 `자동 채우기` → 클릭 → 1.2초 → 4칸이 **파란 글씨**로 채워짐
      - 채워진 칸 하나를 고치면 **파란 표시가 사라짐**
      - 버튼이 `등록`으로 바뀜 → 클릭 → 5단계 로딩 약 8초
- [ ] **막 3 · 글로벌 보고서** — 결론 `베트남 우선 진입을 추천합니다.`, **판매 현황 섹션 없음**
      - `보고서 확인` → 1위 국가(베트남)로 이동
- [ ] **막 4 · 베트남 보고서** — 상단 `상세 페이지 생성` 버튼 **비활성**
      - 통관 주의사항 3건 모두 근거 조항 표시
      - 가격 3안 전환 시 하단 비용 차감표 재계산
- [ ] **막 5 · 판매 정보** — 지표가 보고서와 동일 (`₩8,340 · 28.9% · 240개`)
      - 옵션·재고 단계별 저장 → 재고까지 저장하면 **상단에 `판매 정보` 탭 생성**
- [ ] **막 6 · 상세 페이지** — `상세 페이지 생성` 활성 → 1.5초 → **`상세 페이지` 탭 생성**
      - `현지 언어 보기` → 배송·수량·장바구니·판매자 정보까지 **전부 베트남어**, 가격 `₫535.000`
      - 이미지 AI 생성 → 1.8초 → 보라색 캐릭터 단독 컷
      - 하단 카드 `MALLANG STUDIO에 연동되어 있습니다` → `Shopee에 업로드` → 성공 모달
      - **`판매 관리` 탭 생성** (상단 탭 4개 완성)
- [ ] **막 7 · 판매 관리** — 재고에 **품절 배지**(베리 퍼플 30cm), 주문 `VN-2083`~`VN-2087`
- [ ] **막 8 · 대시보드 복귀** — `순이익 742,260원 / 총 매출 2,572,100원 / 주문 76건 / 판매 중 1개`, 최근 상품 **4건**

### 하지 말아야 할 것

- ❌ **AI 패널에 직접 타이핑** — 준비된 답변은 추천 질문 칩 21개뿐입니다. 직접 입력하면 안내 문구로 떨어집니다
- ❌ **탭 닫고 다시 열기** — 진행 단계가 전부 초기화됩니다
- ❌ **다른 상품의 판매 화면 진입** — 2~4번 상품은 분석 보고서까지만 있습니다
- ⚠️ **`판매 중단` 버튼** — 눌러도 되지만 재고·배송 조작이 비활성화됩니다. `판매 재개`로 되돌리세요

---

## 4. 편집 시 유의사항

- [ ] **막 7 앞에 "업로드 2주 후" 자막**을 넣습니다.
      판매 관리 데이터는 판매 개시(2026-06-15) 후 기준일 2026-08-22 기준이라, 자막 없이는
      방금 업로드한 상품에 누적 89개 판매가 찍힌 것처럼 보입니다.
- [ ] 대시보드 기준일이 `2026년 8월 22일 기준`으로 표시되므로 자막 시점과 맞춥니다.

---

## 5. 숫자 정합성 점검

목 데이터를 수정했다면 아래 검산이 전부 맞는지 확인하세요.
**한 곳만 고치면 반드시 다른 화면과 어긋납니다.**

### 개당 손익 (베트남 · 추천가)

```
Shopee 수수료 = round(28,900 × 0.072 / 10) × 10        = 2,080
수입 VAT      = (11,500 + 5,300) × 0.10                 = 1,680   ← CIF 기준, 판매가와 무관
개당 순이익   = 28,900 − 11,500 − 2,080 − 5,300 − 0 − 1,680 = 8,340
마진율        = 8,340 / 28,900                          = 28.9%
손익분기      = ceil(2,000,000 / 8,340)                 = 240개
```

### 누적·기간 실적

| 검산 | 식 | 결과 |
|---|---|---|
| 누적 매출 | 89 × 28,900 | 2,572,100 |
| 누적 순이익 | 89 × 8,340 | 742,260 |
| 최근 30일 매출 | 47 × 28,900 | 1,358,300 |
| 최근 30일 순이익 | 47 × 8,340 | 391,980 |
| 월별 매출 합 | 433,500 + 1,127,100 + 1,011,500 | 2,572,100 |
| 월별 순이익 합 | 125,100 + 325,260 + 291,900 | 742,260 |
| 주간 매출 추이 합 | `totalReportMock.sales.monthlyTrend` 10개 | 2,572,100 |
| 주간 수량 추이 합 | `salesOpsMock.salesTrend` 10개 | 89개 |
| 최근 30일 일별 합 | `salesOpsMock.summary.trend` 10개 | 47개 |
| 재고 합 | 42+18+35+12+24+9+16+0 | 156개 |

### 같은 값을 쓰는 파일

| 값 | 위치 |
|---|---|
| 공급 원가 `11,500` | `mocks/products.ts` · `mocks/report.ts`(costRows) · `mocks/sales.ts`(costBreakdown) |
| 판매가 `28,900` / `₫535,000` | `mocks/report.ts` · `mocks/sales.ts`(priceScenarios·detailContent·priceManage) |
| 개당 순이익 `8,340` | `mocks/report.ts`(VN mid) · 판매 정보 화면 계산 결과 · `stores/useAiChatStore.ts` |
| 배송비 `5,300` | `mocks/sales.ts`(shippingMethodsMock.sls) · `mocks/report.ts`(costRows) |
| 누적 실적 | `mocks/report.ts`(sales) · `mocks/sales.ts`(salesOpsMock) · `mocks/dashboard.ts` |
| 재고 `156` | `mocks/sales.ts`(stockRowsMock·detailContentMock) · `stores/useAiChatStore.ts` |

> 판매 정보 화면의 순이익은 **하드코딩이 아니라 계산 결과**입니다
> (`pages/sales/components/PriceSection.tsx` → `calcUnitProfit`).
> `marginBasisMock`을 고치면 보고서의 `costRows`도 같이 고쳐야 두 화면이 일치합니다.

---

## 6. 롤백 점검 리스트

시연용으로 넣은 코드에는 전부 `[DEMO-ONLY]` 주석이 달려 있습니다.

```bash
# 전체 목록 확인
grep -rn "DEMO-ONLY" src/

# 연동 이후 검토할 항목
grep -rn "TODO(백엔드)\|TODO(다국어)" src/
```

### 삭제 대상 (백엔드 연동 시 없어져야 하는 것)

| 파일 | 대상 | 조치 |
|---|---|---|
| `stores/useDemoProgressStore.ts` | **파일 전체** | 삭제. 서버가 내려주는 `countries[].stage / hasSalesInfo / hasDetailPage / salesStatus`를 그대로 사용 |
| `mocks/products.ts` | `DEMO_PRODUCT_ID` · `DEMO_COUNTRY_CODE` · `PENDING_PRODUCT_IDS` | 삭제 |
| `mocks/dashboard.ts` | `dashboardSummaryAfterSalesMock` | 삭제 (요약이 한 벌로 통합됨) |
| `mocks/settings.ts` | `CONNECTED_STORES_KEY` · `loadConnectedStores` · `persistConnectedStores` | 삭제 |
| `apis/settings.ts` | `persistConnectedStores` 호출 2곳 | 삭제 |
| `apis/dashboard.ts` | `fetchDashboardSummary(hasSales)` 인자 | 인자 제거 |
| `apis/dashboard.ts` | `fetchHasLinkedMarket` | 셀러 연동 여부 API 응답으로 교체 |
| `hooks/useProducts.ts` | `useProducts` · `useProduct`의 `select` | 삭제 → `useQuery({ queryKey, queryFn })`만 남김 |
| `hooks/useDashboard.ts` | `hasSales` 계산 · `useRecentProducts`의 `select` | 삭제 |
| `pages/products/ProductRegisterPage.tsx` | `REGISTERED_PRODUCT_ID` · `markRegistered` 호출 | 등록 API 응답의 `productId` 사용 |
| `pages/report/CountryReportPage.tsx` | `markDetailPageCreated` 호출 | 상세페이지 생성 API 응답으로 상태 갱신 |
| `pages/sales/SalesInfoPage.tsx` | `handleSaved` · `onSaved` 전달 | 삭제 |
| `pages/sales/components/OptionStockSection.tsx` | `onSaved` prop | 삭제 |
| `pages/sales/components/ShippingSection.tsx` | `onSaved` prop | 삭제 |

### 교체 대상 (기능은 남고 구현만 바뀌는 것)

| 파일 | 대상 | 조치 |
|---|---|---|
| `stores/useAiChatStore.ts` | `ANSWERS` · `FALLBACK_ANSWER` · `replyDelay` | `/conversations` SSE 스트리밍으로 교체. 스토어 시그니처(`messages`/`replying`/`send`)는 유지 |
| `components/common/AiLoadingOverlay/AiLoadingOverlay.tsx` | `STEPS[].durationMs` · `remainingSeconds` | `/analysis-jobs/{id}/events` SSE 단계 이벤트로 진행 갱신 |
| `pages/sales/DetailPage.tsx` | `uploadToShopee`의 `setTimeout` · `markUploaded` | 업로드 API 호출 + 응답 상태 사용 |
| `mocks/detailImage.ts` | `generatedImageSrcMock` | 이미지 생성 API 응답 URL |
| `pages/products/ProductEditPage.tsx` | `CHANGE_IMPACTS` · `summarizeChanges` | 변경 요청 응답의 영향 필드로 대체 |
| `pages/sales/components/PdpPreview.tsx` | `LABELS` | 국가 코드별 사전으로 확장 (현재 한국어·베트남어만) |

### 목 데이터 전체

`src/mocks/` 아래 7개 파일(`products` `dashboard` `report` `sales` `productForm` `settings` `detailImage`)은
**전부 시연·개발용**입니다. `src/apis/` 각 함수의 **시그니처와 반환 타입을 그대로 두고 내부만
axios 호출로 교체**하면 화면 코드는 손대지 않아도 됩니다.

---

## 7. 백엔드 연동 권장 순서

의존 관계상 아래 순서로 붙이면 중간에 화면이 깨지지 않습니다.

1. **인증** — `apis/axiosInstance.ts` 토큰 주입, `stores/useAuthStore.ts`
2. **상품 CRUD** — `apis/products.ts` → 이 시점에 `hooks/useProducts.ts`의 `select` 제거,
   `useDemoProgressStore` 삭제, `PENDING_PRODUCT_IDS` 삭제
3. **분석 작업** — 등록 → `202 Accepted` + `jobId` → SSE 진행 → `AiLoadingOverlay` 교체
4. **보고서** — `apis/report.ts` (전체/국가별)
5. **판매 정보** — `apis/sales.ts`의 `fetchSalesInfo` · `saveSalesStep`
6. **상세 페이지·이미지** — `fetchDetailContent` · 이미지 생성
7. **Shopee 업로드·운영** — `DetailPage`의 업로드, `fetchSalesOps`
8. **대시보드** — `apis/dashboard.ts` (집계는 마지막이 안전)
9. **코파일럿** — `useAiChatStore`를 SSE로 교체

각 단계마다 `grep -rn "DEMO-ONLY" src/`로 남은 항목을 확인하세요.
**전부 사라지면 프론트 단독 동작 코드가 남아 있지 않다는 뜻입니다.**

---

## 8. 이미지 자산

시연용 이미지는 `src/assets/images/detailimg-result.png`(캐릭터 인형 4종 원본)에서 잘라낸 것입니다.

| 파일 | 용도 |
|---|---|
| `detailimg-result.png` | 대표 이미지 · 상품 목록 썸네일 (원본) |
| `mallang-blue.png` | 상품 이미지 2 · 레퍼런스 사진 |
| `mallang-black.png` | 4번 상품(미니 키링) 썸네일 |
| `mallang-purple.png` | **AI 이미지 생성 결과** |
| `mallang-white.png` | 예비 (현재 미사용) |
| `mallang-pair-top.png` · `mallang-pair-bottom.png` | 상세 이미지 1·2 |

### 사용 중지한 자산 (파일은 남아 있음)

| 파일 | 중지 사유 |
|---|---|
| `sales-detail-1.png` · `sales-detail-2.png` | **Bose · Marshall 로고**가 그대로 찍힌 실물 사진 |
| `sales-pdp-main.png` · `sales-pdp-sub.png` | 블루투스 스피커 — 상품과 불일치 |
| `product-travel-mug.png` | **스타벅스 로고** 노출 |
| `product-led-strip.png` | 상품이 아닌 인물 스톡 사진 |

> import를 모두 제거해 번들에 포함되지 않습니다. 되살릴 경우 **로고 노출을 먼저 확인**하세요.

---

## 9. 알려진 제약

| 제약 | 영향 | 대응 |
|---|---|---|
| AI 패널은 추천 질문 21개에만 답변 | 즉흥 질문 시 안내 문구 | 촬영에서는 칩만 클릭. 라이브 시연 시 실호출 검토 |
| 추천 칩은 첫 메시지 전에만 노출 | 대화 시작 후 칩이 사라짐 | 각본은 막 3·막 8에서만 사용 |
| 판매 관리 데이터는 "업로드 2주 후" 기준 | 업로드 직후 누적 89개 | 편집에서 자막 처리 (4장) |
| 상품 2~4번은 보고서까지만 존재 | 판매 화면 없음 | 각본에서 진입하지 않음 |
| 상세 페이지 현지 언어는 베트남어만 | 싱가포르·태국 진입 시 한국어 | `PdpPreview.LABELS` 확장 (6장 TODO) |
| 탭을 닫으면 진행 상태 초기화 | 촬영 중단 시 처음부터 | 촬영 중 탭 유지 |

---

## 10. 검증 명령

```bash
npm run build   # 타입 체크 + 프로덕션 빌드
npm run lint    # ESLint
npm run dev     # 로컬 확인
```

마지막 검증: 위 3개 모두 통과 확인 완료.
