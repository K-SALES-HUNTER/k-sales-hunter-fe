import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import arrowRightIcon from '@/assets/icons/arrow-right.svg';
import Button from '@/components/common/Button';
import ReportChip from '@/components/common/ReportChip';
import { buildPath, PATH } from '@/routes/paths';
import type { RecentProduct } from '@/types/dashboard';

interface RecentProductsSectionProps {
  products: RecentProduct[];
}

/**
 * 최근 상품 테이블 (Figma 303:2698).
 * 명세 주석: 매출은 판매 중인 상품만 표출, 보고서 칩 클릭 시 해당 보고서 페이지로 이동.
 */
const RecentProductsSection = ({ products }: RecentProductsSectionProps) => {
  const navigate = useNavigate();

  const goReport = (productId: number, countryCode?: string) => {
    navigate(
      countryCode
        ? buildPath.countryReport(productId, countryCode)
        : buildPath.totalReport(productId),
    );
  };

  return (
    <Section>
      <TitleRow>
        <Title>최근 상품</Title>
        <Count>총 {products.length}개</Count>
      </TitleRow>

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
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <Thumbnail src={product.image} alt={product.name} />
                </td>
                <td>
                  {/* 명세: 상품명 클릭 시 전체 분석 보고서로 이동 */}
                  <ProductNameButton type="button" onClick={() => goReport(product.id)}>
                    {product.name}
                  </ProductNameButton>
                </td>
                <td>{product.revenue !== null ? `${product.revenue.toLocaleString()}원` : ''}</td>
                <td>{product.registeredAt}</td>
                <td>
                  <ChipRow>
                    <ReportChip
                      variant="total"
                      label="전체"
                      onClick={() => goReport(product.id)}
                    />
                    {product.reportCountries.map((country) => (
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

      <ViewAllButton
        variant="secondary"
        fullWidth
        icon={<ArrowIcon src={arrowRightIcon} alt="" />}
        onClick={() => navigate(PATH.PRODUCTS)}
      >
        상품 전체보기
      </ViewAllButton>
    </Section>
  );
};

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
`;

const Title = styled.h2`
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Count = styled.p`
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme }) => theme.colors.textSecondary};
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

const ArrowIcon = styled.img`
  width: 22px;
  height: 22px;
`;

const ViewAllButton = styled(Button)`
  justify-content: space-between;
`;

const ProductNameButton = styled.button`
  ${({ theme }) => theme.typography.body01};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-align: left;

  &:hover {
    text-decoration: underline;
  }
`;

export default RecentProductsSection;
