import { useState } from 'react';
import styled from '@emotion/styled';
import { NavLink, useLocation } from 'react-router-dom';
import treeChevronIcon from '@/assets/icons/tree-chevron.svg';
import treeChevronOpenIcon from '@/assets/icons/tree-chevron-open.svg';
import treeFlagIcon from '@/assets/icons/tree-flag.svg';
import treePageIcon from '@/assets/icons/tree-page.svg';
import treeProductIcon from '@/assets/icons/tree-product.svg';
import treeReportIcon from '@/assets/icons/tree-report.svg';
import treeReportActiveIcon from '@/assets/icons/tree-report-active.svg';
import SalesStatusBadge from '@/components/common/SalesStatusBadge';
import { buildPath } from '@/routes/paths';
import { salesOpsKey, useSalesOpsStore } from '@/stores/useSalesOpsStore';
import type { Product } from '@/types/product';

interface ProductTreeProps {
  product: Product;
}

/**
 * 2 Depth 사이드바 상품 트리 (레이아웃 명세 2.2 ①)
 * 상품 → 국가 → (보고서 / 판매 정보 / 상세 페이지 / 판매 관리) 구조.
 * 아직 생성되지 않은 산출물 항목은 렌더하지 않는다 (조건 렌더).
 */
const ProductTree = ({ product }: ProductTreeProps) => {
  const { pathname } = useLocation();
  const statusByKey = useSalesOpsStore((s) => s.statusByKey);
  // 현재 라우트에 해당하는 국가 노드는 기본으로 펼침
  const [openCountries, setOpenCountries] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      product.countries.map((c) => [c.code, pathname.includes(`/${c.code}`)]),
    ),
  );

  const toggleCountry = (code: string) =>
    setOpenCountries((prev) => ({ ...prev, [code]: !prev[code] }));

  return (
    <div>
      <SectionLabel>현재 상품</SectionLabel>

      <ProductRow title={product.name}>
        <RowIcon src={treeProductIcon} alt="" />
        <ProductName>{product.name}</ProductName>
      </ProductRow>

      <TreeLink to={buildPath.totalReport(product.id)} end>
        {({ isActive }) => (
          <>
            <Spacer />
            <RowIcon src={isActive ? treeReportActiveIcon : treeReportIcon} alt="" />
            <RowLabel $active={isActive}>글로벌 분석 보고서</RowLabel>
          </>
        )}
      </TreeLink>

      {product.countries.map((country) => {
        const open = openCountries[country.code];
        // 판매 중단/재개는 스토어 오버라이드가 목 기본값보다 우선 (판매 관리 화면과 상태 일치)
        const salesStatus =
          statusByKey[salesOpsKey(product.id, country.code)] ?? country.salesStatus;
        return (
          <div key={country.code}>
            <CountryRow>
              <ChevronButton
                type="button"
                onClick={() => toggleCountry(country.code)}
                aria-label={`${country.name} 트리 ${open ? '접기' : '펼치기'}`}
              >
                <img src={open ? treeChevronOpenIcon : treeChevronIcon} alt="" />
              </ChevronButton>
              <TreeLink to={buildPath.countryReport(product.id, country.code)} $inline>
                {({ isActive }) => (
                  <>
                    <RowIcon src={treeFlagIcon} alt="" />
                    <CountryBadge>{country.code}</CountryBadge>
                    <RowLabel $active={isActive}>{country.name} 보고서</RowLabel>
                  </>
                )}
              </TreeLink>
            </CountryRow>

            {open && (
              <>
                {country.hasSalesInfo && (
                  <TreeLink to={buildPath.salesInfo(product.id, country.code)} $depth={2}>
                    {({ isActive }) => (
                      <>
                        <RowIcon src={treePageIcon} alt="" />
                        <RowLabel $active={isActive}>판매 정보</RowLabel>
                      </>
                    )}
                  </TreeLink>
                )}
                {country.hasDetailPage && (
                  <TreeLink to={buildPath.detailPage(product.id, country.code)} $depth={2}>
                    {({ isActive }) => (
                      <>
                        <RowIcon src={treePageIcon} alt="" />
                        <RowLabel $active={isActive}>상세페이지</RowLabel>
                      </>
                    )}
                  </TreeLink>
                )}
                {salesStatus !== '판매전' && (
                  <TreeLink to={buildPath.salesOps(product.id, country.code)} $depth={2}>
                    {({ isActive }) => (
                      <>
                        <RowIcon src={treePageIcon} alt="" />
                        <RowLabel $active={isActive}>판매 관리</RowLabel>
                        <SalesStatusBadge status={salesStatus} />
                      </>
                    )}
                  </TreeLink>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

const SectionLabel = styled.p`
  padding: ${({ theme }) => `0 ${theme.spacing.sm} ${theme.spacing.xs}`};
  ${({ theme }) => theme.typography.captionStrong};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProductRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 4px 8px 4px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
`;

const ProductName = styled.p`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const RowIcon = styled.img`
  width: 15px;
  height: 15px;
  flex-shrink: 0;
`;

const Spacer = styled.span`
  width: 14px;
  flex-shrink: 0;
`;

const TreeLink = styled(NavLink, {
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $inline?: boolean; $depth?: number }>`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  min-width: 0;
  flex: ${({ $inline }) => ($inline ? 1 : 'none')};
  padding: ${({ $inline, $depth }) =>
    $inline ? '4px 8px 4px 0' : $depth === 2 ? '4px 8px 4px 42px' : '4px 8px 4px 26px'};
  border-radius: ${({ theme }) => theme.radius.md};

  &.active {
    background: ${({ theme }) => theme.colors.primaryLight};
  }

  &:hover:not(.active) {
    background: ${({ theme }) => theme.colors.bgGray};
  }
`;

const CountryRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding-left: 4px;
`;

const ChevronButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14px;
  height: 14px;
  flex-shrink: 0;

  img {
    width: 13px;
    height: 13px;
  }
`;

const CountryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 18px;
  flex-shrink: 0;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.bgGray};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.22px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const RowLabel = styled.span<{ $active: boolean }>`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary : theme.colors.textSecondary};
`;

export default ProductTree;
