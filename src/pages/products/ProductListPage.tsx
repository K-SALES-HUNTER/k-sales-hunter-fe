import { useEffect, useState } from 'react';
import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { useNavigate, useSearchParams } from 'react-router-dom';
import listSearchIcon from '@/assets/icons/list-search.svg';
import plusHIcon from '@/assets/icons/plus-h.svg';
import plusVIcon from '@/assets/icons/plus-v.svg';
import Button from '@/components/common/Button';
import ReportChip from '@/components/common/ReportChip';
import PageHeader from '@/components/layout/PageHeader';
import { useProducts } from '@/hooks/useProducts';
import { buildPath, PATH } from '@/routes/paths';

/** 페이지 크기 — Figma 상품 목록이 한 페이지에 10행을 보여준다 */
const PAGE_SIZE = 10;
/** 검색 입력 디바운스 (명세: 300ms) */
const SEARCH_DEBOUNCE_MS = 300;

/** 전체 상품 리스트 (PRD-02-01, Figma 227:2340) */
const ProductListPage = () => {
  const navigate = useNavigate();
  const { data: products, isLoading } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState('');
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    const timer = setTimeout(
      () => setKeyword(searchInput.trim()),
      SEARCH_DEBOUNCE_MS,
    );
    return () => clearTimeout(timer);
  }, [searchInput]);

  const filtered = (products ?? []).filter((product) =>
    product.name.toLowerCase().includes(keyword.toLowerCase()),
  );

  // 페이지네이션 — 현재 페이지는 URL 쿼리(?page=)로 유지 (명세 PRD-02-01 #7)
  const rawPage = Number(searchParams.get('page')) || 1;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(rawPage, 1), totalPages);

  // 검색으로 결과가 줄어드는 등 범위를 벗어난 페이지는 URL도 함께 보정
  useEffect(() => {
    if (!isLoading && rawPage !== page) {
      setSearchParams(page === 1 ? {} : { page: String(page) }, { replace: true });
    }
  }, [isLoading, rawPage, page, setSearchParams]);

  const goPage = (next: number) => {
    setSearchParams(next === 1 ? {} : { page: String(next) });
  };

  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const goReport = (productId: number, countryCode?: string) => {
    navigate(
      countryCode
        ? buildPath.countryReport(productId, countryCode)
        : buildPath.totalReport(productId),
    );
  };

  const hasProducts = (products ?? []).length > 0;

  return (
    <>
      <PageHeader
        title="전체 상품 리스트"
        description="글로벌 판매 기회와 실시간 인사이트"
        action={
          <Button
            variant="primary"
            icon={
              <PlusIcon aria-hidden>
                <img src={plusHIcon} alt="" />
                <img src={plusVIcon} alt="" />
              </PlusIcon>
            }
            onClick={() => navigate(PATH.PRODUCT_REGISTER)}
          >
            상품 등록하기
          </Button>
        }
      />

      <Content>
        {isLoading && (
          <SkeletonGroup aria-hidden>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </SkeletonGroup>
        )}

        {/* 명세: 상품 0건이면 목록 영역을 Title section(Figma 167:332)으로 대체 */}
        {!isLoading && !hasProducts && (
          <TitleSection>
            <TitleSectionTitle>상품을 등록해주세요</TitleSectionTitle>
            <TitleSectionDescription>
              상품을 먼저 등록해야 분석이 가능해요. 최소한의 정보만 기입해주시면 AI가 나머지를
              자동으로 채워드릴게요.
            </TitleSectionDescription>
          </TitleSection>
        )}

        {!isLoading && hasProducts && (
          <Section>
            {/* search_bar (Figma 160:90) — 목록 상단 전체 폭, 좌측 아이콘 + 300ms 디바운스 */}
            <SearchBar>
              <SearchIcon src={listSearchIcon} alt="" aria-hidden />
              <SearchInput
                type="search"
                placeholder="상품명 검색"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                aria-label="상품명 검색"
              />
            </SearchBar>

            <TitleRow>
              <Title>전체 상품</Title>
              <Count>총 {filtered.length}개</Count>
            </TitleRow>

            {filtered.length === 0 ? (
              <TitleSection>
                <TitleSectionTitle>검색 결과가 없습니다</TitleSectionTitle>
                <TitleSectionDescription>
                  다른 상품명으로 다시 검색해 보세요.
                </TitleSectionDescription>
              </TitleSection>
            ) : (
              <>
                <TableWrapper>
                  <Table>
                    <thead>
                      <tr>
                        <th>이미지</th>
                        <th>상품명</th>
                        <th>매출</th>
                        <th>등록일</th>
                        <th>분석 보고서</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageItems.map((product) => (
                        <tr key={product.id}>
                          <td>
                            <Thumbnail src={product.image} alt={product.name} />
                          </td>
                          <td>
                            {/* 명세: 상품명 클릭 시 전체 분석 보고서로 이동 */}
                            <ProductNameButton
                              type="button"
                              onClick={() => goReport(product.id)}
                            >
                              {product.name}
                            </ProductNameButton>
                          </td>
                          {/* 매출은 판매 중인 상품만 표출, 없으면 빈 셀 */}
                          <td>
                            {product.revenue !== null
                              ? `${product.revenue.toLocaleString()}원`
                              : ''}
                          </td>
                          <td>{product.registeredAt}</td>
                          <td>
                            <ChipRow>
                              <ReportChip
                                variant="total"
                                label="전체"
                                onClick={() => goReport(product.id)}
                              />
                              {product.countries.map((country) => (
                                <ReportChip
                                  key={country.code}
                                  variant="country"
                                  label={country.name}
                                  onClick={() => goReport(product.id, country.code)}
                                />
                              ))}
                            </ChipRow>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </TableWrapper>

                {/* Figma는 한 페이지만 있어도 페이지 번호를 노출한다 */}
                {totalPages >= 1 && (
                  <Pagination aria-label="페이지네이션">
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                      (pageNumber) => (
                        <PageButton
                          key={pageNumber}
                          type="button"
                          $active={pageNumber === page}
                          aria-current={pageNumber === page ? 'page' : undefined}
                          onClick={() => goPage(pageNumber)}
                        >
                          {pageNumber}
                        </PageButton>
                      ),
                    )}
                  </Pagination>
                )}
              </>
            )}
          </Section>
        )}
      </Content>
    </>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: ${({ theme }) => `0 ${theme.spacing.md}`};
`;

/** icon/plus — 가로/세로 획 2개를 겹쳐 십자 구성 (dashboard PlusIcon 패턴) */
const PlusIcon = styled.span`
  position: relative;
  display: inline-block;
  width: 22px;
  height: 22px;
  flex-shrink: 0;

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  img:first-of-type {
    width: 13px;
  }

  img:last-of-type {
    height: 13px;
  }
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
`;

const Title = styled.h2`
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

/** search_bar (Figma 160:90) — 높이 42, 라운드 10, 좌측 아이콘 20px(left 12) */
const SearchBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 42px;
  border: 0.8px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SearchIcon = styled.img`
  position: absolute;
  left: 12px;
  width: 20px;
  height: 20px;
  pointer-events: none;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 100%;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md} ${theme.spacing.xs} 40px`};
  border: none;
  border-radius: inherit;
  background: transparent;
  ${({ theme }) => theme.typography.body01};
  color: ${({ theme }) => theme.colors.textPrimary};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const Count = styled.p`
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
`;

const TableWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
    text-align: left;
    ${({ theme }) => theme.typography.label02};
    color: ${({ theme }) => theme.colors.textSecondary};
    white-space: nowrap;
  }

  td {
    height: 64px;
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    ${({ theme }) => theme.typography.body01};
    color: ${({ theme }) => theme.colors.textPrimary};
    white-space: nowrap;
  }
`;

const Thumbnail = styled.img`
  width: 48px;
  height: 48px;
  border-radius: ${({ theme }) => theme.radius.sm};
  object-fit: cover;
  background: ${({ theme }) => theme.colors.bgLight};
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const ProductNameButton = styled.button`
  ${({ theme }) => theme.typography.body01};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: left;

  &:hover {
    text-decoration: underline;
  }
`;

/** 페이지네이션 (Figma Frame 196 · 303:3151) — 배경 없는 12px 숫자, 가운데 정렬 */
const Pagination = styled.nav`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.xs} 0`};
`;

const PageButton = styled.button<{ $active: boolean }>`
  min-width: 16px;
  ${({ theme }) => theme.typography.caption01};
  background: transparent;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.textPrimary : theme.colors.textSecondary};
  font-weight: ${({ $active }) => ($active ? 700 : 400)};

  @media (hover: hover) {
    &:hover {
      color: ${({ theme }) => theme.colors.textPrimary};
    }
  }
`;

/** 빈 상태 Title section (Figma 167:332) — bg/light, 좌측 정렬, Heading/03 + Body/01 */
const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  background: ${({ theme }) => theme.colors.bgLight};
`;

const TitleSectionTitle = styled.p`
  ${({ theme }) => theme.typography.heading03};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const TitleSectionDescription = styled.p`
  ${({ theme }) => theme.typography.body01};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const shimmer = keyframes`
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
`;

const SkeletonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SkeletonRow = styled.div`
  height: 64px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.bgLight} 25%,
    ${({ theme }) => theme.colors.bgGray} 50%,
    ${({ theme }) => theme.colors.bgLight} 75%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.2s ease-in-out infinite;
`;

export default ProductListPage;
