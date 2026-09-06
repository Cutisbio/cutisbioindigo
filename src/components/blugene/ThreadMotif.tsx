/**
 * 데님 실 두 가닥을 연상시키는 추상 선.
 *
 * DNA 이중나선을 문자 그대로 그리지 않는다. 화학구조도·인증마크처럼 보이지 않게 한다.
 * 순수 장식이므로 aria-hidden 이며, 정보를 담지 않는다.
 */
export default function ThreadMotif({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 400"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" className="text-white/25" strokeWidth="1.1" strokeLinecap="round">
        <path d="M-20 300C90 300 150 250 210 196c48-43 92-96 156-96 70 0 112 52 112 108 0 48-38 84-84 84-42 0-74-30-74-70 0-34 26-60 58-60 28 0 48 20 48 46" />
        <path d="M-20 318C92 318 156 268 216 214c46-41 88-92 150-92 62 0 100 46 100 96 0 44-34 76-76 76-38 0-68-28-68-64 0-30 24-54 52-54 26 0 44 18 44 42" />
      </g>
      <g stroke="currentColor" className="text-white/12" strokeWidth="0.8" strokeDasharray="2 7">
        <path d="M-20 336C96 336 164 286 224 232c44-39 84-88 144-88 56 0 90 42 90 88" />
      </g>
    </svg>
  );
}
