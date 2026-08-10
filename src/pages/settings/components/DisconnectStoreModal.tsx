import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';

interface DisconnectStoreModalProps {
  open: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

/** 연동 해제 확인 모달 (모달 ⑥ · Figma 565:14797) */
const DisconnectStoreModal = ({ open, loading, onConfirm, onClose }: DisconnectStoreModalProps) => (
  <Modal
    open={open}
    title="연동을 해제하시겠어요?"
    description="연동 해제 시, 더 이상 해당 국가의 스토어에는 상품을 자동 업로드하거나 관리할 수 없어요."
    onClose={onClose}
    footer={
      <>
        <Button type="button" variant="primary" loading={loading} onClick={onConfirm}>
          확인
        </Button>
        <Button type="button" variant="secondary" onClick={onClose}>
          취소
        </Button>
      </>
    }
  />
);

export default DisconnectStoreModal;
