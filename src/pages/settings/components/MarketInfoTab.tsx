import { useState } from 'react';
import Dropdown from '@/components/common/Dropdown';
import TextareaSet from '@/components/common/TextareaSet';
import { useMarketInfo, useUpdateMarketInfo } from '@/hooks/useSettings';
import { BRAND_DIRECTION_OPTIONS, SELLER_TYPE_OPTIONS } from '@/mocks/settings';
import type { MarketInfo } from '@/types/settings';
import * as S from '../SettingsPage.styled';

const EMPTY_MARKET_INFO: MarketInfo = {
  brandDirection: '',
  sellerType: '',
  mainTarget: '',
  brandTone: '',
};

/** 마켓 정보 탭 (MKT-01-01 #9~13 · Figma 223:3516) */
const MarketInfoTab = () => {
  const { data: market } = useMarketInfo();
  const { mutate: save, isPending } = useUpdateMarketInfo();

  const [form, setForm] = useState<MarketInfo>(EMPTY_MARKET_INFO);

  // 조회값을 편집 초기값으로 동기화 (렌더 중 상태 조정 패턴 — 저장 후 refetch 시 기준값 갱신)
  const [syncedMarket, setSyncedMarket] = useState<MarketInfo | undefined>(undefined);
  if (market !== syncedMarket) {
    setSyncedMarket(market);
    if (market) setForm(market);
  }

  const setField = <K extends keyof MarketInfo>(key: K, value: MarketInfo[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // 명세: 값이 변경됐을 때만 저장 버튼 활성
  const isChanged =
    market !== undefined &&
    (Object.keys(form) as (keyof MarketInfo)[]).some((key) => form[key] !== market[key]);

  return (
    <>
      <S.FieldRows>
        <S.FieldRow>
          <Dropdown
            label="브랜드 방향"
            options={BRAND_DIRECTION_OPTIONS}
            placeholder="선택"
            value={form.brandDirection}
            onChange={(e) => setField('brandDirection', e.target.value)}
          />
          <Dropdown
            label="셀러 유형"
            options={SELLER_TYPE_OPTIONS}
            placeholder="선택"
            value={form.sellerType}
            onChange={(e) => setField('sellerType', e.target.value)}
          />
        </S.FieldRow>
        {/* Figma 526:6572 — 두 필드 모두 124px 높이의 여러 줄 입력 박스 */}
        <S.FieldRow>
          <TextareaSet
            label="메인 타겟층"
            placeholder="마켓의 메인 타겟을 작성해 주세요."
            rows={5}
            value={form.mainTarget}
            onChange={(e) => setField('mainTarget', e.target.value)}
          />
          <TextareaSet
            label="브랜드 톤&무드"
            placeholder="마켓의 브랜드 톤&무드를 작성해주세요."
            rows={5}
            value={form.brandTone}
            onChange={(e) => setField('brandTone', e.target.value)}
          />
        </S.FieldRow>
      </S.FieldRows>
      <S.SaveRow>
        <S.DefaultButton
          type="button"
          variant="primary"
          disabled={!isChanged}
          loading={isPending}
          onClick={() => save(form)}
        >
          저장
        </S.DefaultButton>
      </S.SaveRow>
    </>
  );
};

export default MarketInfoTab;
