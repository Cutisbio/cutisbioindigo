/**
 * 「원료에서 원단까지」 4단계 삽화.
 *
 * 순수 장식(aria-hidden)이다 — 의미는 언제나 ProductionPathway 의 제목·본문 텍스트가 담는다.
 *
 * 규칙
 * - 글자 · 숫자 · 화학식을 그림 안에 넣지 않는다(번역이 안 되고, 확대 · 낭독기에서 죽는다).
 * - 화학구조식 · DNA · 인증마크 · 배출 제로 같은 기호로 보이는 형태를 쓰지 않는다.
 * - 색은 사이트 토큰만 쓴다. 파랑은 인디고다 — 2단계(발효)에서 처음 나타나 3 · 4단계로 이어진다.
 *   sage 는 살아 있는 것(잎 · 미생물)에만 쓴다.
 * - 뷰박스 240×180(4:3). 데스크톱에서 열 너비(약 286px), 폰에서 120px 안팎으로 그려지므로
 *   120px 에서도 대상이 읽혀야 한다.
 *
 * 원본 SVG 는 `final` 초안이며, scratchpad 의 svg-to-tsx.mjs 가 이 파일을 만든다.
 * 손으로 고칠 때는 이 파일을 직접 고친다 — 초안 폴더는 저장소에 없다.
 */
