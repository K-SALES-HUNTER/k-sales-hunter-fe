import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchCategoryOptions, requestAiFill } from '@/apis/productForm';

export interface ProductFormValues {
  name: string;
  category: string;
  costPrice: string;
  weight: string;
  description: string;
  sellingPoints: string;
  mainTarget: string;
}

export type ProductFormField = keyof ProductFormValues;

export interface ProductFormImage {
  id: string;
  url: string;
  /** URL.createObjectURL로 만든 미리보기면 언마운트·삭제 시 revoke 필요 */
  isObjectUrl: boolean;
  /** 업로드 중이면 진행률(0~1), 업로드 완료면 null (Figma ImagePreviewCard 로딩 상태) */
  uploadProgress: number | null;
}

export const EMPTY_FORM_VALUES: ProductFormValues = {
  name: '',
  category: '',
  costPrice: '',
  weight: '',
  description: '',
  sellingPoints: '',
  mainTarget: '',
};

/** AI 자동 채우기 대상 필드 (명세 R-001-02: 카테고리·상품 설명·셀링 포인트·메인 타겟) */
export const AI_FILL_FIELDS = [
  'category',
  'description',
  'sellingPoints',
  'mainTarget',
] as const satisfies readonly ProductFormField[];

/** 상품 이미지 최대 장수 (명세 F-11) */
export const MAX_PRODUCT_IMAGES = 12;

/** 업로드 목: 프로그레스가 0.8초 동안 차오른 뒤 썸네일로 전환 */
const UPLOAD_DURATION_MS = 800;
const UPLOAD_TICK_MS = 60;

export const useCategoryOptions = () =>
  useQuery({ queryKey: ['categoryOptions'], queryFn: fetchCategoryOptions });

let imageIdSeq = 0;
const nextImageId = () => `product-form-image-${(imageIdSeq += 1)}`;

interface UseProductFormInitial {
  values: ProductFormValues;
  imageUrls: string[];
}

/**
 * 상품 등록·수정 폼 공용 상태 (PRD-01-01 · EDT-01-01).
 * - AI가 채운 필드는 aiFilledFields로 구분, 사용자가 수정하면 해제(사용자 입력 승격)
 * - AI 자동 채우기는 비어 있는 대상 필드만 채운다 (사용자 입력값 미덮어쓰기)
 */
