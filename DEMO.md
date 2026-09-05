# 시연 체크리스트 · 롤백 점검 리스트

공모전 제출 영상 촬영을 위한 프론트엔드 단독 시연 구성을 정리한 문서입니다.
**촬영 담당자**는 1~4장을, **백엔드 연동 담당자**는 5~7장을 보면 됩니다.

- 시연 각본(타임코드·클릭 순서): <https://claude.ai/code/artifact/a9a6f025-721e-460c-a8af-474e3966ec67>
- 최종 제출: 2026-09-08 16:00

---

## 1. 시연 구성 한눈에

| 항목 | 값 |
|---|---|
| 페르소나 | **기존 셀러** — 비건 립틴트를 싱가포르·태국에서 판매 중 |
| 주인공 상품 | 말랑 프렌즈 캐릭터 인형 (`productId = 1`, 시연에서 신규 등록) |
| 판매 국가 | 베트남 (`VN`) — 싱가포르·태국은 비교용 보고서만 |
| 계정 | 단일 계정. 로그인은 아무 이메일·비밀번호나 통과 |
| 시작 상태 | 매출 1,414,000원 · 총 매출 4,158,000원 · 판매 중 1개 · 등록 상품 3건 · **3개국 연동 완료** |
| 종료 상태 | 매출 2,425,500원 · 총 매출 6,730,100원 · 판매 중 2개 · 등록 상품 4건 |
| 영상 길이 | 약 7분 40초 |
| 런타임 외부 API 호출 | **0회** |

> 마켓 설정·Shopee 연동은 이미 끝난 상태이므로 시연 단계에 없습니다
> (`INITIAL_CONNECTED_STORES` · `INITIAL_MARKET_INFO` in `mocks/settings.ts`).
>
> 주인공 상품은 등록을 마치기 전까지 상품 목록·대시보드에 나오지 않습니다.
> 그래서 "기존 실적만 있는 대시보드"에서 시작해 마지막에 인형 실적이 더해진 대시보드로 돌아옵니다.

> ⚠️ **보고서·판매 관리 목은 상품과 무관하게 한 벌만 있습니다.**
> `fetchTotalReport` · `fetchCountryReport` · `fetchSalesOps`가 `productId`를 무시하므로,
> 비건 립틴트의 보고서를 열면 인형 데이터가 나옵니다. 촬영에서는 진입하지 않습니다.
> 백엔드 연동 시 자연히 해결되고, 그전에 필요하면 상품별 목을 나눠야 합니다.

---

## 2. 촬영 전 체크리스트

테이크를 다시 갈 때마다 **전부** 반복해야 합니다.

- [ ] **초기화** — 아래 중 하나
      - **좌측 하단 `로그아웃`** ← 가장 간단. 로그아웃 시 시연 상태가 전부 초기화됩니다
      - 시크릿 창을 새로 연다
      - 개발자도구 → Application → Storage → **Clear site data**
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
>
> 이 상태들은 계정과 무관하게 세션에 저장되므로 **로그아웃 시 `resetDemoSession()`이 전부 비웁니다.**
> 로그아웃 → 재로그인만으로 "신규 셀러" 상태로 돌아옵니다
> (`stores/useDemoProgressStore.ts`, 호출부는 `Sidebar.tsx` · `PasswordChangePage.tsx`).

---

## 3. 촬영 중 확인 포인트

각 막에서 "이게 화면에 보여야 정상"인 항목입니다. 하나라도 어긋나면 초기화가 덜 된 것입니다.
(Figma 전수 대조 반영본 기준 — 헤더 제목은 `{국가} 보고서`, 페이지 탭은 알약 스타일)

- [ ] **막 0 · 로그인** — `/login`
- [ ] **막 1 · 이미 팔고 있는 셀러** — 대시보드가
      `매출 1,414,000원 / 순이익 28.3% / 총 매출 4,158,000원 / 주문 168건 / 판매 중인 상품 1개`,
      최근 상품 **3건**(립틴트에만 매출), **환영 모달 없음**
