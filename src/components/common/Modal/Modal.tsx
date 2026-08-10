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
}

/**
 * modal (Figma 511:6211) — 중앙 확인 대화상자.
 * 배경 딤드 + 뒤 영역 스크롤 잠금.
 */
const Modal = ({ open, title, description, footer, children, onClose }: ModalProps) => {
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
