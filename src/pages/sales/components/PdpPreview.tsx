import { useState } from 'react';
import styled from '@emotion/styled';
import salesCheckIcon from '@/assets/icons/sales-check.svg';
import salesDownloadIcon from '@/assets/icons/sales-download.svg';
import type { DetailImageItem, PdpContent, PdpSeller, ProductImageItem } from '@/mocks/sales';

interface PdpPreviewProps {
  content: PdpContent;
  seller: PdpSeller;
  images: ProductImageItem[];
  mainImageId: string;
  detailImages: DetailImageItem[];
  countryName: string;
}

/** 이미지 원본 다운로드 (상세 이미지 우측 상단 아이콘 버튼) */
const downloadImage = (src: string, filename: string) => {
  const anchor = document.createElement('a');
  anchor.href = src;
  anchor.download = filename;
  anchor.click();
};

/**
 * Shopee PDP 미리보기 (DTL-01-01 #7, Figma 568:6701) —
 * 실제 업로드될 상세 페이지를 Shopee 화면과 동일한 형태로 렌더한다. 구매 동작은 no-op.
 */
const PdpPreview = ({
  content,
  seller,
  images,
  mainImageId,
  detailImages,
  countryName,
}: PdpPreviewProps) => {
  const [selectedThumbId, setSelectedThumbId] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);

  const mainImage =
    images.find((img) => img.id === (selectedThumbId ?? mainImageId)) ?? images[0];

  return (
    <Frame>
      <TopBar>
        <ShopeeLogo>shopee</ShopeeLogo>
        <CountryText>{countryName}</CountryText>
        <PreviewChip>미리보기</PreviewChip>
      </TopBar>

      <Body>
        <Breadcrumb aria-label="카테고리 경로">
          {content.breadcrumb.map((crumb, index) => (
            <li key={crumb}>
              {index > 0 && <Sep aria-hidden>›</Sep>}
              {crumb}
            </li>
          ))}
        </Breadcrumb>

        <TopSection>
          <ImageColumn>
            <MainImageBox>
              {mainImage && <MainImage src={mainImage.src} alt={content.name} />}
              {mainImage?.id === mainImageId && <MainBadge>대표</MainBadge>}
            </MainImageBox>
            <ThumbRow>
              {images.map((img) => (
                <ThumbButton
                  key={img.id}
                  type="button"
                  $selected={(selectedThumbId ?? mainImageId) === img.id}
                  onClick={() => setSelectedThumbId(img.id)}
                >
                  <img src={img.src} alt={img.label} />
                  <ThumbLabel>{img.label}</ThumbLabel>
                </ThumbButton>
              ))}
            </ThumbRow>
          </ImageColumn>

          <InfoColumn>
            <ProductName>{content.name}</ProductName>
            <Price>{content.price}</Price>

            <UspList>
              {content.usps.map((usp) => (
                <li key={usp}>
                  <img src={salesCheckIcon} alt="" aria-hidden />
                  {usp}
                </li>
              ))}
            </UspList>

            <ShippingBox>
              <ShippingRow>
                <dt>배송</dt>
                <dd>{content.shipping.region}</dd>
              </ShippingRow>
              <ShippingRow>
                <dt>배송비</dt>
                <dd>{content.shipping.fee}</dd>
              </ShippingRow>
              <ShippingRow>
                <dt>도착 예정</dt>
                <dd>{content.shipping.eta}</dd>
              </ShippingRow>
            </ShippingBox>

            {content.options.map((option) => (
              <OptionBlock key={option.label}>
                <OptionLabel>{option.label}</OptionLabel>
                <ChipRow>
                  {option.values.map((value) => {
                    const selected =
                      (selectedOptions[option.label] ?? option.values[0]) === value;
                    return (
                      <OptionChip
                        key={value}
                        type="button"
                        $selected={selected}
                        onClick={() =>
                          setSelectedOptions((prev) => ({ ...prev, [option.label]: value }))
                        }
                      >
                        {value}
                      </OptionChip>
                    );
                  })}
                </ChipRow>
              </OptionBlock>
            ))}

            <QtyRow>
              <OptionLabel>수량</OptionLabel>
              <Stepper>
                <StepButton
                  type="button"
                  aria-label="수량 감소"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  −
                </StepButton>
                <StepValue>{qty}</StepValue>
                <StepButton
                  type="button"
                  aria-label="수량 증가"
                  onClick={() => setQty((q) => q + 1)}
                >
                  +
                </StepButton>
              </Stepper>
              <StockNote>{content.stockNote}</StockNote>
            </QtyRow>

            <BuyRow>
              {/* 미리보기 용도 — 실제 구매 동작 없음 */}
              <CartButton type="button">장바구니 담기</CartButton>
              <BuyButton type="button">바로 구매</BuyButton>
            </BuyRow>
          </InfoColumn>
        </TopSection>

        <SellerCard>
          <BlockTitle>판매자 정보</BlockTitle>
          <SellerRow>
            <SellerAvatar aria-hidden />
            <SellerInfo>
              <strong>{seller.name}</strong>
              <span>{seller.meta}</span>
            </SellerInfo>
            <SellerStat>
              <strong>{seller.rating}</strong>
              <span>평점</span>
            </SellerStat>
            <SellerStat>
              <strong>{seller.response}</strong>
              <span>응답률</span>
            </SellerStat>
            <SellerStat>
              <strong>{seller.followers}</strong>
              <span>팔로워</span>
            </SellerStat>
          </SellerRow>
        </SellerCard>

        <SpecCard>
          <BlockTitle>상품 사양</BlockTitle>
          <SpecTable>
            <tbody>
              {content.specs.map(([label, value]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{value}</td>
                </tr>
              ))}
            </tbody>
          </SpecTable>
        </SpecCard>

        <Description>{content.description}</Description>

        <DetailImageList>
          {detailImages.map((image) => (
            <DetailImageBox key={image.id}>
              <DetailImage src={image.src} alt={image.label} />
              <DetailImageBadge>{image.label}</DetailImageBadge>
              <DownloadButton
                type="button"
                aria-label={`${image.label} 다운로드`}
                onClick={() => downloadImage(image.src, `${image.id}.png`)}
              >
                <img src={salesDownloadIcon} alt="" aria-hidden />
              </DownloadButton>
            </DetailImageBox>
          ))}
        </DetailImageList>
      </Body>
    </Frame>
  );
};