- [ ] **막 2 · 상품 등록** — 상품명·공급 원가(`11500`)·무게(`250`) **세 칸만** 입력, 나머지 4칸은 비움
      - 우상단 버튼이 `자동 채우기` → 클릭 → 1.2초 → 4칸이 **그라데이션 글씨**(**카테고리 드롭다운 포함**)
      - 채워진 칸 하나를 고치면 **그 칸만 검은 글씨로 승격**
      - `등록` → 분석 로딩 **"예상 소요 시간 1분 남음"**, 하단 **중단하기 단색 네이비 풀폭**
- [ ] **막 3 · 글로벌 보고서** — 결론 아래 **그라데이션 풀폭 `보고서 확인`**, **판매 현황 섹션 없음**
      - 국가 카드는 **원화 단일 표기**(`약 28,900원`) — 현지 통화는 막 4에서
- [ ] **막 4 · 베트남 보고서** — 우상단 CTA가 **`판매 정보 입력`** (판매 정보 저장 전이므로 정상)
      - 권장 판매가 `₩28,900 (₫535,000)` — 여기서 현지 통화 노출
      - 통관 주의사항 3건 모두 근거 조항 + 빨간 경고 아이콘
      - 가격 3안 전환 시 비용 차감표 재계산
- [ ] **막 5 · 판매 정보** — 지표가 보고서와 동일 (`₩8,340 · 28.9% · 240개`)
      - 섹션 탭 `판매가 / 옵션·재고 / 배송 방식 선택`
      - 저장 **7단계**: 카테고리 → 속성 → 1단 → 2단 → **재고 수량** → **옵션별 추가 금액** → 포장 정보
      - 앞 단계를 저장해야 **다음 블록이 나타남**(disabled가 아니라 미렌더). 앞 단계를 고치면 뒤가 다시 숨겨짐
      - 자동으로 채워진 값(카테고리·속성 6종·옵션명·옵션값·최종 가격·포장 치수)은 **그라데이션 글씨**
      - 옵션값 셀에 호버하면 **`×` 삭제 버튼** 노출 (마지막 1개는 삭제 불가)
      - **재고 수량까지 저장해야** 상단에 `판매 정보` 탭이 생기고 우상단 CTA가 **`상세 페이지 생성`으로 활성화**
      - 우상단 **`상세 페이지 생성`** 으로 바로 다음 막
- [ ] **막 6 · 상세 페이지** — 1.5초 → **`상세 페이지` 탭 생성**
      - `현지 언어 보기` → 배송·수량·장바구니·판매자 정보까지 **전부 베트남어**, 가격 `₫535.000`
      - 이미지 AI 생성 → 1.8초 → 보라색 캐릭터 단독 컷
      - **헤더 우측 `오토 업로드`** → 성공 모달 → **`판매 관리` 탭 생성**(탭 4개 완성)
      - ⚠️ **창 폭 1440px 이상**이어야 편집 패널이 보입니다
