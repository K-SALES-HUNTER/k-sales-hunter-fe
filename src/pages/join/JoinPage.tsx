import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import joinCheckIcon from '@/assets/icons/join-check-match.svg';
import Button from '@/components/common/Button';
import InputSet from '@/components/common/InputSet';
import Logo from '@/components/common/Logo';
import { useJoin } from '@/hooks/useSettings';
import { PATH } from '@/routes/paths';
import {
  EMAIL_FORMAT_MESSAGE,
  EMAIL_REGEX,
  isValidPassword,
  PASSWORD_MISMATCH_MESSAGE,
  PASSWORD_RULE_MESSAGE,
} from '@/utils/validation';
import {
  isBusinessNumberComplete,
  joinBusinessNumber,
  type BusinessNumberParts,
} from '@/utils/businessNumber';
import BusinessNumberField from './components/BusinessNumberField';
import * as S from './JoinPage.styled';

/** JOIN (JOI-01-01 · Figma 265:8823) — 셀러 계정 생성. 단독 레이아웃(사이드바 없음). */
const JoinPage = () => {
  const navigate = useNavigate();
  const { mutate: join, isPending } = useJoin();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [marketName, setMarketName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [businessNumber, setBusinessNumber] = useState<BusinessNumberParts>(['', '', '']);

  const passwordValid = isValidPassword(password);
  // 명세: 비밀번호란 포커스 시 조건 안내 표시, 조건 모두 충족 시 숨김
  const passwordError = passwordTouched && !passwordValid ? PASSWORD_RULE_MESSAGE : '';
  // 명세: 비밀번호 확인은 실시간 비교, 같아지면 즉시 해제
  const confirmError =
    passwordConfirm !== '' && passwordConfirm !== password ? PASSWORD_MISMATCH_MESSAGE : '';
  /** 화면 상태 ④ — 확인란까지 일치하면 우측에 체크 아이콘 노출 */
  const isPasswordMatched = passwordConfirm !== '' && passwordConfirm === password;

  // 명세: 필수 항목 전부 유효할 때만 회원가입 버튼 활성
  const canSubmit =
    EMAIL_REGEX.test(email) &&
    marketName.trim() !== '' &&
    passwordValid &&
    isPasswordMatched &&
    isBusinessNumberComplete(businessNumber);

  const handleEmailBlur = () => {
    // 명세: 포커스 아웃 시 형식만 먼저 검증 (중복 확인은 제출 시 서버에서)
    if (email !== '' && !EMAIL_REGEX.test(email)) setEmailError(EMAIL_FORMAT_MESSAGE);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit || isPending) return;

    join(
      {
        email,
        marketName: marketName.trim(),
        password,
        businessNumber: joinBusinessNumber(businessNumber),
      },
      // 명세: 계정 생성 → 로그인 화면 이동
      { onSuccess: () => navigate(PATH.LOGIN) },
    );
  };

  return (
    <S.Page>
      <S.JoinBox onSubmit={handleSubmit}>
        <Logo size="lg" />
        <S.Fields>
          <S.FieldRow>
            <InputSet
              label="이메일"
              required
              type="email"
              placeholder="이메일을 입력해주세요."
              value={email}
              error={emailError}
              onBlur={handleEmailBlur}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) setEmailError('');
              }}
            />
            {/* Figma 526:4715 — 마켓 이름 라벨에는 필수 표시가 없다 */}
            <InputSet
              label="마켓 이름"
              placeholder="마켓 이름을 입력해주세요."
              value={marketName}
              onChange={(e) => setMarketName(e.target.value)}
            />
          </S.FieldRow>

          <S.FieldRow $align="center">
            {/* Figma 526:4402 — 최초 진입 시 placeholder 자체가 비밀번호 조건 안내 */}
            <InputSet
              label="비밀번호"
              required
              type="password"
              placeholder="영문 대/소문자, 숫자 조합 10글자 이상"
              value={password}
              error={passwordError}
              onFocus={() => setPasswordTouched(true)}
              onChange={(e) => setPassword(e.target.value)}
            />
            <S.ConfirmSlot>
              <InputSet
                label="비밀번호 확인"
                required
                type="password"
                placeholder="비밀번호를 확인해주세요."
                value={passwordConfirm}
                error={confirmError}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
              {/* Figma 526:4709 — 비밀번호가 일치하면 입력칸 우측에 초록 체크 */}
              {isPasswordMatched && (
                <S.MatchIcon src={joinCheckIcon} alt="비밀번호가 일치합니다" />
              )}
            </S.ConfirmSlot>
          </S.FieldRow>

          <BusinessNumberField
            required
            value={businessNumber}
            onChange={setBusinessNumber}
          />
        </S.Fields>
        <S.Buttons>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={!canSubmit}
            loading={isPending}
          >
            회원가입
          </Button>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={() => navigate(PATH.LOGIN)}
          >
            로그인 하러 가기
          </Button>
        </S.Buttons>
      </S.JoinBox>
    </S.Page>
  );
};

export default JoinPage;
