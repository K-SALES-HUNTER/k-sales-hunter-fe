import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import plusHIcon from '@/assets/icons/plus-h.svg';
import plusVIcon from '@/assets/icons/plus-v.svg';
import Button from '@/components/common/Button';
import PageHeader from '@/components/layout/PageHeader';
import { useDashboardSummary, useHasLinkedMarket, useRecentProducts } from '@/hooks/useDashboard';
import { PATH } from '@/routes/paths';
// 환영 모달은 세션당 1번만 노출 — 키는 로그아웃 초기화 대상이라 스토어 쪽에서 함께 관리한다
import { WELCOME_DISMISSED_KEY } from '@/stores/useDemoProgressStore';
import OverviewSection from './components/OverviewSection';
import RecentProductsSection from './components/RecentProductsSection';
import WelcomeModal from './components/WelcomeModal';
import * as S from './DashboardPage.styled';

/** dashboard (Figma 221:613) */
const DashboardPage = () => {
  const navigate = useNavigate();
  const { data: summary, isLoading: isSummaryLoading } = useDashboardSummary();
  const { data: products, isLoading: isProductsLoading } = useRecentProducts();
  const { data: hasLinkedMarket } = useHasLinkedMarket();

  const [welcomeDismissed, setWelcomeDismissed] = useState(() =>
    Boolean(sessionStorage.getItem(WELCOME_DISMISSED_KEY)),
  );
  const welcomeOpen = hasLinkedMarket === false && !welcomeDismissed;

  const closeWelcome = () => {
    sessionStorage.setItem(WELCOME_DISMISSED_KEY, 'true');
    setWelcomeDismissed(true);
  };

  return (
    <>
      <PageHeader
        title="대시보드"
        description="글로벌 판매 기회와 실시간 인사이트"
        action={
          <Button
            variant="primary"
            icon={<S.PlusIcon aria-hidden><img src={plusHIcon} alt="" /><img src={plusVIcon} alt="" /></S.PlusIcon>}
            onClick={() => navigate(PATH.PRODUCT_REGISTER)}
          >
            상품 등록하기
          </Button>
        }
      />

      <S.Content>
        {/* 명세: 응답 전에는 카드 자리를 스켈레톤으로 유지 (도착한 카드부터 순서 무관 교체) */}
        {isSummaryLoading && <S.Skeleton $height={160} aria-hidden />}
        {summary && <OverviewSection summary={summary} />}

        {isProductsLoading && (
          <S.SkeletonGroup aria-hidden>
            <S.Skeleton $height={42} />
            <S.Skeleton $height={64} />
            <S.Skeleton $height={64} />
            <S.Skeleton $height={64} />
            <S.Skeleton $height={64} />
          </S.SkeletonGroup>
        )}
        {/* 명세: 상품 0건이면 테이블·전체보기 대신 Title section으로 등록을 유도 */}
        {products && products.length === 0 && (
          <S.TitleSection>
            <S.TitleSectionTitle>상품을 등록해주세요</S.TitleSectionTitle>
            <S.TitleSectionDescription>
              상품을 먼저 등록해야 분석이 가능해요. 최소한의 정보만 기입해주시면 AI가 나머지를
              자동으로 채워드릴게요.
            </S.TitleSectionDescription>
          </S.TitleSection>
        )}
        {products && products.length > 0 && <RecentProductsSection products={products} />}
      </S.Content>

      <WelcomeModal open={welcomeOpen} onClose={closeWelcome} />
    </>
  );
};

export default DashboardPage;
