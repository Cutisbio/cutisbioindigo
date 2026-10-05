# Blugene 시각자료 대장

자료 기준일: **2026-09-06**
자산 생성: `npm run assets:blugene` (`scripts/build-blugene-assets.py`)
생성 결과 목록: `public/blugene/asset-manifest.json` (원본 경로 · 픽셀 크기 · 바이트)

이 문서는 사이트에 쓰인 모든 시각자료를 **네 가지 성격**으로 구분한다.
화면에도 같은 구분이 `AssetKind` 배지(시험 사진 / 개념 이미지 / 브랜드 이미지 / 카탈로그 도판)로 표시된다.

| 성격 | 뜻 |
|---|---|
| **시험 사진** | 카탈로그에 수록된 실제 시험·실물 사진. 색보정 없이 크기만 조정. |
| **카탈로그 도판** | 카탈로그에 인쇄된 도표·색상 견본. 실물 촬영이 아님. |
| **개념 이미지** | 개념 설명용 삽화·합성 이미지. 실제 시설·고객·시험 결과가 아님. |
| **브랜드 이미지** | 브랜드 서사를 위한 이미지. 제품 성능이나 고객 사례가 아님. |

---

## 1. 카탈로그 원본에서 가져온 자산

모두 `Blugene_Website_Brief/assets/catalogue/` 의 원본에서 **축소(LANCZOS)만** 거쳤다.
색보정 · 자동 대비 · 채도 강화 · AI 업스케일링 · 브랜드색 오버레이를 적용하지 않았다.

