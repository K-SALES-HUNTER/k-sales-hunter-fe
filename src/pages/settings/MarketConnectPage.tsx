import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import settingsBackIcon from '@/assets/icons/settings-back.svg';
import settingsCheckIcon from '@/assets/icons/settings-check.svg';
import { useConnectedStores, useConnectStore, useDisconnectStore } from '@/hooks/useSettings';
import { SHOPEE_COUNTRIES } from '@/mocks/settings';
import { PATH } from '@/routes/paths';
import DisconnectStoreModal from './components/DisconnectStoreModal';
import * as S from './MarketConnectPage.styled';

const MARKETPLACE_TAB_PATH = `${PATH.SETTINGS}?tab=marketplace`;

/**
 * 판매 국가 연동 (MKT-02-01 · Figma 560:6658) —
 * 12개 판매 국가를 각각 독립적으로 연동. 완료 시 마켓플레이스 연동 탭 복귀.
 */
const MarketConnectPage = () => {
  const navigate = useNavigate();
  const { data: stores = [] } = useConnectedStores();
  const { mutate: connect, isPending: isConnecting, variables: connectingCode } =
    useConnectStore();
  const { mutate: disconnect, isPending: isDisconnecting } = useDisconnectStore();

  /** 해제 확인 모달 대상 국가 코드 */
  const [releaseTarget, setReleaseTarget] = useState<string | null>(null);

  const connectedCodes = new Set(stores.map((store) => store.countryCode));

  const handleDisconnect = () => {
    if (!releaseTarget || isDisconnecting) return;
    disconnect(releaseTarget, { onSuccess: () => setReleaseTarget(null) });
  };

  return (
    <S.Page>
      <S.TopBar>
        {/* 명세: 뒤로가기 → 마켓플레이스 연동 탭 복귀 */}
        <S.BackButton
          type="button"
          aria-label="뒤로가기"
          onClick={() => navigate(MARKETPLACE_TAB_PATH)}
        >
          <img src={settingsBackIcon} alt="" />
        </S.BackButton>
        <S.TopTitle>스토어 연동</S.TopTitle>
      </S.TopBar>

      <S.Content>
        <S.TitleBlock>
          <S.Title>판매 국가 선택</S.Title>
          <S.Description>연동할 Shopee 스토어의 판매 국가를 선택해 주세요.</S.Description>
        </S.TitleBlock>

        <S.Notice>
          선택한 국가의 스토어에서 Shopee 판매자 계정으로 로그인한 후 연동 버튼을 클릭해 주세요.
        </S.Notice>

        <S.CountryGrid>
          {SHOPEE_COUNTRIES.map((country) => {
            const isConnected = connectedCodes.has(country.code);
            const isConnectingThis = isConnecting && connectingCode === country.code;

            return (
              <S.CountryRow key={country.code} $connected={isConnected}>
                <S.CountryName>{country.name}</S.CountryName>
                {isConnected ? (
                  <>
                    <S.ConnectedBadge>
                      <img src={settingsCheckIcon} alt="" />
                      연동 완료
                    </S.ConnectedBadge>
                    <S.ReleaseButton
                      type="button"
                      onClick={() => setReleaseTarget(country.code)}
                    >
                      스토어 해제
                    </S.ReleaseButton>
                  </>
                ) : (
                  // 목: 클릭 후 1초 뒤 연동 완료 (실서비스에서는 국가별 Shopee OAuth 이동)
                  <S.ConnectButton
                    type="button"
                    disabled={isConnectingThis}
                    onClick={() => connect(country.code)}
                  >
                    {isConnectingThis ? '연동 중…' : '연동하기'}
                  </S.ConnectButton>
                )}
              </S.CountryRow>
            );
          })}
        </S.CountryGrid>

        {/* 명세: 연동 국가 0개면 비활성. 클릭 → 마켓플레이스 연동 탭 복귀 */}
        <S.DefaultButton
          type="button"
          variant="primary"
          fullWidth
          disabled={stores.length === 0}
          onClick={() => navigate(MARKETPLACE_TAB_PATH)}
        >
          완료
        </S.DefaultButton>
      </S.Content>

      <DisconnectStoreModal
        open={releaseTarget !== null}
        loading={isDisconnecting}
        onConfirm={handleDisconnect}
        onClose={() => setReleaseTarget(null)}
      />
    </S.Page>
  );
};

export default MarketConnectPage;