- [ ] **막 7 · 판매 관리** — 헤더 우측 **`판매 중단`**
      - 업로드 직후에는 Figma `71:12238` 초기 화면: 주문·클레임 0건, 판매량 0건, 매출 ₫0, 순이익 ₩0, 마진 0%, 손익분기 240개 남음
      - 주문 테이블은 헤더와 빈 안내, 가격 변경 기록도 빈 안내. 판매 차트·총 비용 차감 구조는 숨김
      - **상단 `판매 현황` 텍스트 클릭** → 아래 기존 실적 화면으로 전환. 버튼 외형/호버 장식은 없고 Enter·Space로도 실행 가능
      - 추가 클릭은 상태를 되돌리지 않음. 상품·국가별 `salesRevealed`를 `ksh-demo-progress`에 저장하여 재진입·새로고침 후 유지
      - 로그아웃하면 전환 상태·업로드 시각도 초기화. 기존 운영 상품은 원래 실적을 유지
      - 다음 항목은 **제목 클릭 후** 확인
      - 섹션 탭 `판매 요약 / 상품 정보 / 주문 관리 / 배송 정보 / 판매 성과 / 가격 관리`
      - 재고에 **품절 배지**(베리 퍼플 30cm), 주문 `VN-2083`~`VN-2087`
      - 판매 성과에 **판매량 라인차트 + 월간 매출/수익 막대차트** 2열
      - **구매자 결제 금액은 ₫, 셀러 손익·원가는 ₩** — 매출 `₫25,145,000`, 가격 관리 현재가 `₫535,000`,
        비용 차감표·순이익은 `₩` (Figma 12:14726 통화 규칙)
- [ ] **막 8 · 글로벌 보고서 재방문** — 막 3에는 없던 **판매 현황 카드**가 생겨 있음
      (`판매 중 1개국` · 총 매출 `₩ 2,572,100원` · 총 주문 `76건`)
- [ ] **막 9 · 대시보드 복귀** —
      `매출 2,425,500원 / 순이익 28.5% / 총 매출 6,730,100원 / 주문 244건 / 판매 중인 상품 2개`,
      최근 상품 **4건**

### AI가채움(그라데이션 텍스트) 적용 범위

Figma의 Text Input `status=AI가채움`을 **"AI·쇼피가 대신 채운 값"** 전반으로 확장 적용했습니다.
규칙은 하나입니다 — **자동으로 들어온 값 그대로면 그라데이션, 사람이 한 글자라도 고치면 일반 텍스트.**

| 화면 | 컴포넌트 | 그라데이션 판정 |
|---|---|---|
| 상품 등록 (`ProductForm.tsx`) | 카테고리 `Dropdown` · 상품 설명 · 셀링 포인트 · 메인 타겟 | `aiFilledFields` 집합 (`useProductForm.setValue`에서 수정 시 해제) |
| 판매가 (`PriceSection.tsx`) | 최종 가격 `InputSet` | 값이 가격 3안 중 하나와 일치 |
| 옵션·재고 (`OptionStockSection.tsx`) | 카테고리 `Dropdown` · 속성 6종 · 1·2단 옵션명 · 옵션값 | 목 초기값과 일치 (`isAiValue`) |
| 배송 (`ShippingSection.tsx`) | 포장 가로·세로·높이 | `packagingMock` 값과 일치. **무게는 제외**(등록 시 셀러 입력값) |
| 상세 페이지 편집 (`DetailEditPanel.tsx`) | 상품명 · 상세 설명 | `nameIsAi` / `descIsAi` — 첫 입력에서 영구 해제 |

**재고 수량·옵션별 추가 금액은 대상이 아닙니다** — 셀러가 직접 채우는 칸입니다.

> `Dropdown`은 native `<select>`라 `background-clip: text`가 먹지 않습니다.
> `Dropdown.styled.ts`의 `GradientValue`로 선택값 라벨을 덧그리고 `<select>` 글자는 투명 처리했습니다.
> 펼친 목록(`option`)은 OS가 그리므로 그라데이션 대상이 아닙니다.
>
> 📌 **확정 데이터 리스트를 받으면 위 판정 기준만 교체하면 됩니다** — 렌더링 코드는 그대로입니다.

### 하지 말아야 할 것

- ❌ **비건 립틴트 보고서·판매 관리 진입** — 목이 상품과 무관하게 한 벌뿐이라 인형 데이터가 나옵니다
- ❌ **AI 패널에 직접 타이핑** — 준비된 답변은 추천 질문 칩 21개뿐입니다
- ❌ **탭 닫고 다시 열기** — 진행 단계가 전부 초기화됩니다
- ❌ **코튼 에코백·미니 키링의 판매 화면** — 분석 보고서까지만 있습니다
- ⚠️ **창 폭 1440px 미만** — 상세 페이지 편집 패널이 사라집니다
- ❌ **판매 정보 저장을 마친 뒤 앞 단계로 되돌아가 수정** — 뒤 단계 저장이 풀리고 CTA가 다시 잠깁니다

