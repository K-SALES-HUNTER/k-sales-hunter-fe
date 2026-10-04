/** 서버 잡 폴링 간격 — API 스펙 원칙 4 (2초) */
export const POLL_INTERVAL_MS = 2000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface PollOptions<T> {
  /** true 를 돌려주면 폴링을 끝낸다 */
  done: (value: T) => boolean;
  /** 매 응답마다 호출 (진행률 표시용) */
  onTick?: (value: T) => void;
  /** 중단 신호 — abort 되면 'AbortError' 로 끝난다 */
  signal?: AbortSignal;
  intervalMs?: number;
}

/**
 * 잡이 끝날 때까지 다시 부른다. 분석·상세페이지·이미지 잡이 같은 방식이다.
 * 시간 제한은 두지 않는다 — 서버 잡이 자체 타임아웃으로 FAILED 를 준다.
 */
export const pollUntil = async <T>(
  fetcher: () => Promise<T>,
  { done, onTick, signal, intervalMs = POLL_INTERVAL_MS }: PollOptions<T>,
): Promise<T> => {
  for (;;) {
    if (signal?.aborted) throw new DOMException('polling aborted', 'AbortError');
    const value = await fetcher();
    onTick?.(value);
    if (done(value)) return value;
    await sleep(intervalMs);
  }
};