| 웹 경로 | 성격 | 크기 | 출처 | 화면 alt (한국어 원본) |
|---|---|---|---|---|
| `/blugene/brand/hero-family-denim.webp` | 브랜드 이미지 | 1732×870 · 204KB | p.1 `embedded/p01-xref27.png` | 데님 재킷을 입은 보호자가 아이를 안고 옥수수밭과 초원, 물가가 보이는 풍경을 바라보는 장면 (`Hero.imageAlt`) |
| `/blugene/brand/hero-family-denim-1200.webp` | 브랜드 이미지 | 1200×603 · 123KB | 같음 | 같음 (브랜드 페이지용) |
| `/blugene/brand/og-cover.jpg` | 브랜드 이미지 | 1200×630 · 150KB | 같음 (중앙 크롭) | 링크 미리보기 전용 (화면 비노출) |
| `/blugene/brand/value-chain.webp` | 개념 이미지 | 784×258 · 59KB | p.12 `embedded/p12-xref184.png` | 원료 작물, 발효 설비, 푸른 원단, 데님을 입은 사람으로 이어지는 가치사슬 개념 이미지 (`Environment.imageAlt`) |
| `/blugene/brand/cutisbio-wordmark.png` | 브랜드 이미지 | 456×103 · 20KB | p.1 `embedded/p01-xref6.png` | 데이터로만 보관 (현재 화면에서는 기존 `/logo.png` 사용) |
| `/blugene/technology/four-production-routes.png` | 개념 이미지 | 1191×771 · 160KB | p.2 Figure 1-1 | 원유 · 바이오매스 · 인디고 식물에서 출발하는 네 가지 인디고 합성 경로 도식 (`Technology.routesAlt`) |
| `/blugene/technology/carbon-pathways.png` | 개념 이미지 | 1230×678 · 277KB | p.2 Figure 1-2 | 화면에서 사용 중지 — 2026-09-12 고객 요청으로 기술 페이지의 「카탈로그의 개념도」 블록을 뺐다 (파일과 자산 생성 목록은 남김, alt 키 삭제) |
| `/blugene/technology/worker-safety.png` | 개념 이미지 | 988×331 · 188KB | p.4 Figure 2-1 | 화면에서 사용 중지 — 2026-09-12 고객 요청으로 기술 페이지의 「작업 환경」 단락을 뺐다 (파일과 자산 생성 목록은 남김, alt 키 삭제) |
| `/blugene/evidence/biobased-carbon-chart.png` | 시험 사진 | 1116×681 · 41KB | p.3 Figure 1-3 | 바이오 기반 탄소 함량 비교 그래프 원본 |
| `/blugene/evidence/biobased-carbon-table.png` | 시험 사진 | 1151×756 · 154KB | p.3 Table 1-1 | C14 시험 결과 표 원본 |
| `/blugene/evidence/aniline-results.png` | 시험 사진 | 1163×1545 · 133KB | p.5 Figure 2-2 · Table 2-3 | 아닐린 · N-메틸아닐린 분석 그래프·표 원본 |
| `/blugene/performance/fabric-comparison.webp` | 시험 사진 | 1075×376 · 53KB | p.6 Figure 3-1 (라벨 포함) | 9개 원단 견본 사진. 식물성 #1~#3, 화학 #4~#6, 바이오 #7~#9 (`Performance.fabricAlt`) |
| `/blugene/performance/fabric-strip.webp` | 시험 사진 | 1147×193 · 28KB | p.6 `embedded/p06-xref106.png` | 라벨 없는 원단 견본 원본 |
| `/blugene/performance/fastness-tables.png` | 시험 사진 | 1198×943 · 163KB | p.6 Table 3-1~3-4 | 견뢰도 표 원본 (HTML 표와 대조용) |
| `/blugene/shades/swatch-A1…B6.png` (12개) | 카탈로그 도판 | 각 193×182 전후 · 0.5KB | p.7 Figure 4-1 `embedded/p07-xref111~121` | 카탈로그 p.7 Figure 4-1 의 농도별 염색 견본 {code} (`ShadeLibrary.swatchAlt`) |
| `/blugene/shades/concentration-shades.webp` | 카탈로그 도판 | 1128×570 · 14KB | p.7 Figure 4-1 (전체) | 농도별 견본 도판 원본 |
| `/blugene/shades/indirubin-indigo-100.webp` | 시험 사진 | 517×386 · 48KB | p.7 Figure 4-2 | 인디고 100% 로 염색한 데님 원단 사진 (`ShadeLibrary.indirubinAltA`) |
| `/blugene/shades/indirubin-indigo-94.webp` | 시험 사진 | 517×386 · 54KB | p.7 Figure 4-2 | 인디고 94% · 인디루빈 6% 로 염색한 데님 원단 사진 (`ShadeLibrary.indirubinAltB`) |
| `/blugene/products/powder.png` | 시험 사진 | 290×208 · 35KB | p.9 `embedded/p09-xref164.png` | 접시에 담긴 짙은 청색 바이오 인디고 분말 (`Products.powderAlt`) |
| `/blugene/products/ink-jar.png` | 시험 사진 | 176×264 · 21KB | p.9 `embedded/p09-xref161.png` | 짙은 청색 바이오 인디고 디지털 프린팅 잉크가 담긴 유리병 (`Products.inkAlt`) |
| `/blugene/products/powder-ink-cycles.png` | 시험 사진 | 1235×1175 · 81KB | p.8 Figure 5-1 | **현재 미사용** — 2026-10-05 고객 요청으로 고객 제공 염색사 사진표(10절)로 바꿨다. 파일은 남김 |
| `/blugene/printing/ink-process.png` | 개념 이미지 | 1363×390 · 122KB | p.9 Figure 6-1 | 원료 준비 → 프리믹싱 → 밀링 → 여과 → 제형 완성 흐름 도식 (`Printing.processAlt`) |
| `/blugene/printing/pair-a-original.webp` | 시험 사진 | 184×265 · 19KB | p.9 `embedded/p09-xref155.png` | 디지털 프린팅에 사용한 원작 이미지 1 (`Printing.pairAltOriginal`) |
| `/blugene/printing/pair-a-printed.webp` | 시험 사진 | 285×458 · 27KB | p.9 `embedded/p09-xref156.png` | 같은 이미지를 바이오 인디고 잉크로 프린팅한 결과 1 |
| `/blugene/printing/pair-b-original.webp` | 시험 사진 | 203×231 · 22KB | p.9 `embedded/p09-xref157.png` | 원작 이미지 2 |
| `/blugene/printing/pair-b-printed.webp` | 시험 사진 | 384×456 · 55KB | p.9 `embedded/p09-xref158.png` | 프린팅 결과 2 |
| `/blugene/certifications/zdhc-certificate.png` | 시험 사진 | 611×868 · 198KB | p.10 `embedded/p10-xref171.png` | ZDHC MRSL Level 1 Version 3.1 인증서 원본 이미지 |
| `/blugene/certifications/oeko-certificate.png` | 시험 사진 | 610×875 · 144KB | p.10 `embedded/p10-xref172.png` | OEKO-TEX® ECO PASSPORT 인증서 원본 이미지 (2쪽 중 1쪽) |
| `/blugene/certifications/usda-certificate.png` | 시험 사진 | 689×524 · 215KB | p.11 `embedded/p11-xref179.png` | USDA BioPreferred® 인증서 원본 이미지 |
| `/blugene/certifications/okbiobased-certificate.png` | 시험 사진 | 590×851 · 330KB | p.11 `embedded/p11-xref177.png` | TÜV AUSTRIA OK biobased 인증서 원본 이미지 |
| `/blugene/catalogue/page-01…12.webp` | 시험 사진 | 각 1000px 폭 | 카탈로그 12쪽 | CutisBio 바이오 인디고 카탈로그 {page}쪽 (`DataHub.cataloguePageAlt`) |
| `/blugene/catalogue/CutisBio-CB-Bioindigo-Catalogue-EN-2026-07.pdf` | 원본 | 1.9MB | 제공 PDF 원본 | 내려받기용 |

