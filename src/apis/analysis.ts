import { axiosInstance } from './axiosInstance';

export type AnalysisJobStatus =
  'QUEUED' | 'RUNNING' | 'CANCEL_REQUESTED' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
export type AnalysisStep = 'GATE' | 'MARKET' | 'SHIPPING' | 'MARGIN' | 'REPORT';

export interface AnalysisStatus {
  jobId: string;
  status: AnalysisJobStatus;
  step: AnalysisStep | null;
  progress: number;
  errorCode: string | null;
}

/** 분석 진행 상태 — GET /products/{id}/analysis (2초 폴링) */
export const fetchAnalysisStatus = async (productId: number): Promise<AnalysisStatus> => {
  const { data } = await axiosInstance.get<AnalysisStatus>(`/products/${productId}/analysis`);
  return data;
};

/** 오버레이 '중단하기' — POST /products/{id}/analysis/cancel */
export const cancelAnalysis = async (productId: number): Promise<void> => {
  await axiosInstance.post(`/products/${productId}/analysis/cancel`);
};

/** 서버 step → 오버레이에서 완료된 단계 수 (5단계, AiLoadingOverlay STEPS 순서와 같다) */
const STEP_INDEX: Record<AnalysisStep, number> = {
  GATE: 0,
  MARKET: 1,
  SHIPPING: 2,
  MARGIN: 3,
  REPORT: 4,
};

export const completedStepsOf = (status: AnalysisStatus): number => {
  if (status.status === 'COMPLETED') return 5;
  return status.step ? STEP_INDEX[status.step] : 0;
};

export const isAnalysisFinished = (status: AnalysisStatus) =>
  ['COMPLETED', 'FAILED', 'CANCELLED'].includes(status.status);