export const useProductForm = (initial?: UseProductFormInitial) => {
  const [values, setValues] = useState<ProductFormValues>(
    initial?.values ?? EMPTY_FORM_VALUES,
  );
  const [images, setImages] = useState<ProductFormImage[]>(() =>
    (initial?.imageUrls ?? []).map((url) => ({
      id: nextImageId(),
      url,
      isObjectUrl: false,
      uploadProgress: null,
    })),
  );
  const [aiFilledFields, setAiFilledFields] = useState<ReadonlySet<ProductFormField>>(
    new Set(),
  );
  const [aiLoading, setAiLoading] = useState(false);
  const [aiFillDone, setAiFillDone] = useState(false);

  // runAiFill 응답 시점의 최신 입력값을 참조하기 위한 미러
  const valuesRef = useRef(values);
  const imagesRef = useRef(images);
  useEffect(() => {
    valuesRef.current = values;
  }, [values]);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  // 업로드 진행 타이머 — 언마운트 시 정리
  const uploadTimersRef = useRef(new Set<ReturnType<typeof setInterval>>());

  // 언마운트 시 objectURL · 진행 타이머 정리
  useEffect(
    () => () => {
      imagesRef.current.forEach((image) => {
        if (image.isObjectUrl) URL.revokeObjectURL(image.url);
      });
      uploadTimersRef.current.forEach((timer) => clearInterval(timer));
      uploadTimersRef.current.clear();
    },
    [],
  );

  const setValue = useCallback((field: ProductFormField, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // 사용자가 수정하면 AI가채움 마크 해제 (사용자 입력으로 승격)
    setAiFilledFields((prev) => {
      if (!prev.has(field)) return prev;
      const next = new Set(prev);
      next.delete(field);
      return next;
    });
  }, []);

  /**
   * 최신 이미지가 왼쪽(앞) — 명세 F-11.
   * 업로드 중 카드(프로그레스)를 먼저 넣고 0.8초에 걸쳐 채운 뒤 썸네일로 전환한다(목).
   */
  const addImages = useCallback((files: File[]) => {
    const remaining = MAX_PRODUCT_IMAGES - imagesRef.current.length;
    if (remaining <= 0) return;

    const added: ProductFormImage[] = files.slice(0, remaining).map((file) => ({
      id: nextImageId(),
      url: URL.createObjectURL(file),
      isObjectUrl: true,
      uploadProgress: 0,
    }));
    if (added.length === 0) return;

    setImages((prev) => [...added, ...prev]);
    imagesRef.current = [...added, ...imagesRef.current];

    // TODO: 실제 업로드 연동 시 XHR progress 이벤트로 교체
    const uploadingIds = new Set(added.map((image) => image.id));
    const startedAt = Date.now();
    const timer = setInterval(() => {
      const ratio = Math.min((Date.now() - startedAt) / UPLOAD_DURATION_MS, 1);
      const done = ratio >= 1;
      if (done) {
        clearInterval(timer);
        uploadTimersRef.current.delete(timer);
      }
      setImages((prev) =>
        prev.map((image) =>
          uploadingIds.has(image.id)
            ? { ...image, uploadProgress: done ? null : ratio }
            : image,
        ),
      );
    }, UPLOAD_TICK_MS);
    uploadTimersRef.current.add(timer);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const target = prev.find((image) => image.id === id);
      if (target?.isObjectUrl) URL.revokeObjectURL(target.url);
      return prev.filter((image) => image.id !== id);
    });
  }, []);

  /** 비어 있는 대상 필드만 목 값으로 채우고 AI가채움 마크 */
  const runAiFill = useCallback(async () => {
    setAiLoading(true);
    try {
      const result = await requestAiFill();
      const current = valuesRef.current;
      const emptyFields = AI_FILL_FIELDS.filter((field) => !current[field].trim());
      if (emptyFields.length > 0) {
        setValues((prev) => {
          const next = { ...prev };
          emptyFields.forEach((field) => {
            next[field] = result[field];
          });
          return next;
        });
        setAiFilledFields((prev) => new Set([...prev, ...emptyFields]));
      }
      setAiFillDone(true);
    } finally {
      setAiLoading(false);
    }
  }, []);

  const requiredFilled =
    values.name.trim() !== '' &&
    values.category !== '' &&
    values.costPrice.trim() !== '' &&
    values.weight.trim() !== '';

  /** AI 자동 채우기 활성 조건: 상품명 또는 이미지 1개 이상 (명세 F-10) */
  const canRunAiFill = values.name.trim() !== '' || images.length > 0;

  /** 수정 화면: 빈 대상 필드가 있을 때만 AI 버튼 노출 (EDT-01-01) */
  const hasEmptyAiField = AI_FILL_FIELDS.some((field) => !values[field].trim());

  /**
   * 비어 있는 항목이 하나라도 있으면 우측 상단 버튼이 '자동 채우기',
   * 전부 채워지면 '등록'/'저장'으로 바뀐다 (Figma 224:4210 → 526:6580).
   */
  const hasEmptyField = (Object.keys(values) as ProductFormField[]).some(
    (field) => !values[field].trim(),
  );

  /** 업로드가 끝나지 않은 이미지가 있으면 제출을 막는다 */
  const imagesUploading = images.some((image) => image.uploadProgress !== null);

  return {
    values,
    setValue,
    images,
    addImages,
    removeImage,
    aiFilledFields,
    aiLoading,
    aiFillDone,
    runAiFill,
    requiredFilled,
    canRunAiFill,
    hasEmptyAiField,
    hasEmptyField,
    imagesUploading,
  };
};

export type ProductFormState = ReturnType<typeof useProductForm>;
