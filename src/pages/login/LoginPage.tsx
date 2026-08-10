import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import InputSet from '@/components/common/InputSet';
import Logo from '@/components/common/Logo';
import { PATH } from '@/routes/paths';
import { useAuthStore } from '@/stores/useAuthStore';
import * as S from './LoginPage.styled';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** LOGIN (Figma 265:8260) */
const LoginPage = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  // 명세: 필수 입력이 채워지기 전에는 주 동작 버튼 비활성
  const canSubmit = email.trim() !== '' && password.trim() !== '';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    if (!EMAIL_REGEX.test(email)) {
      setEmailError('올바른 이메일 형식이 아닙니다.');
      return;
    }

    // 목 로그인 — 백엔드 연동 시 로그인 API 호출로 교체
    login(email);
    navigate(PATH.DASHBOARD, { replace: true });
  };

  return (
    <S.Page>
      <S.LoginBox onSubmit={handleSubmit}>
        <Logo size="lg" />
        <S.Fields>
          <InputSet
            label="이메일"
            type="email"
            placeholder="이메일을 입력해주세요."
            value={email}
            error={emailError}
            onChange={(e) => {
              setEmail(e.target.value);
              // 명세: 다시 입력을 시작하면 에러 즉시 해제
              if (emailError) setEmailError('');
            }}
          />
          <InputSet
            label="비밀번호"
            type="password"
            placeholder="비밀번호를 입력해주세요."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </S.Fields>
        <S.Buttons>
          <Button type="submit" variant="primary" fullWidth disabled={!canSubmit}>
            로그인
          </Button>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => navigate(PATH.JOIN)}
          >
            회원가입
          </Button>
        </S.Buttons>
      </S.LoginBox>
    </S.Page>
  );
};

export default LoginPage;
