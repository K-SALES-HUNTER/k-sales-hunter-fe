import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import * as S from './Modal.styled';

interface ModalProps {
  open: boolean;
  title: string;
  description?: string;
  /** 하단 버튼 영역 */
  footer?: ReactNode;
  children?: ReactNode;
  /** 딤드 클릭 시 닫기. 넘기지 않으면 딤드 클릭으로 닫히지 않음 */
  onClose?: () => void;
  /** 제목 위 원형 아이콘 숨김 (Figma 12:15474는 기본 노출) */
  hideIcon?: boolean;
}

/**
 * modal (Figma 511:6211) — 중앙 확인 대화상자.
 * 배경 딤드 + 뒤 영역 스크롤 잠금.
 */
const Modal = ({
  open,
  title,
  description,
  footer,
  children,
  onClose,
  hideIcon = false,
}: ModalProps) => {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <S.Dim onClick={onClose}>
      <S.Card
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
      >
        {!hideIcon && (
          <S.IconCircle aria-hidden>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" focusable="false">
              <path
                d="M12 6.5V13"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
              <circle cx="12" cy="17.2" r="1.5" fill="currentColor" />
            </svg>
          </S.IconCircle>
        )}
        <S.Title>{title}</S.Title>
        {description && <S.Description>{description}</S.Description>}
        {children}
        {footer && <S.Footer>{footer}</S.Footer>}
      </S.Card>
    </S.Dim>,
    document.body,
  );
};

export default Modal;
