import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

/** size별 심볼/워드마크 크기 — Figma LOGO 인스턴스 실측값 기준 */
const sizes = {
  sm: { symbol: 14, text1W: 56, text2W: 50, gap: 12, innerGap: 6 },
  lg: { symbol: 34, text1W: 134, text2W: 119, gap: 29, innerGap: 14 },
} as const;

export const LogoLink = styled(Link, {
  shouldForwardProp: (prop) => !prop.startsWith('$'),
})<{ $size: 'sm' | 'lg' }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ $size }) => sizes[$size].gap}px;

  img:first-of-type {
    width: ${({ $size }) => sizes[$size].symbol}px;
  }

  div {
    gap: ${({ $size }) => sizes[$size].innerGap}px;
  }

  div img:first-of-type {
    width: ${({ $size }) => sizes[$size].text1W}px;
  }

  div img:last-of-type {
    width: ${({ $size }) => sizes[$size].text2W}px;
  }
`;

export const Symbol = styled.img`
  height: auto;
`;

export const TextGroup = styled.div`
  display: flex;
  align-items: center;
`;

export const Text1 = styled.img`
  height: auto;
`;

export const Text2 = styled.img`
  height: auto;
`;
