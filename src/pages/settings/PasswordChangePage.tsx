import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import settingsBackIcon from '@/assets/icons/settings-back.svg';
import Button from '@/components/common/Button';
import InputSet from '@/components/common/InputSet';
import Modal from '@/components/common/Modal';
import { useChangePassword, useVerifyCurrentPassword } from '@/hooks/useSettings';
import { PATH } from '@/routes/paths';
import { useAuthStore } from '@/stores/useAuthStore';
import { isValidPassword, PASSWORD_RULE_MESSAGE } from '@/utils/validation';
import * as S from './PasswordChangePage.styled';

/**
 * 비밀번호 변경 (PWD-01-01 · Figma 514:4471 · 516:6326) —
 * 1단계 현재 비밀번호 확인 → 2단계 새 비밀번호 입력. 완료 시 재로그인 요구.
 */
const PasswordChangePage = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const { mutate: verify, isPending: isVerifying } = useVerifyCurrentPassword();
  const { mutate: change, isPending: isChanging } = useChangePassword();

  const [step, setStep] = useState<1 | 2>(1);

  // 1단계 — 현재 비밀번호
  const [currentPassword, setCurrentPassword] = useState('');
  const [currentError, setCurrentError] = useState('');

  // 2단계 — 새 비밀번호 (회원가입과 동일 검증)
  const [newPassword, setNewPassword] = useState('');
  const [newTouched, setNewTouched] = useState(false);

  const [done, setDone] = useState(false);

  const newPasswordValid = isValidPassword(newPassword);
  const newError = newTouched && !newPasswordValid ? PASSWORD_RULE_MESSAGE : '';

  const canSubmit =
    step === 1 ? currentPassword !== '' && !isVerifying : newPasswordValid && !isChanging;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    if (step === 1) {
      verify(currentPassword, {
        onSuccess: (ok) => {
          if (ok) {
            setStep(2);
            return;
          }
          // 명세: 실패 시 입력값을 비우고 에러 표시
          setCurrentError('비밀번호가 틀렸습니다');
          setCurrentPassword('');
        },
      });
      return;
    }

    change(newPassword, { onSuccess: () => setDone(true) });
  };

  const handleDone = () => {
    // 명세: 변경 성공 시 세션 만료 후 로그인 화면 이동 (재로그인 요구)
    logout();
    navigate(PATH.LOGIN, { replace: true });
  };

  return (
    <S.Page>
      <S.TopBar>
        {/* 명세: 뒤로가기 → 마켓/설정 계정 정보 탭 복귀 */}
        <S.BackButton
          type="button"
          aria-label="뒤로가기"
          onClick={() => navigate(`${PATH.SETTINGS}?tab=account`)}
        >
          <img src={settingsBackIcon} alt="" />
        </S.BackButton>
        <S.TopTitle>비밀번호 변경</S.TopTitle>
      </S.TopBar>

      <S.Content onSubmit={handleSubmit}>
        {step === 1 ? (
          <>
            <S.StepTitle>사용 중인 비밀번호를 입력해주세요.</S.StepTitle>
            <InputSet
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력해주세요."
              value={currentPassword}
              error={currentError}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                // 명세: 재입력 시 에러 해제
                if (currentError) setCurrentError('');
              }}
            />
          </>
        ) : (
          <>
            <S.StepTitle>변경할 비밀번호를 입력해주세요.</S.StepTitle>
            <InputSet
              label="비밀번호"
              type="password"
              placeholder="비밀번호를 입력해주세요."
              value={newPassword}
              error={newError}
              onFocus={() => setNewTouched(true)}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </>
        )}
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={!canSubmit}
          loading={step === 1 ? isVerifying : isChanging}
        >
          입력
        </Button>
      </S.Content>

      <Modal
        open={done}
        title="비밀번호가 변경되었습니다."
        description="보안을 위해 다시 로그인해 주세요."
        footer={
          <Button type="button" variant="primary" onClick={handleDone}>
            확인
          </Button>
        }
      />
    </S.Page>
  );
};

export default PasswordChangePage;
