/**
 * 화면 전환 진행 상태 — 클릭한 링크(LinkPending)와 언어 전환기(LanguageSwitcher)가 '기다리는 중'을 알리고,
 * 상단 진행 막대(NavProgress)가 구독한다(2026-10-06, 클릭 반응이 느리다는 고객 지적).
 *
 * 전환 하나당 begin/end 한 쌍이다. 여러 전환이 겹칠 수 있어 개수를 센다. 외부 저장소라 useSyncExternalStore 로 읽는다.
 * 브라우저에서만 쓰이고 서버 렌더링에는 영향이 없다(getServerSnapshot 은 항상 0).
 */
type Listener = () => void;

let count = 0;
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) listener();
}

export const navPending = {
  begin() {
    count += 1;
    emit();
  },
  end() {
    count = Math.max(0, count - 1);
    emit();
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot() {
    return count;
  },
  getServerSnapshot() {
    return 0;
  },
};
