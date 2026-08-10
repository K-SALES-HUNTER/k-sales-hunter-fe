import { useSearchParams } from 'react-router-dom';
import PageHeader from '@/components/layout/PageHeader';
import AccountTab from './components/AccountTab';
import MarketInfoTab from './components/MarketInfoTab';
import MarketplaceTab from './components/MarketplaceTab';
import * as S from './SettingsPage.styled';

const TABS = [
  { key: 'account', label: '계정 정보' },
  { key: 'market', label: '마켓 정보' },
  { key: 'marketplace', label: '마켓플레이스 연동' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

/**
 * 마켓 / 설정 (MKT-01-01 · Figma 223:3489 / 223:3516 / 224:3695 · 224:4069) —
 * 탭 전환은 라우팅 없이 처리하고, 활성 탭은 URL 쿼리(?tab=)로 유지해 새로고침 복원.
 */
const SettingsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const activeTab: TabKey = TABS.some((t) => t.key === tabParam)
    ? (tabParam as TabKey)
    : 'account';

  return (
    <S.Page>
      <PageHeader
        title="마켓 / 설정"
        description="글로벌 판매 기회와 실시간 인사이트"
      />
      <S.TabList role="tablist" aria-label="마켓 / 설정 탭">
        {TABS.map((tab) => (
          <S.TabButton
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            $active={activeTab === tab.key}
            onClick={() => setSearchParams({ tab: tab.key })}
          >
            {tab.label}
          </S.TabButton>
        ))}
      </S.TabList>
      <S.TabPanel role="tabpanel">
        {activeTab === 'account' && <AccountTab />}
        {activeTab === 'market' && <MarketInfoTab />}
        {activeTab === 'marketplace' && <MarketplaceTab />}
      </S.TabPanel>
    </S.Page>
  );
};

export default SettingsPage;
