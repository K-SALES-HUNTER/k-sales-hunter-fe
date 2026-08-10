import { useEffect, useRef, useState, type FormEvent } from 'react';
import styled from '@emotion/styled';
import aiSparkleIcon from '@/assets/icons/ai-sparkle.svg';
import Button from '@/components/common/Button';
import { useAiChatStore } from '@/stores/useAiChatStore';

interface AiPanelProps {
  /** 페이지별 추천 프롬프트 (명세: 페이지 바뀔 때마다 갱신) */
  recommendedPrompts: string[];
}

/**
 * AI에게 질문하기 패널 (Figma 335:3411) — 우측 고정, 접기 가능.
 * 대화 이력이 없으면 추천 프롬프트만, 시작한 뒤에는 Q&A 상태 (대화는 페이지 전환에도 유지).
 */
const AiPanel = ({ recommendedPrompts }: AiPanelProps) => {
  const { messages, replying, send } = useAiChatStore();
  const [input, setInput] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages.length, replying]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || replying) return;
    send(text);
    setInput('');
  };

  if (collapsed) {
    return (
      <CollapsedBar
        type="button"
        onClick={() => setCollapsed(false)}
        aria-label="AI 패널 펼치기"
      >
        <img src={aiSparkleIcon} alt="" />
      </CollapsedBar>
    );
  }

  return (
    <Panel>
      <Header>
        <HeaderLeft>
          <IconBox>
            <img src={aiSparkleIcon} alt="" />
          </IconBox>
          <div>
            <Title>AI에게 질문하기</Title>
            <Subtitle>빠른 질의응답과 보조분석</Subtitle>
          </div>
        </HeaderLeft>
        <CollapseButton type="button" onClick={() => setCollapsed(true)} aria-label="AI 패널 접기">
          ›
        </CollapseButton>
      </Header>

      <Body ref={scrollRef}>
        {messages.length === 0 ? (
          <PromptList>
            {recommendedPrompts.map((prompt) => (
              <PromptButton key={prompt} type="button" onClick={() => send(prompt)}>
                {prompt}
              </PromptButton>
            ))}
          </PromptList>
        ) : (
          <ChatList>
            {messages.map((message) =>
              message.role === 'user' ? (
                <Question key={message.id}>{message.text}</Question>
              ) : (
                <Answer key={message.id}>{message.text}</Answer>
              ),
            )}
            {replying && <Answer aria-live="polite">답변을 작성하고 있어요…</Answer>}
          </ChatList>
        )}
      </Body>

      <InputRow onSubmit={handleSubmit}>
        <ChatInput
          value={input}
          placeholder="궁금한 점을 물어보세요"
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit" variant="primary" disabled={!input.trim() || replying}>
          전송
        </Button>
      </InputRow>
    </Panel>
  );
};

const Panel = styled.aside`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  width: 320px;
  height: 100%;
  border-left: 0.8px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};

  ${({ theme }) => theme.media.tablet} {
    display: none;
  }
`;

const CollapsedBar = styled.button`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-shrink: 0;
  width: 44px;
  height: 100%;
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-left: 0.8px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};

  img {
    width: 18px;
    height: 18px;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.bgLight};
  }

  ${({ theme }) => theme.media.tablet} {
    display: none;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
  border-bottom: 0.8px solid ${({ theme }) => theme.colors.primaryLight};
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const IconBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.bgLight};

  img {
    width: 15px;
    height: 15px;
  }
`;

const Title = styled.p`
  ${({ theme }) => theme.typography.label01};
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Subtitle = styled.p`
  ${({ theme }) => theme.typography.caption01};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CollapseButton = styled.button`
  width: 28px;
  height: 28px;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 18px;

  &:hover {
    background: ${({ theme }) => theme.colors.bgLight};
  }
`;

const Body = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: ${({ theme }) => `${theme.spacing.lg} 0`};
`;

const PromptList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: ${({ theme }) => `0 ${theme.spacing.md}`};
`;

const PromptButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primaryLight};
  text-align: left;
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textPrimary};

  &:hover {
    filter: brightness(0.96);
  }
`;

const ChatList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `0 ${theme.spacing.md}`};
`;

const Question = styled.p`
  align-self: flex-end;
  max-width: 85%;
  padding: ${({ theme }) => theme.spacing.xs};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primaryLight};
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: pre-wrap;
`;

const Answer = styled.p`
  align-self: flex-start;
  width: 100%;
  padding: ${({ theme }) => `${theme.spacing.xs} 0`};
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textPrimary};
  white-space: pre-wrap;
`;

const InputRow = styled.form`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
  border-top: 0.8px solid ${({ theme }) => theme.colors.border};
`;

const ChatInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 38px;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  outline: none;
  ${({ theme }) => theme.typography.body02};
  color: ${({ theme }) => theme.colors.textPrimary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export default AiPanel;