export const PATHWAY_STEPS = ['feedstock', 'fermentation', 'recovery', 'fabric'] as const;
export type PathwayStepKey = (typeof PATHWAY_STEPS)[number];

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 240 180"
      className="block h-auto w-full"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export default function PathwayArt({ step }: { step: PathwayStepKey }) {
  if (step === 'feedstock') {
    // 재생 가능한 원료 — 옥수수(바이오매스)
    return (
      <Frame>
        <line
          x1="14"
          y1="156"
          x2="226"
          y2="156"
          stroke="var(--color-indigo-deep)"
          strokeWidth="2.5"
        />
        <path
          d="M120 30 L120 10 M120 30 L104 16 M120 30 L136 16 M120 30 L110 10 M120 30 L130 10"
          stroke="var(--color-indigo-deep)"
          strokeWidth="2.5"
        />
        <path
          d="M113 156 L127 156 L123 30 L117 30 Z"
          fill="var(--color-sage)"
          stroke="var(--color-indigo-deep)"
          strokeWidth="2.5"
        />
        <path
          d="M117 118 C 96 104, 60 112, 26 108 C 58 132, 96 136, 117 134 Z"
          fill="var(--color-sage)"
          stroke="var(--color-indigo-deep)"
          strokeWidth="2.5"
        />
        <path
          d="M112 126 C 90 118, 62 120, 40 112"
          stroke="var(--color-indigo-deep)"
          strokeWidth="1.5"
        />
        <path
          d="M117 66 C 98 50, 58 46, 28 50 C 56 66, 94 70, 117 82 Z"
          fill="var(--color-sage)"
          stroke="var(--color-indigo-deep)"
          strokeWidth="2.5"
        />
        <path
          d="M112 74 C 92 62, 66 58, 44 54"
          stroke="var(--color-indigo-deep)"
          strokeWidth="1.5"
        />
        <path
          d="M123 50 C 142 32, 178 26, 210 28 C 180 46, 148 48, 123 62 Z"
          fill="var(--color-sage)"
          stroke="var(--color-indigo-deep)"
          strokeWidth="2.5"
        />
        <path
          d="M128 56 C 150 42, 176 36, 196 32"
          stroke="var(--color-indigo-deep)"
          strokeWidth="1.5"
        />
        <path
          d="M123 134 C 152 118, 190 122, 220 116 C 190 140, 152 144, 123 148 Z"
          fill="var(--color-sage)"
          stroke="var(--color-indigo-deep)"
          strokeWidth="2.5"
        />
        <path
          d="M130 140 C 156 128, 186 130, 206 120"
          stroke="var(--color-indigo-deep)"
          strokeWidth="1.5"
        />
        <g transform="rotate(28 124 138)">
          <path
            d="M124 50 C 118 44, 116 38, 118 32 M124 50 C 130 42, 132 36, 134 34 M124 50 C 124 42, 122 36, 126 30"
            stroke="var(--color-indigo-deep)"
            strokeWidth="1.5"
          />
          <rect
            x="111"
            y="50"
            width="26"
            height="76"
            rx="13"
            fill="var(--color-paper)"
            stroke="var(--color-indigo-deep)"
            strokeWidth="2.5"
          />
          <g stroke="var(--color-indigo-deep)" strokeWidth="1.5">
            <circle cx="117" cy="58" r="1" />
            <circle cx="124" cy="58" r="1" />
            <circle cx="131" cy="58" r="1" />
            <circle cx="120.5" cy="64" r="1" />
            <circle cx="127.5" cy="64" r="1" />
            <circle cx="117" cy="70" r="1" />
            <circle cx="124" cy="70" r="1" />
            <circle cx="131" cy="70" r="1" />
            <circle cx="120.5" cy="76" r="1" />
            <circle cx="127.5" cy="76" r="1" />
            <circle cx="117" cy="82" r="1" />
            <circle cx="124" cy="82" r="1" />
            <circle cx="131" cy="82" r="1" />
            <circle cx="120.5" cy="88" r="1" />
            <circle cx="127.5" cy="88" r="1" />
            <circle cx="117" cy="94" r="1" />
            <circle cx="124" cy="94" r="1" />
            <circle cx="131" cy="94" r="1" />
            <circle cx="120.5" cy="100" r="1" />
            <circle cx="127.5" cy="100" r="1" />
            <circle cx="117" cy="106" r="1" />
            <circle cx="124" cy="106" r="1" />
            <circle cx="131" cy="106" r="1" />
            <circle cx="120.5" cy="112" r="1" />
            <circle cx="127.5" cy="112" r="1" />
            <circle cx="117" cy="118" r="1" />
            <circle cx="124" cy="118" r="1" />
            <circle cx="131" cy="118" r="1" />
          </g>
          <path
            d="M104 82 C 96 112, 104 136, 124 142 C 118 134, 112 118, 109 100 C 107 94, 105 88, 104 82 Z"
            fill="var(--color-sage)"
            stroke="var(--color-indigo-deep)"
            strokeWidth="2.5"
          />
          <path
            d="M144 82 C 152 112, 144 136, 124 142 C 130 134, 136 118, 139 100 C 141 94, 143 88, 144 82 Z"
            fill="var(--color-sage)"
            stroke="var(--color-indigo-deep)"
            strokeWidth="2.5"
          />
        </g>
      </Frame>
    );
  }
  if (step === 'fermentation') {
    // 미생물 발효 — 발효조 안의 미생물, 아래쪽부터 인디고로
    return (
      <Frame>
        <line
          x1="14"
          y1="156"
          x2="226"
          y2="156"
          stroke="var(--color-indigo-deep)"
          strokeWidth="2.5"
        />
        <rect x="84" y="136" width="9" height="20" fill="var(--color-indigo-deep)" />
        <rect x="147" y="136" width="9" height="20" fill="var(--color-indigo-deep)" />
        <path
          d="M190 14 V68 Q190 76 182 76 H170"
          stroke="var(--color-indigo-deep)"
          strokeWidth="9.5"
        />
        <path d="M190 14 V68 Q190 76 182 76 H170" stroke="var(--color-washed)" strokeWidth="4.5" />
        <rect x="166" y="68" width="6" height="16" rx="1" fill="var(--color-indigo-deep)" />
        <path
          d="M74 62 C 74 38, 166 38, 166 62 L166 122 C 166 138, 74 138, 74 122 Z"
          fill="var(--color-paper)"
        />
        <path
          d="M76 70 Q 98 65 120 70 T 164 70 L164 122 C 164 136, 76 136, 76 122 Z"
          fill="var(--color-washed)"
        />
        <path
          d="M76 96 Q 98 91 120 96 T 164 96 L164 122 C 164 136, 76 136, 76 122 Z"
          fill="var(--color-denim)"
        />
        <path
          d="M76 118 Q 98 113 120 118 T 164 118 L164 122 C 164 136, 76 136, 76 122 Z"
          fill="var(--color-indigo-deep)"
        />
        <path d="M76 70 Q 98 65 120 70 T 164 70" stroke="var(--color-denim)" strokeWidth="1.5" />
        <path d="M120 44 V70" stroke="var(--color-indigo-deep)" strokeWidth="2.5" />
        <path d="M120 70 V128" stroke="var(--color-washed)" strokeWidth="2.5" />
        <g fill="var(--color-washed)" stroke="var(--color-indigo-deep)" strokeWidth="1.5">
          <rect x="98" y="92" width="44" height="6" rx="1.5" />
          <rect x="94" y="88" width="7" height="14" rx="1.5" />
          <rect x="139" y="88" width="7" height="14" rx="1.5" />
          <rect x="98" y="118" width="44" height="6" rx="1.5" />
          <rect x="94" y="114" width="7" height="14" rx="1.5" />
          <rect x="139" y="114" width="7" height="14" rx="1.5" />
        </g>
        <g strokeWidth="1.5">
          <circle cx="104" cy="82" r="2.5" stroke="var(--color-denim)" />
          <circle cx="130" cy="78" r="2" stroke="var(--color-denim)" />
          <circle cx="110" cy="106" r="2.5" stroke="var(--color-washed)" />
          <circle cx="132" cy="110" r="2" stroke="var(--color-washed)" />
          <circle cx="108" cy="130" r="2" stroke="var(--color-washed)" />
          <circle cx="136" cy="130" r="2.5" stroke="var(--color-washed)" />
        </g>
        <g fill="var(--color-sage)" stroke="var(--color-indigo-deep)" strokeWidth="1.5">
          <rect
            x="-10"
            y="-3.5"
            width="20"
            height="7"
            rx="3.5"
            transform="translate(90 80) rotate(-20)"
          />
          <rect
            x="-10"
            y="-3.5"
            width="20"
            height="7"
            rx="3.5"
            transform="translate(150 80) rotate(15)"
          />
          <rect
            x="-10"
            y="-3.5"
            width="20"
            height="7"
            rx="3.5"
            transform="translate(89 110) rotate(30)"
          />
          <rect
            x="-10"
            y="-3.5"
            width="20"
            height="7"
            rx="3.5"
            transform="translate(153 108) rotate(-12)"
          />
          <rect
            x="-10"
            y="-3.5"
            width="20"
            height="7"
            rx="3.5"
            transform="translate(97 124) rotate(8)"
          />
          <rect
            x="-10"
            y="-3.5"
            width="20"
            height="7"
            rx="3.5"
            transform="translate(148 122) rotate(-15)"
          />
          <rect
            x="-10"
            y="-3.5"
            width="20"
            height="7"
            rx="3.5"
            transform="translate(122 88) rotate(22)"
          />
        </g>
        <path
          d="M74 62 C 74 38, 166 38, 166 62 L166 122 C 166 138, 74 138, 74 122 Z"
          stroke="var(--color-indigo-deep)"
          strokeWidth="2.5"
        />
        <rect x="70" y="60" width="100" height="5" rx="1" fill="var(--color-indigo-deep)" />
        <rect x="115" y="34" width="10" height="10" fill="var(--color-indigo-deep)" />
        <rect
          x="104"
          y="16"
          width="32"
          height="18"
          rx="2"
          fill="var(--color-washed)"
          stroke="var(--color-indigo-deep)"
          strokeWidth="2.5"
        />
      </Frame>
    );
  }
  if (step === 'recovery') {
    // 인디고 회수 · 제품화 — 여과 → 분말과 프린팅 잉크
    return (
      <Frame>
        <line
          x1="14"
          y1="156"
          x2="226"
          y2="156"
          stroke="var(--color-indigo-deep)"
          strokeWidth="2.5"
        />
        <path d="M16 40 V156" stroke="var(--color-indigo-deep)" strokeWidth="2.5" />
        <path d="M16 70 H92" stroke="var(--color-indigo-deep)" strokeWidth="2.5" />
        <path
          d="M14 28 H54 C 60 28, 62 32, 62 38 V50"
          stroke="var(--color-indigo-deep)"
          strokeWidth="9.5"
        />
        <path
          d="M14 28 H54 C 60 28, 62 32, 62 38 V50"
          stroke="var(--color-denim)"
          strokeWidth="4.5"
        />
        <path d="M59 50 H65 L64 62 H60 Z" fill="var(--color-denim)" />
        <path d="M26 54 H94 L66 100 V120 H54 V100 Z" fill="var(--color-paper)" />
        <path d="M30 60 H90 L80 76 H40 Z" fill="var(--color-denim)" />
        <path d="M40 76 H80 L68 96 H52 Z" fill="var(--color-indigo-deep)" />
        <path d="M55 100 H65 V120 H55 Z" fill="var(--color-washed)" />
        <path
          d="M26 54 H94 L66 100 V120 H54 V100 Z"
          stroke="var(--color-indigo-deep)"
          strokeWidth="2.5"
        />
        <path d="M40 122 V150 Q40 156 46 156 H74 Q80 156 80 150 V122" fill="var(--color-paper)" />
        <path d="M41 136 H79 V150 Q79 155 74 155 H46 Q41 155 41 150 Z" fill="var(--color-washed)" />
        <path
          d="M40 122 V150 Q40 156 46 156 H74 Q80 156 80 150 V122"
          stroke="var(--color-indigo-deep)"
          strokeWidth="2.5"
        />
        <g stroke="var(--color-denim)" strokeWidth="2.5">
          <line x1="96" y1="80" x2="126" y2="80" />
          <polyline points="119,73 126,80 119,87" />
        </g>
        <path
          d="M98 156 C 110 128, 130 100, 144 88 C 160 92, 180 128, 188 156 Z"
          fill="var(--color-indigo-deep)"
        />
        <path
          d="M144 88 C 160 92, 180 128, 188 156 H166 C 166 132, 158 108, 144 88 Z"
          fill="var(--color-denim)"
        />
        <g fill="var(--color-indigo-deep)">
          <circle cx="93" cy="153" r="2" />
          <circle cx="87" cy="149" r="1.6" />
          <circle cx="97" cy="145" r="1.6" />
          <circle cx="82" cy="154" r="1.4" />
          <circle cx="101" cy="151" r="1.4" />
        </g>
        <rect x="192" y="100" width="36" height="56" rx="2" fill="var(--color-paper)" />
        <path
          d="M194 118 H226 V152 Q226 154 224 154 H196 Q194 154 194 152 Z"
          fill="var(--color-indigo-deep)"
        />
        <line x1="194" y1="118" x2="226" y2="118" stroke="var(--color-denim)" strokeWidth="1.5" />
        <line x1="198" y1="105" x2="198" y2="113" stroke="var(--color-washed)" strokeWidth="1.5" />
        <rect
          x="192"
          y="100"
          width="36"
          height="56"
          rx="2"
          stroke="var(--color-indigo-deep)"
          strokeWidth="2.5"
        />
        <rect x="195" y="88" width="30" height="12" rx="1.5" fill="var(--color-indigo-deep)" />
        <path d="M199 92 H221 M199 96 H221" stroke="var(--color-washed)" strokeWidth="1.5" />
      </Frame>
    );
  }
  // 원단 염색 · 프린팅 — 염욕을 지나는 원단과 디지털 프린트 헤드
  return (
    <Frame>
      <line
        x1="14"
        y1="156"
        x2="226"
        y2="156"
        stroke="var(--color-indigo-deep)"
        strokeWidth="2.5"
      />
      <rect x="25" y="60" width="6" height="96" fill="var(--color-indigo-deep)" />
      <rect x="205" y="12" width="6" height="144" fill="var(--color-indigo-deep)" />
      <path d="M134 12 H208" stroke="var(--color-indigo-deep)" strokeWidth="2.5" />
      <path
        d="M28 56 H60 C 76 56, 72 132, 86 132 H104 C 118 132, 114 56, 130 56 H208"
        stroke="var(--color-indigo-deep)"
        strokeWidth="26"
      />
      <path
        d="M28 56 H60 C 76 56, 72 132, 86 132 H95"
        stroke="var(--color-paper)"
        strokeWidth="21"
      />
      <path
        d="M95 132 H104 C 118 132, 114 56, 130 56 H208"
        stroke="var(--color-denim)"
        strokeWidth="21"
      />
      <path
        d="M46 52 L50 60 M53 52 L57 60 M60 52 L64 60"
        stroke="var(--color-indigo-deep)"
        strokeWidth="1.5"
      />
      <g fill="var(--color-washed)">
        <circle cx="154" cy="50" r="1.6" />
        <circle cx="162" cy="50" r="2" />
        <circle cx="170" cy="50" r="2.4" />
        <circle cx="178" cy="50" r="2.8" />
        <circle cx="186" cy="50" r="3.2" />
        <circle cx="154" cy="56" r="1.6" />
        <circle cx="162" cy="56" r="2" />
        <circle cx="170" cy="56" r="2.4" />
        <circle cx="178" cy="56" r="2.8" />
        <circle cx="186" cy="56" r="3.2" />
        <circle cx="154" cy="62" r="1.6" />
        <circle cx="162" cy="62" r="2" />
        <circle cx="170" cy="62" r="2.4" />
        <circle cx="178" cy="62" r="2.8" />
        <circle cx="186" cy="62" r="3.2" />
      </g>
      <path
        d="M53 102 H137 V150 Q137 155 132 155 H58 Q53 155 53 150 Z"
        fill="var(--color-indigo-deep)"
      />
      <line x1="53" y1="102" x2="137" y2="102" stroke="var(--color-washed)" strokeWidth="1.5" />
      <path
        d="M52 96 V150 Q52 156 58 156 H132 Q138 156 138 150 V96 M48 96 H56 M134 96 H142"
        stroke="var(--color-indigo-deep)"
        strokeWidth="2.5"
      />
      <circle
        cx="28"
        cy="56"
        r="17"
        fill="var(--color-paper)"
        stroke="var(--color-indigo-deep)"
        strokeWidth="2.5"
      />
      <circle cx="28" cy="56" r="4" fill="var(--color-indigo-deep)" />
      <circle
        cx="208"
        cy="56"
        r="17"
        fill="var(--color-denim)"
        stroke="var(--color-indigo-deep)"
        strokeWidth="2.5"
      />
      <circle cx="208" cy="56" r="4" fill="var(--color-indigo-deep)" />
      <rect x="159" y="12" width="6" height="6" fill="var(--color-indigo-deep)" />
      <rect
        x="146"
        y="17"
        width="32"
        height="14"
        rx="2"
        fill="var(--color-denim)"
        stroke="var(--color-indigo-deep)"
        strokeWidth="2.5"
      />
      <rect
        x="144"
        y="31"
        width="36"
        height="6"
        rx="1"
        fill="var(--color-washed)"
        stroke="var(--color-indigo-deep)"
        strokeWidth="1.5"
      />
      <path
        d="M150 32.5 V35.5 M156 32.5 V35.5 M162 32.5 V35.5 M168 32.5 V35.5 M174 32.5 V35.5"
        stroke="var(--color-indigo-deep)"
        strokeWidth="1.5"
      />
      <circle cx="158" cy="40.5" r="1.4" fill="var(--color-indigo-deep)" />
      <circle cx="168" cy="41" r="1.4" fill="var(--color-indigo-deep)" />
    </Frame>
  );
}
