import { useEffect, useState } from 'react';
import stepDoneIcon from '@/assets/icons/product-step-done.svg';
import stepLoadingIcon from '@/assets/icons/product-step-loading.svg';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import * as S from './AiLoadingOverlay.styled';

interface AnalysisStep {
  task: string;
  agent: string;
  /** 진행 중일 때만 노출되는 보조 문구 */
  note?: string;
  /** 목 소요 시간 (1.2~1.8초) */
  durationMs: number;
}

/**
 * 기본 5단계 (SYS-01-01, Figma 599:9717):
 * 오케스트레이터 노드 순서(gate→market→shipping→margin→report)를 사용자 언어로 옮긴 것.
 *
 * [DEMO-ONLY] durationMs는 목 진행 속도다(총 약 7.8초). 남은 시간 표시도 이 값에서 계산한다.
 * 백엔드 연동 시: /analysis-jobs/{id}/events SSE의 단계 이벤트로 진행을 갱신하고
 * durationMs와 remainingSeconds를 삭제한다.
 */
const STEPS: AnalysisStep[] = [
  { task: '판매 가능 여부 확인', agent: '리스크 매니저', durationMs: 1200 },
  {
    task: '시장 · 경쟁 분석',
    agent: '트렌드 헌터',
    // 국가별 병렬 분석 (SYS-01-01)
    note: '3개 국가를 동시에 살펴보고 있습니다',
    durationMs: 1800,
  },
  { task: '배송비 · 관세 계산', agent: '리스크 매니저', durationMs: 1500 },
  { task: '적정 가격 · 마진 계산', agent: '마진 메이커', durationMs: 1600 },
  { task: '보고서 정리', agent: '비서 AI', durationMs: 1300 },
];

/** 마지막 단계 완료 후 onComplete까지의 여유 */
const COMPLETE_DELAY_MS = 400;

/** 남은 시간 — 아직 끝나지 않은 단계의 실제 소요 시간 합계 (분, 올림 — Figma 12:15609 'n분 남음') */
const remainingMinutes = (completed: number) => {
  const restMs = STEPS.slice(completed).reduce((sum, step) => sum + step.durationMs, 0);
  return Math.max(1, Math.ceil(restMs / 60_000));
};

interface AiLoadingOverlayProps {
  open: boolean;
  title?: string;
  /** 이 로딩을 호출한 화면 이름 (상단 표시) */
  screenName?: string;
  /** 전 단계 완료 시 호출 */
  onComplete: () => void;
  /** 중단 확인 모달에서 '확인' 시 호출 */
  onCancel: () => void;
}

/**
 * AI 생성 로딩 (SYS-01-01, Figma 599:9717) — 전체 화면 공통 로딩 템플릿.
 * open이 될 때마다 콘텐츠가 새로 마운트되어 진행 상태가 초기화된다.
 */
const AiLoadingOverlay = ({ open, ...contentProps }: AiLoadingOverlayProps) => {
  if (!open) return null;
  return <AiLoadingOverlayContent {...contentProps} />;
};

type StepState = 'done' | 'active' | 'pending';

const STATUS_LABEL: Record<StepState, string> = {
  done: '완료',
  active: '진행 중',
  pending: '대기',
};

/** 완료 → 진행 중 → 대기 순으로 위에서 아래로 정렬 (명세: 완료된 단계가 위로) */
const SORT_RANK: Record<StepState, number> = { done: 0, active: 1, pending: 2 };

/**
 * 진행 바(완료 단계/전체 단계) + 단계 목록(완료·진행 중·대기) + 중단하기.
 */
const AiLoadingOverlayContent = ({
  title = '분석 중이에요',
  screenName,
  onComplete,
  onCancel,
}: Omit<AiLoadingOverlayProps, 'open'>) => {
  const [completed, setCompleted] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // 목 진행 — 중단 확인 모달이 떠 있는 동안 일시 정지, 취소하면 현재 단계부터 재개
  useEffect(() => {
    if (confirmOpen) return;
    if (completed >= STEPS.length) {
      const timer = setTimeout(onComplete, COMPLETE_DELAY_MS);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(
      () => setCompleted((count) => count + 1),
      STEPS[completed].durationMs,
    );
    return () => clearTimeout(timer);
  }, [confirmOpen, completed, onComplete]);

  const remaining = remainingMinutes(completed);

  const rows = STEPS.map((step, index) => {
    const state: StepState =
      index < completed ? 'done' : index === completed ? 'active' : 'pending';
    return { step, state, index };
  }).sort((a, b) => SORT_RANK[a.state] - SORT_RANK[b.state] || a.index - b.index);

  return (
    <>
      <S.Overlay role="alert" aria-busy>
        {/* 호출한 화면의 네비게이션명 유지 (Figma 12:15609 좌측 상단) */}
        {screenName && (
          <S.ScreenHeader aria-hidden>
            <S.ScreenChevron>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" focusable="false">
                <path
                  d="M14.5 6L8.5 12L14.5 18"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </S.ScreenChevron>
            <S.ScreenName>{screenName}</S.ScreenName>
          </S.ScreenHeader>
        )}
        <S.Panel>
          <S.TitleGroup>
            <S.Title>{title}</S.Title>
            <S.Remaining>예상 소요 시간 {remaining}분 남음</S.Remaining>
          </S.TitleGroup>

          <S.ProgressTrack>
            <S.ProgressFill $ratio={completed / STEPS.length} />
          </S.ProgressTrack>

          <S.StepList>
            {rows.map(({ step, state }) => {
              const isPending = state === 'pending';
              return (
                <S.StepRow key={step.task}>
                  <S.Indicator aria-hidden>
                    {state === 'done' && <S.DoneIcon src={stepDoneIcon} alt="" />}
                    {state === 'active' && <S.LoadingIcon src={stepLoadingIcon} alt="" />}
                    {isPending && <S.PendingDot />}
                  </S.Indicator>
                  <S.StepText>
                    <S.StepTask $pending={isPending}>{step.task}</S.StepTask>
                    <S.StepAgent $pending={isPending}>{step.agent}</S.StepAgent>
                    {state === 'active' && step.note && <S.StepNote>{step.note}</S.StepNote>}
                  </S.StepText>
                  <S.StepStatus $pending={isPending}>{STATUS_LABEL[state]}</S.StepStatus>
                </S.StepRow>
              );
            })}
          </S.StepList>

          {/* 단색 네이비 풀폭 버튼 (Figma 12:15609) */}
          <S.StopButton variant="primary" fullWidth onClick={() => setConfirmOpen(true)}>
            중단하기
          </S.StopButton>
        </S.Panel>
      </S.Overlay>

      {/* 모달 ⑤ 분석 중단 확인 — 취소 시 분석 재개 */}
      <Modal
        open={confirmOpen}
        title="정말 중단하시겠어요?"
        description="중단 시 분석 작업이 취소되고 이전 페이지로 돌아갑니다."
        footer={
          <>
            <Button variant="primary" onClick={onCancel}>
              확인
            </Button>
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              취소
            </Button>
          </>
        }
      />
    </>
  );
};

export default AiLoadingOverlay;