const Frame = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  /* 사이드바·AI 패널 때문에 실제 폭이 뷰포트와 크게 달라 컨테이너 쿼리 기준으로 전환 */
  container-type: inline-size;
`;

/* Shopee 상단 바 — 브랜드 오렌지는 테마 토큰 범위 내 error 색으로 대체 */
const TopBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  background: ${({ theme }) => theme.colors.error};
`;

const ShopeeLogo = styled.span`
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme }) => theme.colors.textOnPrimary};
`;

const CountryText = styled.span`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textOnPrimary};
`;

const PreviewChip = styled.span`
  margin-left: auto;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.errorLight};
  ${({ theme }) => theme.typography.captionStrong};
  color: ${({ theme }) => theme.colors.error};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Breadcrumb = styled.ol`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xxs};
  list-style: none;
  padding: 0;
  margin: 0;
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textSecondary};

  li {
    display: inline-flex;
    gap: ${({ theme }) => theme.spacing.xxs};
  }
`;

const Sep = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TopSection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: flex-start;

  @container (max-width: 640px) {
    flex-direction: column;
  }
`;

const ImageColumn = styled.div`
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  @container (max-width: 640px) {
    width: 100%;
  }
`;

const MainImageBox = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bgLight};
`;

const MainImage = styled.img`
  display: block;
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const MainBadge = styled.span`
  position: absolute;
  top: 8px;
  left: 8px;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.textPrimary};
  font-size: 10px;
  font-weight: 700;
  line-height: 15px;
  color: ${({ theme }) => theme.colors.textOnPrimary};
`;

const ThumbRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-wrap: wrap;
`;

const ThumbButton = styled.button<{ $selected: boolean }>`
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1.6px solid
    ${({ theme, $selected }) => ($selected ? theme.colors.textPrimary : theme.colors.bgGray)};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.bgLight};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ThumbLabel = styled.span`
  position: absolute;
  bottom: 2px;
  left: 50%;
  transform: translateX(-50%);
  padding: 1px 5px;
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.textPrimary};
  font-size: 8px;
  font-weight: 700;
  line-height: 12px;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.textOnPrimary};
`;

const InfoColumn = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ProductName = styled.h3`
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Price = styled.p`
  ${({ theme }) => theme.typography.heading02};
  color: ${({ theme }) => theme.colors.error};
`;

const UspList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
  list-style: none;
  padding: 0;
  margin: 0;

  li {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xxs};
    ${({ theme }) => theme.typography.caption01};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  img {
    width: 12px;
    height: 12px;
  }
`;

const ShippingBox = styled.dl`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgLight};
  margin: 0;
`;

const ShippingRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  ${({ theme }) => theme.typography.caption01};

  dt {
    width: 56px;
    flex-shrink: 0;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  dd {
    margin: 0;
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const OptionBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxs};
`;

const OptionLabel = styled.span`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const OptionChip = styled.button<{ $selected: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.xxs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid
    ${({ theme, $selected }) => ($selected ? theme.colors.error : theme.colors.border)};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.errorLight : theme.colors.surface};
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme, $selected }) => ($selected ? theme.colors.error : theme.colors.textPrimary)};
`;

const QtyRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Stepper = styled.div`
  display: inline-flex;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  overflow: hidden;
`;

const StepButton = styled.button`
  width: 30px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textPrimary};

  &:hover {
    background: ${({ theme }) => theme.colors.bgLight};
  }
`;

const StepValue = styled.span`
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const StockNote = styled.span`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const BuyRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const CartButton = styled.button`
  flex: 1;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.sm};
  border: 1px solid ${({ theme }) => theme.colors.error};
  background: ${({ theme }) => theme.colors.errorLight};
  ${({ theme }) => theme.typography.captionStrong};
  color: ${({ theme }) => theme.colors.error};
`;

const BuyButton = styled.button`
  flex: 1;
  height: 36px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.error};
  ${({ theme }) => theme.typography.captionStrong};
  color: ${({ theme }) => theme.colors.textOnPrimary};
`;

const SellerCard = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const BlockTitle = styled.h4`
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const SellerRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SellerAvatar = styled.span`
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.error};
`;

const SellerInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;

  strong {
    ${({ theme }) => theme.typography.label02};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  span {
    ${({ theme }) => theme.typography.caption01};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const SellerStat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;

  strong {
    ${({ theme }) => theme.typography.label02};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  span {
    ${({ theme }) => theme.typography.caption01};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const SpecCard = styled(SellerCard)``;

const SpecTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    width: 120px;
    padding: ${({ theme }) => `${theme.spacing.xs} 0`};
    text-align: left;
    vertical-align: top;
    ${({ theme }) => theme.typography.caption01};
    color: ${({ theme }) => theme.colors.textSecondary};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  td {
    padding: ${({ theme }) => `${theme.spacing.xs} 0`};
    ${({ theme }) => theme.typography.caption01};
    color: ${({ theme }) => theme.colors.textPrimary};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const Description = styled.p`
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const DetailImageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const DetailImageBox = styled.div`
  position: relative;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

const DetailImage = styled.img`
  display: block;
  width: 100%;
  aspect-ratio: 1000 / 667;
  object-fit: cover;
`;

const DetailImageBadge = styled.span`
  position: absolute;
  top: 12px;
  left: 16px;
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.textPrimary};
  font-size: 10px;
  font-weight: 700;
  line-height: 15px;
  color: ${({ theme }) => theme.colors.textOnPrimary};
`;

const DownloadButton = styled.button`
  position: absolute;
  top: 12px;
  right: 16px;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};

  img {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.bgLight};
  }
`;

export default PdpPreview;