## 2. CutisBio 로고 (제공받은 원본 SVG)

원본: `logo_cutis_2.svg` (Adobe Illustrator 내보내기, 2026-09 제공)

| 웹 경로 | 용도 | 크기 |
|---|---|---|
| `/brand/cutisbio-logo.svg` | 밝은 배경 — 헤더 락업 · 브랜드 페이지 락업 · **회사 소개 페이지 상단** | viewBox 296.05 × 62.35 (약 4.75 : 1) |
| `/brand/cutisbio-logo-white.svg` | 어두운 배경 — 푸터 (딥 인디고 위) | 같음 |
| `/brand/cutisbio-logo.png` | **구조화 데이터(JSON-LD) 전용** — Organization.logo · Article.publisher.logo | 595 × 128 (흰 배경) |

`.png` 는 화면에 쓰지 않는다. schema.org 로고는 검색엔진이 읽는 값이고 Google 은 래스터(JPG/PNG/GIF)를
요구하므로, 같은 SVG 를 헤드리스 Chrome 으로 592px 폭에 렌더링한 뒤 내용 경계로 잘라 만들었다.
기존 `/logo.png` 는 여백이 매우 넓은 판본이라 더 이상 참조하지 않는다(파일은 저장소에 남아 있다).

원본에서 손댄 것은 두 가지뿐이며 **형태는 바꾸지 않았다.**

1. **viewBox 를 실제 그림 영역에 맞춰 잘랐다.** 원본 viewBox 는 `0 0 595.28 202.29` 인데
   실제 그림은 `x 134.47 · y 70.47 · w 295.05 · h 61.35` 영역에만 있어, 그대로 쓰면 여백이 절반을 넘어
   같은 표시 크기에서 로고가 아주 작게 보였다. 헤드리스 Chrome 의 `getBBox()` 로 실측해
   여백 0.5 를 두고 `133.97 69.97 296.05 62.35` 로 잘랐다.
2. **Illustrator 잔재인 흰색 라운드 사각형(`.st3`)을 제거했다.** 글자 위쪽(y 22~38)에 떠 있는
   흰색 도형이라 흰 배경에서는 보이지 않으면서 크롭 범위만 위로 넓혔다.

어두운 배경용 판본은 위와 같은 형태에 **색만 흰색 단색으로** 바꿨다(로고 단색 사용의 일반적인 처리).
방패 안쪽의 얇은 검정 헤어라인(`.st2`)은 흰 실루엣에서 의미가 없어 지웠다.

락업(헤더 · 푸터 · 브랜드 페이지)의 표시 크기는 `src/components/blugene/Wordmark.tsx` 의 `SCALE` 한 곳에서 관리한다.
회사 소개 페이지 상단의 단독 로고는 `about/page.tsx` 에서 `w-[200px] sm:w-[247px] h-auto` 로 지정하며,
`height` 를 고정하지 않아 원본 비율이 그대로 유지된다.
로고 안에서 글자는 방패보다 낮아(약 69%) 보이므로, 글자가 읽히도록 높이를 조금 넉넉히 잡았다
(헤더 18px · 브랜드 페이지 24px · 작은 크기 13px).

> 원본 SVG 는 문자가 이미 아웃라인(패스)으로 변환되어 있어 폰트 의존성이 없다.
> 로고를 교체할 때는 두 파일을 함께 바꾸고 `Wordmark.tsx` 의 가로세로비도 확인해야 한다.

## 3. 저장소에 원래 있던 자산 중 계속 쓰는 것

