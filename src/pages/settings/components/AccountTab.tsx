import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import InputSet from '@/components/common/InputSet';
import { useAccountInfo, useUpdateAccountInfo } from '@/hooks/useSettings';
import BusinessNumberField from '@/pages/join/components/BusinessNumberField';
import { PATH } from '@/routes/paths';
import type { AccountInfo } from '@/types/settings';
import {
  isBusinessNumberComplete,
  joinBusinessNumber,
  splitBusinessNumber,
  type BusinessNumberParts,
} from '@/utils/businessNumber';
import * as S from '../SettingsPage.styled';

/** 계정 정보 탭 (MKT-01-01 #4~8 · Figma 223:3489) */
const AccountTab = () => {
  const navigate = useNavigate();
  const { data: account } = useAccountInfo();
  const { mutate: save, isPending } = useUpdateAccountInfo();

  const [marketName, setMarketName] = useState('');
  const [marketNameError, setMarketNameError] = useState('');
  const [businessNumber, setBusinessNumber] = useState<BusinessNumberParts>(['', '', '']);

  // 조회값을 편집 초기값으로 동기화 (렌더 중 상태 조정 패턴 — 저장 후 refetch 시 기준값 갱신)
  const [syncedAccount, setSyncedAccount] = useState<AccountInfo | undefined>(undefined);
  if (account !== syncedAccount) {
    setSyncedAccount(account);
    if (account) {
      setMarketName(account.marketName);
      setBusinessNumber(splitBusinessNumber(account.businessNumber));
    }
  }

  // 명세: 값이 변경됐을 때만 저장 버튼 활성
  const isChanged =
    account !== undefined &&
    (marketName !== account.marketName ||
      joinBusinessNumber(businessNumber) !== account.businessNumber);
  const canSave =
    isChanged && marketName.trim() !== '' && isBusinessNumberComplete(businessNumber);

  const handleSave = () => {
    if (!canSave || isPending) return;
    if (marketName.trim() === '') {
      setMarketNameError('마켓 이름을 입력해 주세요.');
      return;
    }
    save({
      marketName: marketName.trim(),
      businessNumber: joinBusinessNumber(businessNumber),
    });
  };

  return (
    <>
      <S.FieldRows>
        <S.FieldRow>
          <InputSet
            label="이메일"
            required
            type="email"
            placeholder="email@email.com"
            value={account?.email ?? ''}
            // 명세: 로그인 ID라 수정 불가 — 항상 비활성
            disabled
            readOnly
          />
          {/* Figma 223:3433 — 마켓 이름 라벨에는 필수 표시가 없다 */}
          <InputSet
            label="마켓 이름"
            placeholder="마켓이름"
            value={marketName}
            error={marketNameError}
            onChange={(e) => {
              setMarketName(e.target.value);
              if (marketNameError) setMarketNameError('');
            }}
          />
        </S.FieldRow>
        <S.FieldRow $align="center">
          <BusinessNumberField
            required
            value={businessNumber}
            onChange={setBusinessNumber}
          />
          <S.LabeledSlot>
            <S.SlotLabel>
              비밀번호
              <S.RequiredMark aria-hidden>*</S.RequiredMark>
            </S.SlotLabel>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate(PATH.SETTINGS_PASSWORD)}
            >
              비밀번호 변경
            </Button>
          </S.LabeledSlot>
        </S.FieldRow>
      </S.FieldRows>
      <S.SaveRow>
        <S.DefaultButton
          type="button"
          variant="primary"
          disabled={!canSave}
          loading={isPending}
          onClick={handleSave}
        >
          저장
        </S.DefaultButton>
      </S.SaveRow>
    </>
  );
};

export default AccountTab;