---

## 4. 편집 시 유의사항

- [ ] **막 7은 업로드 직후 0건 화면부터 보여줍니다.** `판매 현황`을 클릭해 기존 실적으로 전환할 때 시간 경과를 설명합니다.
      클릭 후 데이터는 기존 시연 목(2026-06-15 판매 개시, 2026-08-22 기준)을 그대로 사용합니다.
      보고서·대시보드의 기존 집계는 별도 목이므로, 해당 화면으로 돌아가는 막 8·9는 실적 전환 후 진행합니다.
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
| **대시보드 시작** (립틴트만) | 210 × 19,800 / 210 × 5,600 | 매출 4,158,000 / 순이익 1,176,000 |
| **대시보드 종료** (립틴트+인형) | 4,158,000+2,572,100 / 1,176,000+742,260 | 매출 6,730,100 / 순이익 1,918,260 |
| 종료 마진율 | 1,918,260 / 6,730,100 | 28.5% |
| 종료 주문 | 168 + 76 | 244건 |
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
| `stores/useDemoProgressStore.ts` | `resetDemoSession` · `WELCOME_DISMISSED_KEY` | 삭제. 호출부는 `Sidebar.tsx`·`PasswordChangePage.tsx` 각 1줄, `WELCOME_DISMISSED_KEY`는 `DashboardPage.tsx`로 되돌린다 |
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
| `pages/sales/components/OptionStockSection.tsx` | `onStockSaved` prop · `isAiValue` | 서버가 내려주는 `aiFilled` 플래그로 교체 |

### 교체 대상 (기능은 남고 구현만 바뀌는 것)

| 파일 | 대상 | 조치 |
|---|---|---|
| `stores/useAiChatStore.ts` | `ANSWERS` · `FALLBACK_ANSWER` · `replyDelay` | `/conversations` SSE 스트리밍으로 교체. 스토어 시그니처(`messages`/`replying`/`send`)는 유지 |
| `components/common/AiLoadingOverlay/AiLoadingOverlay.tsx` | `STEPS[].durationMs` · `remainingSeconds` | `/analysis-jobs/{id}/events` SSE 단계 이벤트로 진행 갱신 |
| `pages/sales/DetailPage.tsx` | `uploadToShopee`의 `setTimeout` · `markUploaded` | 업로드 API 호출 + 응답 상태 사용 |
| `mocks/detailImage.ts` | `generatedImageSrcMock` | 이미지 생성 API 응답 URL |
| `pages/products/ProductEditPage.tsx` | `CHANGE_IMPACTS` · `summarizeChanges` | 변경 요청 응답의 영향 필드로 대체 |
| `pages/sales/components/PdpPreview.tsx` | `LABELS` | 국가 코드별 사전으로 확장 (현재 한국어·베트남어만) |
| `OptionStockSection` · `PriceSection` · `ShippingSection` · `DetailEditPanel` | `aiFilled` 판정 (목 값 비교) | 응답 필드별 `aiGenerated` 플래그로 교체. `InputSet`/`TextareaSet`/`Dropdown`의 `aiFilled` prop은 그대로 유지 |

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
| 판매 관리 실적은 제목 클릭으로 공개 | 업로드 직후 0건 → 클릭 후 기존 실적 | 상품·국가별 세션 유지, 로그아웃 초기화 |
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

마지막 검증(2026-08-29): `npx tsc -b` · `npm run lint` 통과, 브라우저에서
상품 등록 · 판매 정보 7단계 · 상세 페이지 편집의 그라데이션 표시/해제까지 확인 완료.