| 웹 경로 | 성격 | 용도 |
|---|---|---|
| `/logo.png` | 브랜드 이미지 | **현재 미사용.** 여백이 넓은 예전 래스터 판본. 회사 소개 페이지와 구조화 데이터 모두 `/brand/cutisbio-logo.*` 로 교체됨 |
| `/4ZDHC.png`, `/oeko-tex-eco-passport-logo.png`, `/2BioPreferredLabel.PNG`, `/1okbiobased.png` | 인증 마크 | 인증 카드의 마크. 정식 인증 마크 파일이다. (`3OEKO-TEX® Eco Passport_logo.png` → 특수문자·공백 없는 이름으로 변경) |
| `/test.png` | 시험 사진 | 추가 원단 평가 사례 (일본어 라벨). 출처 미확인을 화면에 명시하고 카탈로그 시험과 분리해 표시 |
| `/favicon.svg`, `/favicon.ico` | 아이콘 | 그대로 |

## 4. 코드로 직접 그린 시각자료 (이미지 파일 없음)

모두 인라인 SVG / HTML 이며 텍스트가 이미지로 구워지지 않는다. 다국어로 번역되고 스크린리더로 읽힌다.

| 컴포넌트 | 내용 | 근거 |
|---|---|---|
| `ComparisonChart.tsx` | 시판 인디고 9개 샘플의 아닐린 · N-메틸아닐린 막대그래프. 0부터 시작하는 축, N.D. 는 막대 없이 별도 표식, 그룹(화학/식물/바이오) 구분, 아래에 실제 HTML 데이터 표 병기 | p.5 Table 2-3 |
| `ProductionPathway.tsx` | 재생 가능한 원료 → 미생물 발효 → 인디고 회수·제품화 → 원단 염색·프린팅 4단계 개념도. 선 아이콘은 장식(aria-hidden)이고 의미는 텍스트가 담당 | p.2 · p.12 |
| `EvidenceTables.tsx` | C14 · 아닐린 시험 결과 전체 표 (9개 샘플 × 시험기관·시험법·성적서 번호·일자) | p.3 Table 1-1, p.5 Table 2-3 |
| `FastnessTables.tsx` | 견뢰도 4개 표를 2단 머리글 HTML 표로 재구현. 등급 문자열('4-5')을 그대로 출력 | p.6 Table 3-1~3-4 |
| `PrintingGallery.tsx` 의 공정 플로우 | 잉크 제조 5단계. 한국어 설명과 원문 표기(`Raw Material Preparation` … `Formation`)를 나란히 표시 | p.9 Figure 6-1 |
| `AnilineStructures.tsx` | 아닐린(C₆H₅NH₂) · N-메틸아닐린(C₆H₅NHCH₃) 골격 구조식. 검증된 구조를 좌표로 계산해 SVG 로 그렸다 | p.4 서술 |
| `CarbonEvidencePanel.tsx` | 기술 페이지 「분명한 근거」의 98% 패널 — 큰 숫자 · 100개 중 98개를 칠한 점 격자(20×5, role="img") · 시험 메타 · 데이터 페이지 링크. 숫자와 메타는 evidence.ts 의 carbonTest, 글자는 messages. 고객 시안 `Blugene_Website_Brief/assets/mockups/2026-10-04-carbon-evidence-panel.svg`(2026-10-04)을 코드로 옮긴 것 — 시안 SVG 는 글자가 들어 있어 화면에 쓰지 않는다 | p.3 Table 1-1 |
| `DyedYarnFigure.tsx` | 염색 · 프린팅 페이지 「염색 횟수에 따른 발색 비교」의 염색사 사진표 — 4 · 6 · 8회 염색 × 염색사 · 1회 세탁 사진 6장(10절)을 CSS 격자에 놓고 표제 · 열 · 행 · 시료명을 messages(`DyedYarn.*`)에서 읽어 일곱 언어로 번역한다. 고객 SVG 의 글자는 쓰지 않는다 | 고객 제공 SVG(2026-10-05) |
| `ThreadMotif.tsx` | 데님 실 두 가닥을 연상시키는 추상 선. **순수 장식**(aria-hidden)이며 DNA 이중나선·화학구조도·인증마크로 읽히지 않게 그렸다 | 브랜드 표현 |
| `Wordmark.tsx` + `BlugeneMark.tsx` | Blugene 워드마크(텍스트)의 B 앞에 열두 갈래 마크를 붙인 락업. 마크는 고객의 로고 심벌 시트(`Blugene_Website_Brief/assets/brand/blugene-symbol-color-variations.jpg`) 「후보 01」에서 `scripts/extract-blugene-mark.mjs` 로 잘라낸 알파 마스크 PNG(`/brand/blugene-mark.png`)를 CSS mask 로 씌운 것이라 모양이 시트와 같다. 마크 색은 밝은 바탕에서 1초마다 파랑 일곱 가지를 순환(`.blugene-mark`, globals.css)하고 어두운 바탕(푸터)에서는 흰색 고정. 서체는 `.blugene-wordmark`(globals.css), 크기는 `SCALE` 한 곳에서 관리한다 | 브랜드 표현 + 고객 시트 |

