import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import { PATH } from '@/routes/paths';

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * 환영 모달 (Figma 510:4165 대시보드 위 오버레이) —
 * 마켓 연동 전 첫 진입 시 마켓 정보 등록을 유도한다.
 */
const WelcomeModal = ({ open, onClose }: WelcomeModalProps) => {
  const navigate = useNavigate();

  return (
    <Modal
      open={open}
      title="환영합니다!"
      description="마켓 정보를 등록하고 서비스를 이용해 보세요."
      onClose={onClose}
      footer={
        <>
          <Button variant="primary" onClick={() => navigate(PATH.SETTINGS)}>
            마켓 정보 등록
          </Button>
          <Button variant="secondary" onClick={onClose}>
            둘러보기
          </Button>
        </>
      }
    />
  );
};

export default WelcomeModal;
