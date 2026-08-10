import { useEffect, useRef, type ReactNode } from 'react';
import styled from '@emotion/styled';
import { NavLink, useNavigate } from 'react-router-dom';
import arrowRightIcon from '@/assets/icons/arrow-right.svg';
import editIcon from '@/assets/icons/edit.svg';
import Sidebar from '@/components/layout/Sidebar';
import { buildPath } from '@/routes/paths';
import type { Product } from '@/types/product';
import AiPanel from './AiPanel';
import ProductTree from './ProductTree';

interface ProductShellProps {
  product: Product;
  /** 헤더 제목 (페이지명) */
  title: string;
  /** 뒤로가기 목적지 — 브라우저 back이 아닌 논리적 상위 페이지 (레이아웃 명세) */
  backTo: string;
  /** 국가 컨텍스트일 때 페이지 탭 노출 */
  countryCode?: string;
  /** 페이지별 AI 추천 프롬프트 */
  recommendedPrompts: string[];
  children: ReactNode;
}

/**
 * 2 Depth 기본 레이아웃 (레이아웃 명세 2.2) —
 * 트리 사이드바 + 콘텐츠(헤더 → 페이지 탭 → 상품 헤더 → 스크롤 콘텐츠) + AI 패널 3단.
 * 콘텐츠와 AI 패널은 서로 독립적으로 스크롤한다.
 */
const ProductShell = ({
  product,
  title,
  backTo,
  countryCode,
  recommendedPrompts,
  children,
}: ProductShellProps) => {
  const navigate = useNavigate();
  const mainRef = useRef<HTMLElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const country = product.countries.find((c) => c.code === countryCode);

  /**
   * 고정 스택(헤더+페이지 탭+상품 헤더) 높이를 실측해 CSS 변수로 노출한다.
   * 콘텐츠 쪽 섹션 탭이 이 값을 sticky top / scroll-margin 오프셋으로 사용하므로
   * 탭 유무·상품명 줄바꿈으로 높이가 바뀌어도 겹치지 않는다.
   */
  useEffect(() => {
    const stack = stackRef.current;
    const main = mainRef.current;
    if (!stack || !main) return;

    const sync = () => {
      main.style.setProperty('--shell-sticky-h', `${stack.offsetHeight}px`);
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(stack);
    return () => observer.disconnect();
  }, []);

  // 아직 생성되지 않은 페이지의 탭은 보이지 않음 (조건 렌더)
  const tabs = country
    ? [
        { label: '분석 보고서', to: buildPath.countryReport(product.id, country.code), show: true },
        { label: '판매 정보', to: buildPath.salesInfo(product.id, country.code), show: country.hasSalesInfo },
        { label: '상세 페이지', to: buildPath.detailPage(product.id, country.code), show: country.hasDetailPage },
        { label: '판매 관리', to: buildPath.salesOps(product.id, country.code), show: country.salesStatus !== '판매전' },
      ].filter((t) => t.show)
    : [];

  return (
    <Layout>
      <Sidebar tree={<ProductTree product={product} />} />

      <Main ref={mainRef}>
        {/* 헤더·페이지 탭·상품 헤더를 하나의 sticky 블록으로 묶는다 (개별 top 오프셋을 쓰면
            탭이 없는 화면에서 사이에 빈 틈이 생겨 콘텐츠가 비쳐 보인다) */}
        <StickyStack ref={stackRef}>
          <BackHeader>
            <BackButton type="button" onClick={() => navigate(backTo)} aria-label="뒤로가기">
              <BackIcon src={arrowRightIcon} alt="" />
            </BackButton>
            <HeaderTitle>{title}</HeaderTitle>
          </BackHeader>

          {tabs.length > 1 && (
            <TabRow>
              {tabs.map((tab) => (
                <Tab key={tab.to} to={tab.to} end>
                  {tab.label}
                </Tab>
              ))}
            </TabRow>
          )}

          <ProductBar>
            <ProductInfo>
              <Thumbnail src={product.image} alt="" />
              <div>
                <NameRow>
                  <Name>{product.name}</Name>
                  <Category>{product.category}</Category>
                </NameRow>
                <Cost>공급 원가: ₩{product.costPrice.toLocaleString()}</Cost>
              </div>
            </ProductInfo>
            {/* 연필 아이콘 — 초기 입력 정보 확인·수정 (EDT-01-01 진입점) */}
            <EditButton
              type="button"
              onClick={() => navigate(buildPath.productEdit(product.id))}
              aria-label="상품 정보 수정"
            >
              <img src={editIcon} alt="" />
            </EditButton>
          </ProductBar>
        </StickyStack>

        <Content>{children}</Content>
      </Main>

      <AiPanel recommendedPrompts={recommendedPrompts} />
    </Layout>
  );
};

/* 레이아웃 명세 2.2: 콘텐츠와 AI 패널은 서로 독립적으로 스크롤 */
const Layout = styled.div`
  display: flex;
  align-items: stretch;
  height: 100vh;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
`;

const Main = styled.main`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const StickyStack = styled.div`
  position: sticky;
  top: 0;
  z-index: 20;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.surface};
`;

const BackHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  height: 82px;
  padding: ${({ theme }) => `0 ${theme.spacing.md}`};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radius.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.bgLight};
  }
`;

const BackIcon = styled.img`
  width: 8px;
  transform: rotate(180deg);
`;

const HeaderTitle = styled.h1`
  ${({ theme }) => theme.typography.heading03};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TabRow = styled.div`
  display: flex;
  height: 40px;
  padding: ${({ theme }) => `0 ${theme.spacing.md}`};
  border-bottom: 0.8px solid ${({ theme }) => theme.colors.border};
`;

const Tab = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => `0 ${theme.spacing.md}`};
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textSecondary};
  border-bottom: 2px solid transparent;

  &.active {
    color: ${({ theme }) => theme.colors.primary};
    border-bottom-color: ${({ theme }) => theme.colors.primary};
  }

  &:hover:not(.active) {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const ProductBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) =>
    `${theme.spacing.xxs} ${theme.spacing.md} ${theme.spacing.md}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.bgGray};
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
`;

const Thumbnail = styled.img`
  width: 54px;
  height: 54px;
  flex-shrink: 0;
  border-radius: 6px;
  object-fit: cover;
  background: ${({ theme }) => theme.colors.bgLight};
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Name = styled.p`
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Category = styled.span`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Cost = styled.p`
  margin-top: ${({ theme }) => theme.spacing.xxs};
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radius.md};

  img {
    width: 22px;
    height: 22px;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.bgLight};
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
`;

export default ProductShell;