## 5. 생성형 도구로 만든 이미지

**이번 작업에서 생성형 이미지 도구로 만든 이미지는 없다.**

Master Prompt §8 의 A(세계인의 일상과 데님 보조 브랜드 사진)와 B(인디고의 DNA 추상 이미지)는
이 환경에 이미지 생성 도구가 없어 **제작하지 않았다.** 완료한 것처럼 보고하지 않는다.
대신 §8 이 허용한 대로 카탈로그 p.1 원본 이미지와 카탈로그 도판만으로 화면을 구성했고,
C(정확한 SVG 개념도)와 D(근거를 읽는 차트·색상 도구)는 위 4절과 같이 **코드로 구현**했다.

필요해지면 아래 프롬프트를 그대로 쓸 수 있다 (Master Prompt §8 원문).

<details>
<summary>A. 세계인의 일상과 데님 — 보조 브랜드 사진 (미제작)</summary>

> Create an editorial lifestyle photograph for Blugene, a biotechnology-based indigo ingredient brand. A small, naturally interacting group of adults across generations, with a range of skin tones and body types, wearing everyday denim of different washes. An understated urban courtyard in soft daylight. Candid, relaxed, real fabric texture, believable hands and anatomy, tasteful fashion editorial composition. Deep indigo, washed blue, cotton white and warm neutral tones. Wide 16:9 composition with breathing room for responsive cropping. No text, no logos, no flags, no nationality labels, no laboratory, no medical cues, no environmental performance graphics. This is a conceptual brand image, not documentation of actual customers or Blugene-dyed garments.

용도: 브랜드 선언 영역 1장. 제작하면 `AssetKind`를 '브랜드 이미지'로 표시하고, 사람 얼굴 위에 문구를 올리지 않는다.
</details>

<details>
<summary>B. 인디고의 DNA — 소재 기반 추상 이미지 (미제작)</summary>

> Create a refined conceptual textile image for Blugene. Two strands of deep indigo cotton thread gently intertwine in a loose double-helix rhythm and resolve into a detailed denim twill weave. Photorealistic fibers and tactile fabric, subtle studio daylight, cotton-ivory background, restrained premium material photography. A metaphor for biotechnology reimagining how indigo is produced, not a molecular or scientific diagram. No atoms, no molecular bonds, no DNA letters, no skin penetration, no floating scientific equations, no microbes on clothing, no text or logos. Leave generous negative space for HTML typography. Landscape 3:2 composition.

현재는 같은 역할을 `ThreadMotif.tsx` (코드로 그린 추상 선)가 대신하고 있다.
</details>

### 추가 촬영·제작 제안 (자료가 준비되면)

1. **브랜드 선언 영역의 실사 이미지** — 연령·피부색·체형이 다양한 성인들의 일상적인 데님 착장.
   국기 · 인종 이름표 · 과장된 민족 의상을 쓰지 않는다. 모바일용 세로 구도를 함께 촬영한다.
2. **제품 패키지 사진** — 분말·잉크의 실제 공급 상태. 규격이 확정되면.
3. **파트너 원단 사례** — 출처(브랜드 · 공장 · 시험조건)를 명시할 수 있는 경우에만.

## 6. 제거한 자산

| 파일 | 조치 | 이유 |
|---|---|---|
| `public/aniline-infographic.png` | **삭제** | 이미지에 `Bladder Cancer Risks` 헤드라인과 `cutisbio indigo: Aniline-Free & Safe` 배너가 픽셀로 인쇄되어 있었다. ① 방광암 귀속은 제공 카탈로그에 근거가 없고(원문에 'bladder' 가 한 번도 나오지 않는다), ② `Aniline-Free & Safe` 는 불검출을 절대적 안전 주장으로 확대한 표현이며, ③ 구 브랜드명이 6개 언어 전부에 그대로 노출됐고, ④ N-메틸아닐린 구조가 `NCH₃` 로 잘못 그려져 있었다. 텍스트가 이미지에 구워져 번역·금지어 검사·근거 규칙을 모두 우회했다. → 정확한 구조식 SVG(`AnilineStructures.tsx`)로 대체했다. |
| `public/aniline-health.png` | **삭제** | 같은 계열의 자료이며 어디에서도 참조되지 않았다. |
| `public/jeanforest.mp4` (14.9MB) | 화면에서 사용 중지 (파일은 저장소에 남김) | Hero 배경 영상이 초기 로딩을 크게 무겁게 했고, 카탈로그 p.1 이미지가 브랜드 서사를 더 정확히 전달한다. |
| `public/step1-dna-design.jpg` 외 3개 | 화면에서 사용 중지 (파일은 남김) | 출처가 확인되지 않는 이미지다. 4단계 설명은 `ProductionPathway.tsx` 개념도로 대체했다. |
| `public/cutisbio-microbe.jpg`, `dna-design.webp` | 미사용 | 현재 화면에서 참조하지 않는다. |

