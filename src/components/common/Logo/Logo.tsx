import logoSymbol from '@/assets/logo/logo-symbol.svg';
import logoText1 from '@/assets/logo/logo-text-1.svg';
import logoText2 from '@/assets/logo/logo-text-2.svg';
import { PATH } from '@/routes/paths';
import * as S from './Logo.styled';

interface LogoProps {
  /** 로그인·회원가입용 큰 사이즈 여부 (기본: 사이드바용 작은 사이즈) */
  size?: 'sm' | 'lg';
}

/** LOGO (Figma 371:3327) — 클릭 시 대시보드로 이동 */
const Logo = ({ size = 'sm' }: LogoProps) => {
  return (
    <S.LogoLink to={PATH.DASHBOARD} $size={size} aria-label="K-SALES HUNTER 대시보드로 이동">
      <S.Symbol src={logoSymbol} alt="" />
      <S.TextGroup>
        <S.Text1 src={logoText1} alt="K-SALES" />
        <S.Text2 src={logoText2} alt="HUNTER" />
      </S.TextGroup>
    </S.LogoLink>
  );
};

export default Logo;
