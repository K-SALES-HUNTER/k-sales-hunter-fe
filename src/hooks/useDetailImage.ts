import { useMutation } from '@tanstack/react-query';
import { generateImage } from '@/apis/detailImage';

/** 이미지 AI 생성 요청 (1회 = 1장) */
export const useGenerateImage = () => useMutation({ mutationFn: generateImage });