> 삭제한 파일은 git 이력에 남아 있으므로 필요하면 복구할 수 있다.
> 다만 위 두 인포그래픽은 **공개 URL 로 접근 가능한 상태로 두면 안 되는 내용**이라 파일 자체를 제거했다.

## 7. 이미지 사용 규칙 (유지보수용)

- 원단 · 색상 견본 · 인증서에는 `className="swatch-true-color"` 를 붙인다 (필터 · 블렌드모드 차단).
- 새 이미지를 넣을 때는 `scripts/build-blugene-assets.py` 의 `JOBS` 에 추가해
  `asset-manifest.json` 에 출처가 기록되게 한다.
- 텍스트를 이미지에 굽지 않는다. 설명은 반드시 `messages/*.json` 을 거친다.
- 사람 사진 위에 문구나 시험 완료 배지를 올리지 않는다.
- `npm run check:blugene` 이 코드가 참조하는 이미지의 존재 여부를 검사한다.

## 8. 외부 기관 공식 아이콘 — 유엔 SDG (2026-09-29)

브랜드 페이지 「우리가 기여하려는 네 가지 목표」(`SdgSection`, SDG 3 · 6 · 9 · 12)에 쓰는 유엔 지속가능발전목표 아이콘. 카탈로그 자산이 아니므로
`asset-manifest.json` 에는 넣지 않고 여기에 출처와 사용 조건을 적는다. 파일은 유엔 원본 그대로다(파일명 · 크기 1500×1500 · 색 변경 없음).

| 웹 경로 | 원본 (un.org/sustainabledevelopment/news/communications-material, 2026-09-29 내려받음) | 쓰는 화면 |
|---|---|---|
| `/sdg/E-WEB-Goal-{03,06,09,12}.png` | 「17 SDG Icons (WEB)」 영어판 `E-SDG-Icons-WEB.zip` (2025-07 판) | 영어 · 한국어 · 일본어 · 이탈리아어 · 터키어 화면 |
| `/sdg/F-WEB-Goal-{03,06,09,12}.png` | 같은 페이지 프랑스어판 `F-SDG-Icons-2019-WEB.zip` | 프랑스어 화면 |
| `/sdg/C-WEB-Goal-{03,06,09,12}.png` | 같은 페이지 중국어판 `C-SDG-Icons-2019-WEB.zip` | 중국어 화면 |

유엔은 6개 공용어(아랍어 · 중국어 · 영어 · 프랑스어 · 러시아어 · 스페인어) 판만 제공한다. 다른 언어로 아이콘 문구를 번역하는 것은
사용자 책임이라고 지침에 적혀 있어, 우리는 번역하지 않고 영어판을 쓴다.

### 유엔 사용 지침 요약 (SDG Guidelines 2023-09 판 · 같은 페이지 FAQ)

- 유엔 엠블럼이 든 로고(Version 1)는 유엔 기관 전용이다. 기업 등 외부 기관은 엠블럼 없는 로고(Version 2)와 17개 아이콘만 쓴다. 우리는 아이콘만 쓴다.
- **정보성 용도**(주로 설명적이고 비상업적이며 모금 목적이 아닌 것)는 사전 허가 없이 쓸 수 있다. 유엔 FAQ: 영리 기업도 자기 조직의
  SDG 관련 활동과 지지를 알리는 기업 자료(발표 · 뉴스레터 · 비재무 보고서 등)에는 허가가 필요 없다.
- **모금 목적과 상업적 용도**(영리 기업의 사용, 판촉물 · 제품에 싣는 것)는 온라인 Permission Request Form 으로 사전 서면 허가와
  라이선스 계약이 필요하다. 제품 · 서비스 광고 맥락, 유엔의 보증을 암시하는 사용, 자체 홍보 · 금전적 이득 목적, 자체 로고와의 결합은 금지.
