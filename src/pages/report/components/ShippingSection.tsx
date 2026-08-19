import { useState } from 'react';
import styled from '@emotion/styled';
import Button from '@/components/common/Button';
import InputSet from '@/components/common/InputSet';
import Modal from '@/components/common/Modal';
import type { CountryReport, ShippingOption } from '@/types/report';

export interface PackagingValues {
  weight: string;
  width: string;
  depth: string;
  height: string;
}

const PACKAGING_FIELDS: { key: keyof PackagingValues; label: string; unit: string }[] = [
  { key: 'weight', label: '무게', unit: 'g' },
  { key: 'width', label: '가로', unit: 'cm' },
  { key: 'depth', label: '세로', unit: 'cm' },
  { key: 'height', label: '높이', unit: 'cm' },
];

interface ShippingSectionProps {
  shipping: CountryReport['shipping'];
  /** 상품 등록 시 입력한 포장 정보가 미리 채워진다 (RPT-02-01 #17) */
  initialPackaging: PackagingValues;
}

/**
 * RPT-02-01 배송 섹션 — 배송 방식 선택(라디오처럼 하나만) + 상품 포장 정보 + 통관 주의사항.
 * AI 추천 방식이 기본 선택. 저장 시 변경 내역 모달을 띄운다.
 */
const ShippingSection = ({ shipping, initialPackaging }: ShippingSectionProps) => {
  const recommended = shipping.options.find((o) => o.recommended) ?? shipping.options[0];
  const [selectedId, setSelectedId] = useState<ShippingOption['id']>(recommended.id);

  const [values, setValues] = useState<PackagingValues>(initialPackaging);
  const [saved, setSaved] = useState<PackagingValues>(initialPackaging);
  const [modalOpen, setModalOpen] = useState(false);

  const selected = shipping.options.find((o) => o.id === selectedId) ?? recommended;
  const changes = PACKAGING_FIELDS.filter((f) => values[f.key] !== saved[f.key]);

  const handleSave = () => setModalOpen(true);

  const confirmSave = () => {
    setSaved(values);
    setModalOpen(false);
  };

  return (
    <>
      <div>
        <SubTitle>배송 방식 선택</SubTitle>
        {/* 배송 미대행 고지 병기 (RPT-02-01 #15) */}
        <Notice>
          ※ 본 서비스는 배송을 직접 대행하지 않습니다. 상품과 판매 국가를 기준으로 권장 배송
          방식을 안내하며, 실제 배송 설정과 발송 처리는 셀러가 직접 진행해야 합니다. 선택한
          배송비는 매출 및 순이익 계산에 포함됩니다.
        </Notice>
      </div>

      <OptionGrid role="radiogroup" aria-label="배송 방식 선택">
        {shipping.options.map((option) => {
          const isSelected = option.id === selectedId;
          return (
            <OptionCard
              key={option.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              $selected={isSelected}
              onClick={() => setSelectedId(option.id)}
            >
              <OptionName $selected={isSelected}>{option.name}</OptionName>
              <OptionRow>
                <OptionLabel>예상 비용</OptionLabel>
                <OptionValue>{option.costText}</OptionValue>
              </OptionRow>
              <OptionRow>
                <OptionLabel>기간</OptionLabel>
                <OptionValue>{option.periodText}</OptionValue>
              </OptionRow>
              <FitBadge $selected={isSelected}>{option.fitBadge}</FitBadge>
            </OptionCard>
          );
        })}
      </OptionGrid>

      <DescriptionBox>{selected.description}</DescriptionBox>

      <div>
        <SubTitle>상품 포장 정보</SubTitle>
        <Caption>상품 포장 정보 입력 시 더욱 정확한 비용 계산이 가능합니다.</Caption>
      </div>

      <PackagingGrid>
        {PACKAGING_FIELDS.map((field) => (
          <InputSet
            key={field.key}
            label={field.label}
            unit={field.unit}
            inputMode="numeric"
            value={values[field.key]}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, [field.key]: e.target.value.replace(/[^0-9.]/g, '') }))
            }
          />
        ))}
      </PackagingGrid>
      <Button variant="primary" fullWidth onClick={handleSave}>
        저장
      </Button>

      <div>
        <SubTitle>통관 처리 시 주의사항</SubTitle>
        <WarningList>
          {/* 판정에 근거 조항 필수 표시 (R-004-03 RAG) */}
          {shipping.warnings.map((warning) => (
            <WarningRow key={warning}>
              {/* Figma 12:13779 — 붉은 경고 삼각형 (텍스트 색 상속) */}
              <WarningIcon aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" focusable="false">
                  <path d="M12 3L22.5 21H1.5L12 3Z" fill="currentColor" />
                  <path
                    className="warning-mark"
                    d="M12 9.5V14.5"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <circle className="warning-dot" cx="12" cy="17.4" r="1.1" />
                </svg>
              </WarningIcon>
              {warning}
            </WarningRow>
          ))}
        </WarningList>
      </div>

      {/* 포장 정보 변경 내역 모달 (RPT-02-01 #17 — 모달 ⑧) */}
      <Modal
        open={modalOpen}
        title={changes.length > 0 ? '아래 데이터가 변경되었습니다.' : '변경된 내용이 없습니다.'}
        description={
          changes.length > 0
            ? '변경된 포장 정보 기준으로 배송비와 순이익이 다시 계산됩니다.'
            : undefined
        }
        onClose={() => setModalOpen(false)}
        footer={
          <Button variant="primary" fullWidth onClick={confirmSave}>
            확인
          </Button>
        }
      >
        {changes.length > 0 && (
          <ChangeList>
            {changes.map((field) => (
              <ChangeRow key={field.key}>
                <ChangeLabel>{field.label}</ChangeLabel>
                <ChangeValue>
                  {saved[field.key] || '-'}
                  {field.unit} → <strong>{values[field.key] || '-'}</strong>
                  {field.unit}
                </ChangeValue>
              </ChangeRow>
            ))}
          </ChangeList>
        )}
      </Modal>
    </>
  );
};

const SubTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Notice = styled.p`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.error};
`;

const OptionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.media.mobile} {
    grid-template-columns: 1fr;
  }
`;

const OptionCard = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
  text-align: left;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid
    ${({ theme, $selected }) => ($selected ? theme.colors.third : theme.colors.border)};
  background: ${({ theme, $selected }) =>
    $selected ? theme.colors.primaryLight : theme.colors.surface};
  transition:
    border-color 120ms ease-out,
    background 120ms ease-out;
`;

const OptionName = styled.span<{ $selected: boolean }>`
  font-size: 18px;
  font-weight: 700;
  line-height: 24px;
  color: ${({ theme, $selected }) =>
    $selected ? theme.colors.primary : theme.colors.textPrimary};
`;

const OptionRow = styled.span`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const OptionLabel = styled.span`
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const OptionValue = styled.span`
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const FitBadge = styled.span<{ $selected: boolean }>`
  margin-top: ${({ theme }) => theme.spacing.xxs};
  padding: ${({ theme }) => `${theme.spacing.xxs} ${theme.spacing.xs}`};
  border-radius: ${({ theme }) => theme.radius.sm};
  ${({ theme }) => theme.typography.captionStrong};
  ${({ theme, $selected }) =>
    $selected
      ? `background: ${theme.colors.primary}; color: ${theme.colors.textOnPrimary};`
      : `background: ${theme.colors.surface}; color: ${theme.colors.textPrimary}; border: 1px solid ${theme.colors.border};`}
`;

const DescriptionBox = styled.p`
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.bgLight};
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Caption = styled.p`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const PackagingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${({ theme }) => theme.spacing.md};

  ${({ theme }) => theme.media.mobile} {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const WarningList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const WarningRow = styled.p`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.errorLight};
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.error};
`;

const WarningIcon = styled.span`
  display: inline-flex;
  flex-shrink: 0;

  .warning-mark {
    stroke: ${({ theme }) => theme.colors.surface};
  }

  .warning-dot {
    fill: ${({ theme }) => theme.colors.surface};
  }
`;

const ChangeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ChangeRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.bgLight};
`;

const ChangeLabel = styled.span`
  ${({ theme }) => theme.typography.label02};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const ChangeValue = styled.span`
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textPrimary};

  strong {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export default ShippingSection;
