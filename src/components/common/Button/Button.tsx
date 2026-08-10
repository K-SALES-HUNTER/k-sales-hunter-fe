import type { ButtonHTMLAttributes, ReactNode } from 'react';
import * as S from './Button.styled';

export type ButtonVariant = 'primary' | 'secondary' | 'warning' | 'text';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** 부모 폭에 맞춰 늘림 (목록 하단·모달 하단 등) */
  fullWidth?: boolean;
  /** 로딩 시 스피너 표시 + 자동 disabled (명세: loading은 항상 disabled와 함께) */
  loading?: boolean;
  /** 아이콘은 항상 텍스트 우측 (Figma button 명세) */
  icon?: ReactNode;
  children?: ReactNode;
}

const Button = ({
  variant = 'primary',
  fullWidth = false,
  loading = false,
  icon,
  disabled,
  children,
  ...props
}: ButtonProps) => {
  return (
    <S.Button
      $variant={variant}
      $fullWidth={fullWidth}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && <S.Spinner aria-hidden />}
      {children}
      {icon}
    </S.Button>
  );
};

export default Button;
