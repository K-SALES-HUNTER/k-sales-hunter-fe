import { useNavigate } from 'react-router-dom';
import aiSparkleIcon from '@/assets/icons/ai-sparkle.svg';
import Button from '@/components/common/Button';
import ChevronIcon from './ChevronIcon';
import * as S from './formPage.styled';

interface FormPageHeaderProps {
  title: string;
  /** 뒤로가기 목적지 — 논리적 상위 화면 */
  backTo: string;
  /** 버튼 왼쪽 안내 문구 (sparkle 아이콘과 함께) */
  hint?: string;
  /** 우측 상단 단일 버튼 라벨 — '자동 채우기' / '등록' / '저장' */
  actionLabel: string;
  actionDisabled?: boolean;
  actionLoading?: boolean;
  onAction: () => void;
}

/**
 * 상품 등록·수정 화면 전용 헤더 (Figma 526:6586 · 608:10505).
 * 공용 PageHeader에는 뒤로가기 화살표가 없어 이 화면에서만 쓰는 헤더를 따로 둔다.
 * 우측 버튼은 상태에 따라 라벨만 바뀌는 단일 버튼 (Figma navibutton).
 */
const FormPageHeader = ({
  title,
  backTo,
  hint,
  actionLabel,
  actionDisabled = false,
  actionLoading = false,
  onAction,
}: FormPageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <S.Header>
      <S.TitleRow>
        <S.BackButton type="button" aria-label="뒤로 가기" onClick={() => navigate(backTo)}>
          <ChevronIcon size={32} />
        </S.BackButton>
        <S.Title>{title}</S.Title>
      </S.TitleRow>

      <S.ActionGroup>
        {hint && (
          <S.ActionHint>
            <S.SparkleIcon src={aiSparkleIcon} alt="" aria-hidden />
            {hint}
          </S.ActionHint>
        )}
        <Button
          variant="primary"
          loading={actionLoading}
          disabled={actionDisabled}
          icon={<ChevronIcon size={22} />}
          onClick={onAction}
        >
          {actionLabel}
        </Button>
      </S.ActionGroup>
    </S.Header>
  );
};

export default FormPageHeader;
