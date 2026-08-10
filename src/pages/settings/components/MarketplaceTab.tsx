import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import settingsCheckIcon from '@/assets/icons/settings-check.svg';
import settingsXIcon from '@/assets/icons/settings-x.svg';
import Button from '@/components/common/Button';
import { useConnectedStores, useDisconnectStore } from '@/hooks/useSettings';
import { PATH } from '@/routes/paths';
import * as S from '../SettingsPage.styled';
import DisconnectStoreModal from './DisconnectStoreModal';

const SELLER_CENTRE_URL = 'https://seller.shopee.com';

/** 마켓플레이스 연동 탭 (MKT-01-01 #14~17 · Figma 224:3695 / 224:4069) */
const MarketplaceTab = () => {
  const navigate = useNavigate();
  const { data: stores = [] } = useConnectedStores();
  const { mutate: disconnect, isPending: isDisconnecting } = useDisconnectStore();

  /** 해제 확인 모달 대상 국가 코드 */
  const [releaseTarget, setReleaseTarget] = useState<string | null>(null);

  const hasStores = stores.length > 0;

  const handleDisconnect = () => {
    if (!releaseTarget || isDisconnecting) return;
    disconnect(releaseTarget, { onSuccess: () => setReleaseTarget(null) });
  };

  return (
    <S.MarketplaceSections>
      <div>
        <S.SectionTitle>Shopee 연동</S.SectionTitle>
        {/* 명세: 섹션 상단 상시 안내 */}
        <S.SectionDesc>
          Shopee 셀러 계정을 연동해야 상품 자동 업로드 기능을 사용할 수 있습니다.
        </S.SectionDesc>
      </div>

      {hasStores ? (
        <S.StoreList>
          {stores.map((store) => (
            <S.StoreCard key={store.countryCode} $connected>
              <S.StoreCardBody>
                <S.ShopeeBadge aria-hidden>S</S.ShopeeBadge>
                <div>
                  <S.StoreCardTitle $connected>
                    {store.countryName} · {store.storeName}
                  </S.StoreCardTitle>
                  <S.StoreCardStatus $connected>
                    <img src={settingsCheckIcon} alt="" />
                    연결일: {store.connectedAt}
                  </S.StoreCardStatus>
                </div>
              </S.StoreCardBody>
              <S.ReleaseButton
                type="button"
                onClick={() => setReleaseTarget(store.countryCode)}
              >
                스토어 해제
              </S.ReleaseButton>
            </S.StoreCard>
          ))}
        </S.StoreList>
      ) : (
        <S.StoreCard $connected={false}>
          <S.StoreCardBody>
            <S.ShopeeBadge aria-hidden>S</S.ShopeeBadge>
            <div>
              <S.StoreCardTitle $connected={false}>연동 상태</S.StoreCardTitle>
              <S.StoreCardStatus $connected={false}>
                <img src={settingsXIcon} alt="" />
                연결된 Shopee 스토어가 없습니다.
              </S.StoreCardStatus>
            </div>
          </S.StoreCardBody>
        </S.StoreCard>
      )}

      {/*
        Figma 224:4069(비연동)는 연동하기 + Seller Centre 2개 버튼,
        224:3695(연동 후)는 연동하기 1개만 전체 폭으로 둔다.
      */}
      <S.ActionRow>
        {/* 명세: 연동 유무와 무관하게 항상 활성 — 타 국가 추가 연동 가능 */}
        <S.DefaultButton
          type="button"
          variant="primary"
          fullWidth
          onClick={() => navigate(PATH.SETTINGS_MARKET_CONNECT)}
        >
          스토어 연동하기
        </S.DefaultButton>
        {!hasStores && (
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => window.open(SELLER_CENTRE_URL, '_blank', 'noopener,noreferrer')}
          >
            Shopee Seller Centre 열기
          </Button>
        )}
      </S.ActionRow>

      <S.GuideBox>
        <S.GuideTitle>Shopee 연동 준비사항</S.GuideTitle>
        <S.GuideList>
          <li>Seller Centre에서 판매자 계정과 판매 국가의 스토어를 준비합니다.</li>
          <li>연동하려는 Shopee 판매자 계정으로 로그인한 상태에서 스토어 연동을 진행합니다.</li>
          <li>Shopee 인증 화면에서 K-sales Hunter 접근 권한을 승인합니다.</li>
        </S.GuideList>
      </S.GuideBox>

      <DisconnectStoreModal
        open={releaseTarget !== null}
        loading={isDisconnecting}
        onConfirm={handleDisconnect}
        onClose={() => setReleaseTarget(null)}
      />
    </S.MarketplaceSections>
  );
};

export default MarketplaceTab;
