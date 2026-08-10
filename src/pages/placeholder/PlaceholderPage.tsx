import styled from '@emotion/styled';
import PageHeader from '@/components/layout/PageHeader';

interface PlaceholderPageProps {
  title: string;
}

/** 아직 개발되지 않은 화면의 임시 페이지 */
const PlaceholderPage = ({ title }: PlaceholderPageProps) => {
  return (
    <>
      <PageHeader title={title} />
      <Empty>
        <p>준비 중인 화면입니다.</p>
      </Empty>
    </>
  );
};

const Empty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 300px;
  ${({ theme }) => theme.typography.body01};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default PlaceholderPage;
