import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { regenerateConfirmMock } from '@/mocks/detailImage';

interface RegenerateConfirmModalProps {
  open: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/** 이미지 재생성 확인 모달 (Figma 604:10246 · 604:10270) */
const RegenerateConfirmModal = ({ open, onConfirm, onClose }: RegenerateConfirmModalProps) => (
  <Modal
    open={open}
    title={regenerateConfirmMock.title}
    description={regenerateConfirmMock.description}
    onClose={onClose}
    footer={
      <>
        <Button type="button" variant="primary" onClick={onConfirm}>
          {regenerateConfirmMock.confirmLabel}
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          {regenerateConfirmMock.cancelLabel}
        </Button>
      </>
    }
  />
);

export default RegenerateConfirmModal;
