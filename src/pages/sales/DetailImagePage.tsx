import { useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { GeneratedImage } from '@/apis/detailImage';
import Button from '@/components/common/Button';
import ProductShell from '@/components/layout/ProductShell';
import { useGenerateImage } from '@/hooks/useDetailImage';
import { useProduct } from '@/hooks/useProducts';
import {
  baseModelsMock,
  doneNoticeMock,
  doneTitleMock,
  GENERATE_DURATION_MS,
  GENERATE_ETA_SECONDS,
  generateTitleMock,
  generatingTitleMock,
  referencePhotosMock,
  type DetailImageTarget,
  type GenerationModeId,
} from '@/mocks/detailImage';
import { buildPath } from '@/routes/paths';
import { detailImageKey, useDetailImageStore } from '@/stores/useDetailImageStore';
import GeneratingSection from './components/detailImage/GeneratingSection';
import ModeSection from './components/detailImage/ModeSection';
import PromptSection from './components/detailImage/PromptSection';
import ReferenceSection, {
  type UploadedReference,
} from './components/detailImage/ReferenceSection';
import RegenerateConfirmModal from './components/detailImage/RegenerateConfirmModal';
import ResultSection from './components/detailImage/ResultSection';
import * as S from './components/detailImage/detailImage.styled';

const RECOMMENDED_PROMPTS = [
  '더 밝은 분위기로 만들어줘',
  '모델 컷으로 다시 만들어줘',
  '배경만 흰색으로 바꿔줘',
];

/** 진행 바 갱신 주기 */
const PROGRESS_TICK_MS = 100;
/** 완료 전까지 진행 바가 도달할 최대치 (응답을 받고 100%로 채운다) */
const PROGRESS_CAP = 0.95;

type GenerateStep = 'idle' | 'generating' | 'done';

/**
 * 상세 이미지 AI 생성 (Figma 573:6715 · 677:10398 · 677:10454 · 677:10510) —
 * 참고 사진 선택 → 생성 방식 → 요청 내용 → 생성 → 생성 중 → 결과 저장까지 한 화면에서 단계로 진행한다.
 * 라우트: /products/:productId/detail/:countryCode/image?target=product|detail&imageId=<재생성 대상>
 */
const DetailImagePage = () => {
  const params = useParams<{ productId: string; countryCode: string }>();
  const [searchParams] = useSearchParams();
  const productId = Number(params.productId);
  const countryCode = params.countryCode ?? '';

  // 상품 이미지 / 상세 이미지 — Figma 4상태 중 2개는 제목만 다른 같은 화면
  const target: DetailImageTarget = searchParams.get('target') === 'product' ? 'product' : 'detail';
  /** 이미 생성된 이미지를 다시 만드는 경우의 대상 id (있으면 재생성 확인 모달) */
  const regenerateId = searchParams.get('imageId');

  const { data: product } = useProduct(productId);

  if (!product) return <LoadingText>상품 정보를 불러오는 중…</LoadingText>;

  return (
    <ProductShell
      product={product}
      title={target === 'product' ? '상품 이미지 AI 생성' : '상세 이미지 AI 생성'}
      backTo={buildPath.detailPage(productId, countryCode)}
      countryCode={countryCode}
      recommendedPrompts={RECOMMENDED_PROMPTS}
    >
      <GenerateBody
        key={`${target}:${regenerateId ?? ''}`}
        productId={productId}
        countryCode={countryCode}
        target={target}
        regenerateId={regenerateId}
      />
    </ProductShell>
  );
};

interface GenerateBodyProps {
  productId: number;
  countryCode: string;
  target: DetailImageTarget;
  regenerateId: string | null;
}

const GenerateBody = ({ productId, countryCode, target, regenerateId }: GenerateBodyProps) => {
  const navigate = useNavigate();
  const storeKey = detailImageKey(productId, countryCode, target);
  const addImage = useDetailImageStore((state) => state.addImage);
  const replaceImage = useDetailImageStore((state) => state.replaceImage);
  const addedCount = useDetailImageStore((state) => state.addedByKey[storeKey]?.length ?? 0);

  const { mutate, reset } = useGenerateImage();

  // ① 참고 사진 — 보유 사진 선택 + 추가 업로드
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [uploads, setUploads] = useState<UploadedReference[]>([]);
  // ② 생성 방식
  const [mode, setMode] = useState<GenerationModeId>('basic');
  const [modelId, setModelId] = useState(baseModelsMock[0].id);
  // ③ 요청 내용
  const [prompt, setPrompt] = useState('');

  const [step, setStep] = useState<GenerateStep>('idle');
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<GeneratedImage | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  /** 취소된 요청의 응답을 무시하기 위한 실행 번호 */
  const runIdRef = useRef(0);
  /** 업로드 미리보기로 만든 objectURL — 언마운트 시 한 번에 해제 */
  const objectUrlsRef = useRef<string[]>([]);

  const hasReference = selectedIds.length + uploads.length > 0;
  const hasPrompt = prompt.trim().length > 0;
  const canGenerate = hasReference && hasPrompt;

  useEffect(
    () => () => {
      objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      objectUrlsRef.current = [];
    },
    [],
  );

  // 생성 중 진행 바 — 목 소요 시간에 맞춰 채우고, 응답 시 100%로 마감한다
  useEffect(() => {
    if (step !== 'generating') return;
    const startedAt = Date.now();
    const timer = setInterval(() => {
      const ratio = (Date.now() - startedAt) / GENERATE_DURATION_MS;
      setProgress(Math.min(ratio, PROGRESS_CAP));
    }, PROGRESS_TICK_MS);
    return () => clearInterval(timer);
  }, [step]);

  const handleUpload = (files: File[]) => {
    // objectURL 생성은 상태 업데이터 밖에서 (StrictMode 이중 호출로 누수되지 않게)
    const entries = files.map((file, index) => {
      const src = URL.createObjectURL(file);
      objectUrlsRef.current.push(src);
      return { id: `upload-${Date.now()}-${index}`, src };
    });
    setUploads((prev) => [
      ...prev,
      ...entries.map((entry, index) => ({
        ...entry,
        label: `레퍼런스 ${prev.length + index + 1}`,
      })),
    ]);
  };

  const handleRemoveUpload = (id: string) => {
    const removed = uploads.find((upload) => upload.id === id);
    if (removed) {
      URL.revokeObjectURL(removed.src);
      objectUrlsRef.current = objectUrlsRef.current.filter((url) => url !== removed.src);
    }
    setUploads((prev) => prev.filter((upload) => upload.id !== id));
  };

  const startGenerate = () => {
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    setConfirmOpen(false);
    setResult(null);
    setProgress(0);
    setStep('generating');
    mutate(
      {
        productId,
        countryCode,
        target,
        prompt: prompt.trim(),
        mode,
        modelId: mode === 'model' ? modelId : undefined,
        referenceIds: [...selectedIds, ...uploads.map((upload) => upload.id)],
      },
      {
        onSuccess: (data) => {
          // 취소 후 도착한 응답은 버린다
          if (runIdRef.current !== runId) return;
          setResult(data);
          setProgress(1);
          setStep('done');
        },
      },
    );
  };

  /** 이미 생성된 이미지가 있으면 재생성 확인 모달을 먼저 띄운다 */
  const requestGenerate = () => {
    if (!canGenerate) return;
    if (regenerateId || result) {
      setConfirmOpen(true);
      return;
    }
    startGenerate();
  };

  const cancelGenerate = () => {
    runIdRef.current += 1;
    reset();
    setProgress(0);
    setStep('idle');
  };

  const save = () => {
    if (!result) return;
    const entry = {
      id: result.id,
      label:
        target === 'detail' ? `상세 이미지 (AI ${addedCount + 1})` : `AI 생성 ${addedCount + 1}`,
      src: result.src,
      prompt: result.prompt,
    };
    if (regenerateId) replaceImage(storeKey, regenerateId, entry);
    else addImage(storeKey, entry);
    navigate(buildPath.detailPage(productId, countryCode));
  };

  const generating = step === 'generating';
  const title =
    step === 'generating'
      ? generatingTitleMock
      : step === 'done'
        ? doneTitleMock
        : generateTitleMock[target];

  return (
    <S.Layout>
      <header>
        <S.PageTitle>{title}</S.PageTitle>
        {step === 'done' && <S.PageNotice>{doneNoticeMock}</S.PageNotice>}
        {step === 'idle' && regenerateId && (
          <S.PageNotice>
            선택한 이미지를 새로 만듭니다. 생성한 이미지를 저장하면 기존 이미지를 대체합니다.
          </S.PageNotice>
        )}
      </header>

      {step === 'done' && result && <ResultSection src={result.src} prompt={result.prompt} />}

      <ReferenceSection
        photos={referencePhotosMock}
        selectedIds={selectedIds}
        onToggle={(id) =>
          setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id],
          )
        }
        uploads={uploads}
        onUpload={handleUpload}
        onRemoveUpload={handleRemoveUpload}
        disabled={generating}
      />

      <ModeSection
        mode={mode}
        onChangeMode={setMode}
        modelId={modelId}
        onChangeModel={setModelId}
        disabled={generating}
      />

      <PromptSection value={prompt} onChange={setPrompt} disabled={generating} />

      {generating ? (
        <GeneratingSection
          progress={progress}
          remainingSeconds={Math.max(Math.ceil(GENERATE_ETA_SECONDS * (1 - progress)), 1)}
          onCancel={cancelGenerate}
        />
      ) : step === 'done' ? (
        <S.ActionRow>
          <Button variant="secondary" fullWidth onClick={requestGenerate}>
            다시 생성
          </Button>
          <Button variant="primary" fullWidth onClick={save}>
            저장하기
          </Button>
        </S.ActionRow>
      ) : (
        <>
          <S.ActionRow>
            <Button variant="primary" fullWidth disabled={!canGenerate} onClick={requestGenerate}>
              생성
            </Button>
          </S.ActionRow>
          {!canGenerate && (
            <S.HintText>
              {!hasReference
                ? '참고 사진을 1장 이상 선택하거나 업로드하면 생성할 수 있어요.'
                : '어떤 이미지를 원하는지 요청 내용을 적어 주세요.'}
            </S.HintText>
          )}
        </>
      )}

      {/* 이미지 재생성 확인 모달 (Figma 604:10246) */}
      <RegenerateConfirmModal
        open={confirmOpen}
        onConfirm={startGenerate}
        onClose={() => setConfirmOpen(false)}
      />
    </S.Layout>
  );
};

const LoadingText = styled.p`
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default DetailImagePage;