- 아이콘은 번호 · 이름 · 그림을 갖춘 **전체로만** 쓴다. 정사각 비율 유지. 자르기 · 정사각 외 형태(둥근 모서리 포함) · 그림자 · 입체 효과 ·
  색 · 서체 변경 · 요소 재배치 · 늘리기 금지. 임의로 골라 무리 짓지 않는다(한 줄 또는 왼쪽 정렬).
- 아이콘을 인터넷에 올릴 때는 **지침을 같은 페이지에** 둬야 한다 — 우리는 유엔 원본 PDF 링크로 둔다. 아이콘을 쓰는 온라인 · 인쇄물에는
  유엔 SDG 사이트 링크(https://www.un.org/sustainabledevelopment)와 고지문 「The content of this publication has not been approved by
  the United Nations and does not reflect the views of the United Nations or its officials or Member States」를 실어야 한다 — 화면 각주와
  링크 목록이 이것이다(`Sdg.unDisclaimer` · `Sdg.unSiteLabel` · `Sdg.guidelinesLabel`).
- 사용 기한은 2030-12-31 까지다(그 뒤에는 SDG 를 다루는 간행물의 참고용으로만).

### 판단과 남은 일

- 이 섹션은 회사의 SDG 관련 활동과 지지를 알리는 정보성 화면으로 보고 사전 허가 없이 실었다. 다만 영리 기업의 사이트인 만큼 유엔이
  상업적 용도로 볼 여지가 있으므로, 온라인 Permission Request Form(https://shop.un.org/form/sdg-request-form, 화면 캡처 + 용도 설명)으로 서면 허가를 받아 두기를 권한다(고객 결정 사항).
- 제품 판매 페이지 · 광고 · 판촉물 · 명함에는 쓰지 않는다. 아이콘 옆에 회사 로고를 나란히 두지 않는다(두려면 지침 17쪽의 구분선 규칙을 따른다).

## 9. 고객 제공 사진 — 회사 소개 「핵심 사업 영역」 (2026-10-03)

고객이 2026-10-03 채팅으로 보낸 촬영 사진 세 장(파일명 2~4 — 파일 1 옷걸이 셔츠 사진은 2026-10-04 고객 요청으로 화면에서 빼고 파일 · 매니페스트 항목도 지웠다). `public/blugene/about/` 에 **원본 JPEG 그대로**(크기 · 색 무변환,
EXIF/XMP 메타데이터만 무손실 제거 — 위치 정보는 원래 없었다) 두고, 회사 소개 페이지의 「핵심 사업 영역」 단락에서 `ZoomableImage` 로 보여 준다.
고객이 '고화질'을 요청해 확대 창은 원본 파일을 그대로 연다(`originalOnZoom`). 썸네일만 next/image 가 최적화한다.
출처는 `scripts/build-blugene-assets.py` 의 `CLIENT_IMAGES` 와 `asset-manifest.json` 에 있다(이번에는 Python 이 없어 매니페스트 항목을 같은 형식으로 손으로 넣었다).

| 웹 경로 | 성격 | 크기 | 출처 | 화면 alt (한국어 원본) |
|---|---|---|---|---|
| `/blugene/about/booth-coex-2024.jpg` | 브랜드 이미지 (실물 촬영) | 1500×2000 · 448KB | 고객 사진 2 | 전시회의 큐티스바이오 부스(D08) 앞에서 바이오 인디고로 염색한 셔츠를 입은 모습. 뒤로 염색 샘플 천과 인디고 분말 병이 보인다 |
| `/blugene/about/scarves-gradient.jpg` | 브랜드 이미지 (실물 촬영) | 1382×922 · 184KB | 고객 사진 3 | 바이오 인디고로 농도를 달리해 염색한 얇은 스카프 여러 장을 밝은 색부터 짙은 색 순서로 나란히 놓은 모습 |
| `/blugene/about/scarves-roses.jpg` | 브랜드 이미지 (실물 촬영) | 1382×922 · 155KB | 고객 사진 4 | 농도가 다른 바이오 인디고 염색 스카프 여러 장을 장미 모양으로 말아 모아 둔 모습 |

- 전시 부스 사진에는 사람과 제3자 로고(INDIGOCEAN BLUE, 일부만 보이는 다른 로고)가 찍혀 있다. 고객이 제공한 그대로 쓰며,
  인물 이름은 화면에 적지 않고 사진 위에 문구 · 배지를 올리지 않는다(7절 규칙).
- alt · 캡션은 사진에 보이는 것만 적고("농도별 염색", "전시 부스"), 염색 성능 · 견뢰도 · 안전성을 주장하지 않는다.
- 화면 배지는 `Common.brandImage`(브랜드 이미지)를 쓰고, 확대 창 안내문(`About.galleryNote`)이 큐티스바이오가 촬영한 원본임을 밝힌다.

## 10. 고객 제공 사진 — 염색 · 프린팅 「염색 횟수에 따른 발색 비교」 염색사 사진 (2026-10-05)

고객이 2026-10-05 채팅으로 보낸 SVG(`CutisBio_Dyed_Yarn_Korean_Editable.svg`, 512×306 뷰박스 — PDF 5쪽의 JPEG 6장을 90° 돌려 내장하고
한국어 표제 · 표선을 벡터로 얹은 것)를 `Blugene_Website_Brief/assets/mockups/2026-10-05-dyed-yarn-figure.svg` 에 출처로 보관했다.
SVG 는 글자가 들어 있어 화면에 그대로 쓰지 않는다. 사진 6장만 꺼내 SVG 의 배치대로 **90° 회전만**(크기 · 색 무변환, JPEG q95) 해
`public/blugene/performance/dyed-yarn/` 에 두고, 표와 글자는 `DyedYarnFigure.tsx` 가 다시 그려 messages 에서 읽는다(일곱 언어).
색 비교 사진이라 next/image 재인코딩 없이(`unoptimized` + `.swatch-true-color`) 그대로 보여 준다.
출처는 `scripts/build-blugene-assets.py` 의 `CLIENT_IMAGES` 와 `asset-manifest.json` 에 있다(매니페스트 항목은 같은 형식으로 손으로 넣었다).

| 웹 경로 | 성격 | 크기 | 내용 |
|---|---|---|---|
| `/blugene/performance/dyed-yarn/cycles-4-dyed.jpg` | 시험 사진 (고객 제공) | 545×330 · 110KB | 4회 염색 · 염색사 — 위에서부터 Blugene②-1 · 석유화학 인디고 · Blugene②-2 |
| `/blugene/performance/dyed-yarn/cycles-4-washed.jpg` | 시험 사진 (고객 제공) | 725×331 · 150KB | 4회 염색 · 1회 세탁 — 위에서부터 Blugene②-1 · 석유화학 인디고 · Blugene②-2 |
| `/blugene/performance/dyed-yarn/cycles-6-dyed.jpg` | 시험 사진 (고객 제공) | 547×337 · 124KB | 6회 염색 · 염색사 — 위에서부터 Blugene②-1 · 석유화학 인디고 · Blugene②-2 |
| `/blugene/performance/dyed-yarn/cycles-6-washed.jpg` | 시험 사진 (고객 제공) | 724×338 · 174KB | 6회 염색 · 1회 세탁 — 위에서부터 Blugene②-1 · 석유화학 인디고 · Blugene②-2 |
| `/blugene/performance/dyed-yarn/cycles-8-dyed.jpg` | 시험 사진 (고객 제공) | 549×337 · 96KB | 8회 염색 · 염색사 — 위에서부터 Blugene②-1 · 석유화학 인디고 · Blugene②-2 |
| `/blugene/performance/dyed-yarn/cycles-8-washed.jpg` | 시험 사진 (고객 제공) | 728×336 · 104KB | 8회 염색 · 1회 세탁 — 위에서부터 Blugene②-1 · 석유화학 인디고 · Blugene②-2 |

- 조건(4 · 6 · 8회 염색, 1회 세탁)은 고객 자료의 표기 그대로다. 시료 표기는 2026-10-05 고객 지정으로 화면에서 Blugene1 · Blugene2 로 쓴다(자료의 원표기 Blugene②-1 · ②-2). 염색 조건 · 세탁 방법 · 측정값은 자료에 없어 적지 않는다.
- 좁은 화면(sm 미만)에서도 시료명이 사진 왼쪽에 같은 글자로 붙는다 — 블록마다 행 이름 아래에 [시료명 | 사진]을 염색사 · 1회 세탁 순으로 쌓는다(2026-10-05 고객 요청).
- 사진의 색 농담을 K/S · ΔE 로 환산하지 않으며, "모든 조건에서의 성능 우위를 뜻하지 않는다"를 `Products.cyclesNote` 로 밝힌다.
- 바꾸기 전의 카탈로그 p.8 Figure 5-1 도판(`/blugene/products/powder-ink-cycles.png`)은 파일만 남아 있다(1절).
