import { css } from '@emotion/react';

/**
 * 색상 토큰 (Figma design system 페이지 변수 기준)
 * - palette: 원시 색상값 (직접 사용 지양)
 * - colors: 의미 기반 토큰 (컴포넌트에서는 이것만 사용)
 */
const palette = {
  // main (브랜드 네이비)
  mainMain: '#19336E',
  mainLight: '#E7EDFA',

  // secondary (그린)
  secondaryStrong: '#2E7D32',
  secondaryLight: '#E8F5E9',
  /** 판매 국가 연동 화면의 '연동 완료' 그린 (Figma 12:15677) — 마켓플레이스 탭의 그린과 다르다 */
  secondaryVivid: '#0B9858',

  // third (퍼플)
  thirdThird: '#8150C0',
  thirdLight: '#F3EEFA',

  // warning (레드)
  warningWarning: '#D76464',
  warningLight: '#FFF5F5',

  // bg
  bgWhite: '#FFFFFF',
  bgLight: '#F2F6FA',
  bgGray: '#E8EBF1',

  // stroke
  strokeBlack: '#364153',
  strokeGray: '#99A1AF',

  // 디자인에서 토큰 없이 쓰인 색
  slate: '#94A3B8', // 섹션 라벨 등 muted 텍스트
  navyDeep: '#0F2742', // 대시보드 매출 큰 숫자

  // gradation (주요 CTA)
  gradFrom: '#103687',
  gradTo: '#5C2799',
} as const;

const colors = {
  // 브랜드
  primary: palette.mainMain,
  primaryLight: palette.mainLight,
  third: palette.thirdThird,
  thirdLight: palette.thirdLight,

  // 상태
  success: palette.secondaryStrong,
  successLight: palette.secondaryLight,
  /** 연동 완료 표시 전용 그린 — Figma가 화면별로 두 가지 그린을 쓴다 */
  successVivid: palette.secondaryVivid,
  error: palette.warningWarning,
  errorLight: palette.warningLight,

  // 배경
  background: palette.bgWhite,
  surface: palette.bgWhite,
  bgLight: palette.bgLight,
  bgGray: palette.bgGray,

  // 텍스트
  textPrimary: palette.strokeBlack,
  textSecondary: palette.strokeGray,
  textMuted: palette.slate,
  textStrong: palette.navyDeep,
  textOnPrimary: palette.bgWhite,

  // 테두리
  border: palette.bgGray,
  borderStrong: palette.strokeGray,

  // 그라데이션 (주요 CTA 버튼)
  gradient: `linear-gradient(90deg, ${palette.gradFrom} 0%, ${palette.gradTo} 100%)`,
  gradFrom: palette.gradFrom,
  gradTo: palette.gradTo,
} as const;

/** 간격 토큰 (Figma margin-* 변수 기준, px) */
const spacing = {
  none: '0',
  xxs: '4px',
  xs: '8px',
  sm: '12px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxxl: '48px',
} as const;

/** 라운드 토큰 */
const radius = {
  sm: '5px',
  md: '8px',
  lg: '10px',
  xl: '12px',
} as const;

/**
 * 타이포그래피 토큰 (Figma Heading/Label/Body/Caption/Table 스타일 기준)
 * 사용 예: ${({ theme }) => theme.typography.heading03}
 */
const typography = {
  heading01: css`
    font-size: 32px;
    font-weight: 700;
    line-height: 42px;
    letter-spacing: -0.4px;
  `,
  heading02: css`
    font-size: 28px;
    font-weight: 700;
    line-height: 38px;
    letter-spacing: -0.3px;
  `,
  heading03: css`
    font-size: 24px;
    font-weight: 700;
    line-height: 34px;
    letter-spacing: -0.2px;
  `,
  label01: css`
    font-size: 16px;
    font-weight: 700;
    line-height: 26px;
    letter-spacing: -0.1px;
  `,
  label02: css`
    font-size: 14px;
    font-weight: 700;
    line-height: 20px;
  `,
  body01: css`
    font-size: 16px;
    font-weight: 400;
    line-height: 26px;
  `,
  body02: css`
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
  `,
  caption01: css`
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
  `,
  captionStrong: css`
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
  `,
  tableHeader: css`
    font-size: 13px;
    font-weight: 600;
    line-height: 18px;
  `,
  tableCell: css`
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  `,
} as const;

/**
 * 반응형 브레이크포인트
 * - 레이아웃 명세: 화면 폭 1280px 미만이면 사이드바 자동 닫힘
 */
const breakpoints = {
  sidebarCollapse: 1280,
  tablet: 1024,
  mobile: 768,
} as const;

const media = {
  sidebarCollapse: `@media (max-width: ${breakpoints.sidebarCollapse - 1}px)`,
  tablet: `@media (max-width: ${breakpoints.tablet - 1}px)`,
  mobile: `@media (max-width: ${breakpoints.mobile - 1}px)`,
} as const;

export const theme = {
  colors,
  spacing,
  radius,
  typography,
  breakpoints,
  media,
} as const;

export type AppTheme = typeof theme;
